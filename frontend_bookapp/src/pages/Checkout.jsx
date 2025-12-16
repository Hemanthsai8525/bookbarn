import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { MapPin, Phone, CreditCard, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [address, setAddress] = useState(storedUser?.address || "");
  const [phone, setPhone] = useState(storedUser?.phone || "");

  async function confirmOrder() {
    if (!address.trim() || !phone.trim()) {
      alert("Address and phone number are required");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const tempOrder = {
      userId: user.id,
      address,
      phone
    };

    localStorage.setItem("order_temp", JSON.stringify(tempOrder));
    navigate("/payment", { state }); // Forward state to payment
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Steps Indicator */}
          <div className="flex items-center justify-center mb-10 gap-4">
            <div className="flex items-center gap-2 text-gray-400 font-medium">
              <span className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">1</span>
              Summary
            </div>
            <div className="w-12 h-0.5 bg-amber-600"></div>
            <div className="flex items-center gap-2 text-amber-700 font-bold">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/30">2</span>
              Shipping
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2 text-gray-400 font-medium">
              <span className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">3</span>
              Payment
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="md:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-amber-600" /> Shipping Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                  <textarea
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full address (House No, Street, City, Pincode)"
                    className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-4 text-gray-400 group-focus-within:text-amber-600 transition-colors" size={20} />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number for delivery updates"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Summary Side Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3 pb-4 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Total</span>
                    <span>‚¹{state?.total}</span>
                  </div>
                  <div className="flex justify-between text-green-600 text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 mt-4">
                  <span>Total</span>
                  <span>‚¹{state?.total}</span>
                </div>
              </div>

              <button
                onClick={confirmOrder}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-amber-700 hover:shadow-xl hover:scale-[1.02] transform transition-all flex items-center justify-center gap-2"
              >
                Next Step <ArrowRight size={20} />
              </button>

              <div className="flex items-center gap-2 justify-center text-xs text-gray-400">
                <ShieldCheck size={14} /> Secure Checkout
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}


