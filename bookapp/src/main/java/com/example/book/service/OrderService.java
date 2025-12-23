package com.example.book.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.book.model.Book;
import com.example.book.model.CartItem;
import com.example.book.model.Order;
import com.example.book.model.OrderHistory;
import com.example.book.repository.BookRepository;
import com.example.book.repository.CartRepository;
import com.example.book.repository.OrderHistoryRepository;
import com.example.book.repository.OrderRepository;

@Service
public class OrderService {

	private final OrderRepository repo;
	private final CartRepository cartRepo;
	private final BookRepository bookRepo;
	private final OrderHistoryRepository historyRepo;
	private final BookService bookService;
	private final com.example.book.repository.DeliveryAgentRepository deliveryRepo;
	private final com.example.book.repository.NotificationRepository notificationRepo;
	private final WebSocketService webSocketService;

	public OrderService(OrderRepository repo, CartRepository cartRepo, BookRepository bookRepo,
			OrderHistoryRepository historyRepo, BookService bookService,
			com.example.book.repository.NotificationRepository notificationRepo,
			com.example.book.repository.DeliveryAgentRepository deliveryRepo,
			WebSocketService webSocketService) {
		this.repo = repo;
		this.cartRepo = cartRepo;
		this.bookRepo = bookRepo;
		this.historyRepo = historyRepo;
		this.bookService = bookService;
		this.notificationRepo = notificationRepo;
		this.deliveryRepo = deliveryRepo;
		this.webSocketService = webSocketService;
	}

	// ------------------ PLACE ORDER ------------------
	@jakarta.transaction.Transactional
	public Order placeOrder(Long userId, String address, String phone, String paymentMethod) {

		if (userId == null)
			throw new RuntimeException("Invalid user");

		List<CartItem> items = cartRepo.findByUserIdAndOrderIsNull(userId);
		if (items.isEmpty())
			throw new RuntimeException("No items in cart");

		double total = 0;

		for (CartItem ci : items) {
			Book b = bookRepo.findById(ci.getBookId())
					.orElseThrow(() -> new RuntimeException("Book not found: " + ci.getBookId()));

			ci.setBook(b); // Ensure book is available for later steps

			// Check and deduct stock
			bookService.deductStock(ci.getBookId(), ci.getQuantity());

			total += b.getPrice() * ci.getQuantity();
		}

		Order order = new Order();
		order.setUserId(userId);
		order.setTotal(total);
		order.setAddress(address);
		order.setPhone(phone);
		order.setPaymentMethod(paymentMethod != null ? paymentMethod : "CARD"); // Default to CARD if null
		order.setStatus("PENDING");

		Order savedOrder = repo.save(order);

		for (CartItem ci : items) {
			ci.setOrder(savedOrder);
			cartRepo.save(ci);

			// Notify Vendor
			if (ci.getBook() != null && ci.getBook().getVendor() != null) {
				String msg = "New Order #" + savedOrder.getId() + ": " + ci.getQuantity() + " x "
						+ ci.getBook().getTitle();
				com.example.book.model.Notification n = new com.example.book.model.Notification(msg,
						ci.getBook().getVendor());
				notificationRepo.save(n);

				// Send real-time WebSocket notification to vendor
				webSocketService.notifyVendorNewOrder(ci.getBook().getVendor().getId(), enrichOrder(savedOrder));
				webSocketService.notifyVendor(ci.getBook().getVendor().getId(), msg);
			}
		}

		OrderHistory history = new OrderHistory("PENDING", savedOrder);
		historyRepo.save(history);
		savedOrder.getHistory().add(history);

		return enrichOrder(savedOrder);
	}

	// ------------------ UPDATE STATUS ------------------
	public Order updateStatus(Long orderId, String newStatus) {

		Order order = repo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

		order.setStatus(newStatus);

		OrderHistory history = new OrderHistory();
		history.setStatus(newStatus);
		history.setOrder(order);
		historyRepo.save(history);

		order.getHistory().add(history);

		Order savedOrder = repo.save(order);
		Order enrichedOrder = enrichOrder(savedOrder);

		// Send real-time updates to user
		if (order.getUserId() != null) {
			webSocketService.notifyUserOrderUpdate(order.getUserId(), enrichedOrder);
		}

		// Notify vendors about order status changes
		List<CartItem> items = cartRepo.findByOrderId(orderId);
		for (CartItem ci : items) {
			if (ci.getBook() != null && ci.getBook().getVendor() != null) {
				webSocketService.notifyVendorOrderUpdate(ci.getBook().getVendor().getId(), enrichedOrder);
			}
		}

		return enrichedOrder;
	}

