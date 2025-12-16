// src/pages/DeliveryDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function DeliveryDashboard() {
  const [assigned, setAssigned] = useState([]);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const agent = JSON.parse(localStorage.getItem("deliveryAgent"));
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadOrders() {
    if (!agent?.id) {
      setAssigned([]);
      setAvailable([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // assigned to this agent
      const aRes = await api.get(`/delivery/assigned/${agent.id}`);
      const assignedData = Array.isArray(aRes.data) ? aRes.data : [];
      // keep only ASSIGNED and SHIPPED (as requested)
      const assignedFiltered = assignedData.filter(o =>
        ["ASSIGNED", "SHIPPED", "OUT_FOR_DELIVERY"].includes((o.status || "").toUpperCase())
      );

      // available: backend returns available, but ensure only CONFIRMED
      const avRes = await api.get("/delivery/available");
      const avData = Array.isArray(avRes.data) ? avRes.data : [];
      const availableFiltered = avData.filter(o => (o.status || "").toUpperCase() === "CONFIRMED");

      setAssigned(assignedFiltered);
      setAvailable(availableFiltered);
    } catch (err) {
      console.error("Load orders failed:", err);
      setAssigned([]);
      setAvailable([]);
    } finally {
      setLoading(false);
    }
  }

  async function takeOrder(orderId) {
    if (!agent?.id) return alert("Agent info missing");
    try {
      await api.post("/delivery/assign", { agentId: agent.id, orderId });
      await loadOrders();
    } catch (err) {
      console.error("Failed to take order:", err);
      alert(err?.response?.data?.error || "Could not accept order");
    }
  }

  function openDetails(id) {
    navigate(`/delivery/order/${id}`);
  }

  const totalAssigned = assigned.length;
  const totalAvailable = available.length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <div className="animate-pulse h-6 bg-gray-200 rounded w-32 mb-4" />
          <p className="text-gray-500">Loading delivery dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Delivery Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, <span className="font-semibold text-indigo-600">{agent?.name || "Agent"}</span></p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              {totalAssigned} Active
            </div>
            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {totalAvailable} Available
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assigned */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                {/* icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">My Deliveries</h2>
            </div>

            {assigned.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-400">No active deliveries assigned.</p>
              </div>
            ) : assigned.map(o => (
              <div key={o.id} onClick={() => openDetails(o.id)} className="group bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:bg-indigo-600 transition-colors" />
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Order #{o.id}</span>
                    <h4 className="text-lg font-bold text-gray-800 mt-1">Assigned €” Ready for delivery</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {o.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div>{o.items?.length || 0} items €¢ ‚¹ {o.total}</div>
                  <div className="text-indigo-500">View details †’</div>
                </div>
              </div>
            ))}
          </div>

          {/* Available */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">New Opportunities</h2>
            </div>

            {available.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-400">No new orders available right now.</p>
              </div>
            ) : available.map(o => (
              <div key={o.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-emerald-200 transition-all">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">New Order</span>
                  <h4 className="text-lg font-bold text-gray-800 mt-1">Order #{o.id}</h4>
                  <p className="text-sm text-gray-500 mt-1">Waiting for pickup</p>
                </div>
                <button
                  className="ml-3 px-3 py-2 bg-emerald-600 text-white rounded text-sm"
                  onClick={() => takeOrder(o.id)}
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


