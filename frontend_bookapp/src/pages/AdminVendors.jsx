import React, { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { Check, X, Search, Shield, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminVendors() {
    const [vendors, setVendors] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL"); // ALL, PENDING, APPROVED, REJECTED
    const [searchTerm, setSearchTerm] = useState("");

    // Token is handled by api interceptor

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/vendors");
            setVendors(res.data);
        } catch (err) {
            console.error("Error fetching vendors", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        // Optimistic update
        const originalVendors = [...vendors];
        setVendors(vendors.map(v => v.id === id ? { ...v, status: action === 'approve' ? 'APPROVED' : 'REJECTED' } : v));

        try {
            await api.post(`/admin/vendors/${id}/${action}`);
            setMessage(`Vendor ${action}d successfully`);
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setVendors(originalVendors); // Revert
            setMessage(`Error ${action}ing vendor`);
        }
    };

    const filteredVendors = vendors.filter(v => {
        const matchesStatus = filter === "ALL" || v.status === filter;
        const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="min-h-screen bg-[#F8F9FA] pb-12 font-sans text-gray-900">

                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 pt-8 pb-6 px-4 sm:px-8">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                                <Shield className="text-amber-600" size={32} />
                                Vendor Management
                            </h1>
                            <p className="text-gray-500 mt-1">Review and manage vendor partnerships</p>
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            {["ALL", "PENDING", "APPROVED", "REJECTED"].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === status
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {status.charAt(0) + status.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">

                    {/* Search & Stats */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search vendors..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="text-sm font-bold text-gray-500">
                            Showing {filteredVendors.length} vendors
                        </div>
                    </div>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 border border-emerald-100"
                            >
                                <Check size={18} /> {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Vendors Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vendor</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredVendors.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                            No vendors found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVendors.map((v) => (
                                        <tr key={v.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{v.name}</div>
                                                <div className="text-xs text-gray-400">ID: #{v.id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">{v.email}</div>
                                                <div className="text-sm text-gray-500">{v.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${v.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                    v.status === "REJECTED" ? "bg-red-50 text-red-700 border-red-100" :
                                                        "bg-amber-50 text-amber-700 border-amber-100"
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${v.status === "APPROVED" ? "bg-emerald-500" :
                                                        v.status === "REJECTED" ? "bg-red-500" :
                                                            "bg-amber-500"
                                                        }`}></span>
                                                    {v.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {v.status === "PENDING" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction(v.id, 'approve')}
                                                                className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-105 transition-all"
                                                                title="Approve"
                                                            >
                                                                <Check size={18} strokeWidth={2.5} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(v.id, 'reject')}
                                                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition-all"
                                                                title="Reject"
                                                            >
                                                                <X size={18} strokeWidth={2.5} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {v.status === "REJECTED" && (
                                                        <button
                                                            onClick={() => handleAction(v.id, 'approve')}
                                                            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all flex items-center gap-1 text-sm font-bold"
                                                        >
                                                            <RefreshCw size={14} /> Re-evaluate
                                                        </button>
                                                    )}
                                                    {v.status === "APPROVED" && (
                                                        <button
                                                            onClick={() => handleAction(v.id, 'reject')}
                                                            className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                                            title="Revoke Access"
                                                        >
                                                            <Shield size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm("Are you sure you want to delete this vendor?")) {
                                                                try {
                                                                    await api.delete(`/admin/vendors/${v.id}`);
                                                                    setVendors(vendors.filter(vendor => vendor.id !== v.id));
                                                                    setMessage("Vendor deleted successfully");
                                                                    setTimeout(() => setMessage(""), 3000);
                                                                } catch (err) {
                                                                    console.error("Error deleting vendor", err);
                                                                    setMessage("Error deleting vendor");
                                                                }
                                                            }
                                                        }}
                                                        className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all ml-2"
                                                        title="Delete Vendor"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </Layout>
    );
}

