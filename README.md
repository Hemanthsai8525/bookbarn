# 📚 BookBarn - Online Bookstore Platform

A comprehensive, full-stack online bookstore application featuring separate portals for **Users**, **Vendors**, **Delivery Agents**, and **Admins**. Built with modern technologies to ensure a premium user experience, secure authentication, and efficient order management.

## 🚀 Live Demo

- **Frontend:** [https://bookbarn.netlify.app](https://bookbarn.netlify.app) (Replace with your actual Netlify URL)
- **Backend API:** [https://bookbarn-production.up.railway.app](https://bookbarn-production.up.railway.app) (Replace with your actual Railway URL)

---

## ✨ Key Features

### 👤 User Portal
- **Browse & Search:** Advanced filtering by category, price, and author.
- **Cart & Wishlist:** Seamless management of desired items.
- **Secure Checkout:** Integrated payment flow (simulated) and order placement.
- **Order Tracking:** Real-time status updates from processing to delivery.
- **Profile Security:** OTP-based password changes and profile updates.

### 🏪 Vendor Portal
- **Inventory Management:** Add, edit, and remove books.
- **Sales Analytics:** Visual dashboards for tracking performance.
- **Order Processing:** Manage incoming orders and assign to delivery.
- **Business Profile:** Customizable vendor details.

### 🚚 Delivery Agent Portal
- **Dashboard:** View assigned deliveries and earnings.
- **Status Updates:** Real-time marking of orders as Picked Up or Delivered.
- **History:** Track past deliveries and performance.

### 🛡️ Admin Portal
- **Platform Oversight:** Monitor all users, vendors, and agents.
- **Approvals:** Review and approve/reject vendor and agent registrations.
- **Analytics:** Global platform statistics and reporting.

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Java 17, Spring Boot 3.2.5
- **Security:** Spring Security, JWT Authentication, BCrypt Hashing
- **Database:** MySQL 8.0, Spring Data JPA, Hibernate
- **Email Service:** **Brevo (Sendinblue)** REST API for reliable OTP delivery
- **Build Tool:** Maven

### Frontend
- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS, Framer Motion (Animations)
- **Icons:** Lucide React
- **State/HTTP:** React Hooks, Axios

### Deployment & DevOps
- **Frontend Hosting:** Netlify
- **Backend Hosting:** Railway
- **Database:** Railway Managed MySQL
- **Version Control:** Git

---

## 📁 Project Structure

```bash
bookbarn/
├── bookapp/                    # Spring Boot Backend
│   ├── src/main/resources/     # Config files (application.properties)
│   └── src/main/java/          # Source code (Controllers, Services, Models)
│
├── frontend_bookapp/           # React Frontend
│   ├── src/components/         # Reusable UI components
│   ├── src/pages/              # Main route pages
│   └── src/services/           # API services (api.js)
│
├── BREVO_README.md             # Email integration details
└── NETLIFY_DEPLOYMENT.md       # Deployment guide
```

---

## ⚡ Local Development Setup

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven

### 1. Backend Setup (`bookapp`)

1.  **Configure Database:**
    Update `src/main/resources/application.properties` with your local MySQL credentials:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/bookstore
    spring.datasource.username=root
    spring.datasource.password=your_password
    ```

2.  **Configure Email (Brevo):**
    Set up your Brevo API credentials (see `BREVO_README.md` for details) in `application.properties` or environment variables:
    ```properties
    brevo.api.key=xkeysib-your-key
    brevo.sender.email=your-verified-email@domain.com
    ```

3.  **Run the Backend:**
    ```bash
    cd bookapp
    mvn spring-boot:run
    ```
    Server will start at `http://localhost:8080`.

### 2. Frontend Setup (`frontend_bookapp`)

1.  **Install Dependencies:**
    ```bash
    cd frontend_bookapp
    npm install
    ```

2.  **Configure Environment:**
    Create a `.env` file in the `frontend_bookapp` root (copy from `.env.example` if available):
    ```env
    VITE_API_URL=http://localhost:8080
    ```

3.  **Run the Frontend:**
    ```bash
    npm run dev
    ```
    App will launch at `http://localhost:5173`.

---

## 🚀 Deployment Guide

Detailed deployment instructions are available in [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md).

### Quick Summary:
1.  **Backend (Railway):**
    - Connect GitHub repo.
    - Set Root Directory to `bookapp`.
    - Add MySQL plugin.
    - Set Environment Variables (`DATABASE_URL`, `BREVO_API_KEY`, etc.).

2.  **Frontend (Netlify):**
    - Connect GitHub repo.
    - Set Base Directory to `frontend_bookapp`.
    - Build Command: `npm run build`.
    - Publish Directory: `dist`.
    - Set `VITE_API_URL` to your Railway backend URL.

---

## 🔐 Security Features

- **JWT Auth:** Stateless authentication for scalable security.
- **RBAC:** Strict Role-Based Access Control ensuring users only access authorized resources.
- **Secure OTPs:** Email-based OTPs for sensitive actions (Registration, Password Reset), hashed with BCrypt.
- **CORS:** Configured to allow traffic only from trusted frontend domains.

---

## 📞 Support

For issues specifically related to Email/OTP, check `BREVO_README.md`.
For deployment troubleshooting, check `NETLIFY_DEPLOYMENT.md`.

---

**Made with ❤️ for the BookBarn Project**
