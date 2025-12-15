import React, { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Package } from "lucide-react";

export default function OrderSummary() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const { state } = useLocation();

  const isBuyNow = state?.items && state.items.length > 0;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState({});

  useEffect(() => {
    if (isBuyNow) {
      loadBuyNow();
    } else {
      loadCartSummary();
    }
  }, []);

  function loadBuyNow() {
    setItems(state.items);
    setLoading(false);
  }

  async function loadCartSummary() {
    try {
      const cartRes = await api.get(`/cart/${user.id}`);
      setItems(cartRes.data);
      if (cartRes.data.length > 0) {
        try {
          const bRes = await api.get("/books");
          const bookMap = {};
          bRes.data.forEach(b => bookMap[b.id] = b);
          setBooks(bookMap);
        } catch (e) { }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function getItemDetails(item) {
    if (isBuyNow) return item;
    const book = books[item.bookId] || {};
    return { ...item, title: book.title || "Loading...", price: book.price || 0, image: book.image };
  }

  const total = isBuyNow
    ? state.total
    : items.reduce((sum, item) => sum + (getItemDetails(item).price * item.quantity), 0);

  if (loading) return <Layout><div className="flex justify-center py-20">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 animate-fade-in">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
            <CheckCircle className="text-amber-600" /> Order Summary
          </h1>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Items Review</h2>

              <div className="space-y-6">
                {items.map((item, idx) => {
                  const details = getItemDetails(item);
                  return (
                    <div key={idx} className="flex gap-4 items-center">
                      <img
                        src={details.image?.startsWith('http') ? details.image : `http://localhost:8080${details.image}`}
                        className="w-16 h-20 object-cover rounded-md shadow-sm bg-gray-100"
                        alt=""
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{details.title}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-lg text-amber-700">
                        ₹{details.price * item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-50 p-8 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="text-3xl font-black text-gray-900">₹{total}</span>
              </div>

              <button
                onClick={() => navigate("/checkout", { state: { items, total, buyNow: isBuyNow } })}
                className="w-full btn-primary py-4 text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all"
              >
                Proceed to Payment
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full mt-4 text-gray-500 hover:text-gray-900 font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
