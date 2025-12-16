// src/pages/DeliveryOrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function friendlyDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso || "";
  }
}

export default function DeliveryOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function loadOrder() {
    setLoading(true);
    try {
      const res = await api.get(`/delivery/orders/${orderId}`);
      const ord = res.data;
      // sort history ascending by time
      if (Array.isArray(ord.history)) {
        ord.history = ord.history.slice().sort((a, b) => new Date(a.time) - new Date(b.time));
      }
      setOrder(ord);
    } catch (err) {
      console.error("Failed to load order:", err);
      alert("Failed to load order");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }

  // valid statuses agent can set
  const AGENT_STATUSES = ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

  // decide which buttons to show based on current order.status
  function canMarkShipped() {
    const s = (order?.status || "").toUpperCase();
    return s === "ASSIGNED" || s === "CONFIRMED";
  }
  function canMarkOutForDelivery() {
    const s = (order?.status || "").toUpperCase();
    return s === "SHIPPED";
  }
  function canMarkDelivered() {
    const s = (order?.status || "").toUpperCase();
    return s === "OUT_FOR_DELIVERY" || s === "SHIPPED";
  }

  async function updateStatus(newStatus) {
    if (!order) return;
    if (!AGENT_STATUSES.includes(newStatus)) {
      return alert("Not allowed status");
    }

    if (!confirm(`Mark order #${order.id} as ${newStatus.replaceAll("_", " ")}?`)) return;

    setUpdating(true);
    try {
      const res = await api.post(`/delivery/status/${order.id}/${newStatus}`);
      await loadOrder();
      alert("Status updated");
    } catch (err) {
      console.error("Status update failed:", err);
      alert(err?.response?.data?.error || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <div className="animate-pulse h-6 bg-gray-200 rounded w-48 mb-3" />
          <p className="text-gray-500">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const currentStatus = (order.status || "PENDING").toUpperCase();
  const timeline = Array.isArray(order.history) && order.history.length ? order.history : [
    { status: currentStatus, time: new Date().toISOString() }
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Order #{order.id}</h2>
              <div className="text-sm text-gray-500 mt-1">Placed by <span className="font-semibold">{order.userName || order.userId}</span></div>
              <div className="mt-2 text-sm text-gray-700">Address: {order.address}</div>
              <div className="text-sm text-gray-700">Phone: {order.phone}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold text-green-700">₹ {order.total}</div>
              <div className="mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentStatus === 'DELIVERED' ? 'bg-green-100 text-green-700' : currentStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {currentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold">Items</h3>
            <div className="mt-3 space-y-3">
              {order.items?.map(it => (
                <div key={it.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <div className="font-medium">{it.book?.title || `Book #${it.bookId}`}</div>
                    <div className="text-sm text-gray-500">{it.book?.author || ""}</div>
                  </div>
                  <div className="text-sm text-gray-700">
                    {it.quantity} × ₹ {it.book?.price || 0}
                    <div className="text-xs text-gray-400">Subtotal ₹ {(it.book?.price || 0) * it.quantity}</div>
                  </div>
                </div>
              ))}

              {(!order.items || order.items.length === 0) && (
                <div className="text-sm text-gray-500">No items recorded.</div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              disabled={!canMarkShipped() || updating}
              onClick={() => updateStatus("SHIPPED")}
              className={`px-4 py-2 rounded-md font-semibold ${canMarkShipped() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
            >
              Mark Shipped
            </button>

            <button
              disabled={!canMarkOutForDelivery() || updating}
              onClick={() => updateStatus("OUT_FOR_DELIVERY")}
              className={`px-4 py-2 rounded-md font-semibold ${canMarkOutForDelivery() ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
            >
              Mark Out for Delivery
            </button>

            <button
              disabled={!canMarkDelivered() || updating}
              onClick={() => updateStatus("DELIVERED")}
              className={`px-4 py-2 rounded-md font-semibold ${canMarkDelivered() ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
            >
              Mark Delivered
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Timeline</h3>
          <ol className="relative border-l border-gray-200 ml-3">
            {timeline.map((t, idx) => {
              const isLast = idx === timeline.length - 1;
              return (
                <li key={idx} className="mb-6 ml-6">
                  <span className="absolute -left-6 flex h-3 w-3 items-center justify-center rounded-full bg-indigo-500" />
                  <div>
                    <div className="font-semibold text-gray-800">{t.status}</div>
                    <div className="text-xs text-gray-500">{friendlyDate(t.time)}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}