	public Order confirmOrder(Long orderId) {
		Order order = repo.findById(orderId)
				.orElseThrow(() -> new RuntimeException("Order not found"));

		// VENDOR ACCEPTS -> READY_FOR_DELIVERY
		order.setStatus("READY_FOR_DELIVERY");

		// Add history entry
		OrderHistory h = new OrderHistory();
		h.setStatus("READY_FOR_DELIVERY");
		h.setOrder(order);

		historyRepo.save(h);
		order.getHistory().add(h);

		return repo.save(order);
	}

	// ------------------ DELETE ORDER ------------------
	public void deleteOrder(Long orderId) {
		Order order = repo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

		List<CartItem> items = cartRepo.findByOrderId(orderId);
		cartRepo.deleteAll(items);

		repo.delete(order);
	}

	// ------------------ USER ORDERS ------------------
	public List<Order> findByUserId(Long userId) {
		return repo.findByUserId(userId).stream().map(this::enrichOrder).toList();
	}

	// ------------------ ADMIN: ALL ORDERS ------------------
	public List<Order> findAll() {
		return repo.findAll().stream().map(this::enrichOrder).toList();
	}

	// ------------------ VENDOR ORDERS ------------------
	public List<Order> findByVendorId(Long vendorId) {
		return repo.findByVendorId(vendorId).stream().map(this::enrichOrder).toList();
	}

	// ------------------ DELIVERY: AVAILABLE ------------------
	public List<Order> findAvailableDeliveryOrders() {
		return repo.findByStatusAndAssignedAgentIsNull("READY_FOR_DELIVERY").stream().map(this::enrichOrder).toList();
	}

	// ------------------ DELIVERY: ASSIGN ------------------
	public Order assignDeliveryAgent(Long orderId, Long agentId) {
		Order order = repo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
		com.example.book.model.DeliveryAgent agent = deliveryRepo.findById(agentId)
				.orElseThrow(() -> new RuntimeException("Agent not found"));

		order.setAssignedAgent(agent);
		order.setStatus("SHIPPED"); // Or ASSIGNED. Let's use SHIPPED for simplicity as implied "Taken to delivery"

		OrderHistory h = new OrderHistory("SHIPPED", order);
		historyRepo.save(h);
		order.getHistory().add(h);

		Order savedOrder = repo.save(order);
		Order enrichedOrder = enrichOrder(savedOrder);

		// Send real-time notification to delivery agent
		webSocketService.notifyDeliveryAgentNewAssignment(agentId, enrichedOrder);

		// Notify user about shipment
		if (order.getUserId() != null) {
			webSocketService.notifyUserOrderUpdate(order.getUserId(), enrichedOrder);
		}

		// Notify vendor that order has been picked up
		List<CartItem> items = cartRepo.findByOrderId(orderId);
		for (CartItem ci : items) {
			if (ci.getBook() != null && ci.getBook().getVendor() != null) {
				webSocketService.notifyVendorOrderUpdate(ci.getBook().getVendor().getId(), enrichedOrder);
				webSocketService.notifyVendor(ci.getBook().getVendor().getId(),
						"Order #" + orderId + " has been picked up by " + agent.getName());
			}
		}

		return enrichedOrder;
	}

	public List<Order> findByAgentId(Long agentId) {
		return repo.findByAssignedAgentId(agentId).stream().map(this::enrichOrder).toList();
	}

	// ------------------ GET ORDER ------------------
	public Order getOrder(Long orderId) {
		Order order = repo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
		return enrichOrder(order);
	}

	// ------------------ ENRICH ORDER WITH BOOK DETAILS ------------------
	private Order enrichOrder(Order order) {

		List<CartItem> items = cartRepo.findByOrderId(order.getId());

		for (CartItem ci : items) {
			Book book = bookRepo.findById(ci.getBookId()).orElse(null);
			ci.setBook(book);
		}

		order.setItems(items);
		return order;
	}
}
