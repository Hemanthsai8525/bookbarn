import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BookOpen, LogOut, Package, Plus, Search, DollarSign, Image as ImageIcon, X, TrendingUp, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VendorDashboard() {
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBookId, setCurrentBookId] = useState(null);
    const [formData, setFormData] = useState({
        title: "", author: "", price: "", description: "", category: "", stock: 0, image: ""
    });
    const [message, setMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const token = localStorage.getItem("vendorToken");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchMyBooks();
    }, [token]);

    const fetchMyBooks = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://bookapp-production-3e11.up.railway.app/vendor/my-books", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(res.data);
        } catch (err) {
            console.error("Failed to fetch books", err);
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const openAddModal = () => {
        setIsEditing(false);
        setFormData({ title: "", author: "", price: "", description: "", category: "", stock: 0, image: "" });
        setShowModal(true);
    };

    const openEditModal = (book) => {
        setIsEditing(true);
        setCurrentBookId(book.id);
        setFormData({
            title: book.title,
            author: book.author,
            price: book.price,
            description: book.description,
            category: book.category,
            stock: book.stock,
            image: book.image || ""
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`https://bookapp-production-3e11.up.railway.app/vendor/books/${currentBookId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage("Book updated successfully!");
            } else {
                await axios.post("https://bookapp-production-3e11.up.railway.app/vendor/books", formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage("Book added successfully!");
            }

            setShowModal(false);
            fetchMyBooks();
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage("Failed to save book: " + (err.response?.data || err.message));
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            await axios.delete(`https://bookapp-production-3e11.up.railway.app/vendor/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Book deleted successfully!");
            fetchMyBooks();
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage("Failed to delete book: " + (err.response?.data || err.message));
        }
    };

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalStock = books.reduce((sum, b) => sum + (b.stock || 0), 0);
    const portfolioValue = books.reduce((sum, b) => sum + (b.price * b.stock || 0), 0);

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <BookOpen size={24} />
                            </div>
                            <span className="text-xs font-bold bg-gray-50 text-gray-500 px-2 py-1 rounded-full uppercase">Total</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-bold mt-4">Active Books</h3>
                        <p className="text-3xl font-bold text-gray-900">{books.length}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <Package size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-bold mt-4">Total Inventory</h3>
                        <p className="text-3xl font-bold text-gray-900">{totalStock}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                        <h3 className="text-gray-500 text-sm font-bold mt-4">Portfolio Value</h3>
                        <p className="text-3xl font-bold text-gray-900">₹{portfolioValue.toLocaleString()}</p>
                    </motion.div>
                </div>

                {/* Actions & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search your inventory..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={openAddModal}
                        className="btn-primary flex items-center gap-2 px-6 py-3 shadow-lg shadow-amber-500/20"
                    >
                        <Plus size={20} /> Add New Book
                    </button>
                </div>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 border border-emerald-100 font-bold"
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Books Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredBooks.map((b, i) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                                key={b.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group relative"
                            >
                                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(b)}
                                        className="p-2 bg-white/90 backdrop-blur rounded-lg text-gray-600 hover:text-amber-600 shadow-sm"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(b.id)}
                                        className="p-2 bg-white/90 backdrop-blur rounded-lg text-gray-600 hover:text-red-600 shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="h-48 bg-gray-100 relative overflow-hidden">
                                    {b.image ? (
                                        <img src={b.image.startsWith('http') ? b.image : `https://bookapp-production-3e11.up.railway.app${b.image}`} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                                            {b.category || "Uncategorized"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{b.title}</h4>
                                    <p className="text-sm text-gray-500 mb-4">{b.author}</p>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                        <span className="font-bold text-lg text-gray-900">‚¹{b.price}</span>
                                        <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-lg ${b.stock < 5 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
                                            <Package size={14} /> {b.stock} Left
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Add/Edit Book Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                                className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">{isEditing ? "Edit Book" : "Add New Book"}</h3>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                                </div>

                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2 md:col-span-1 space-y-4">
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 mb-1 block">Title</label>
                                            <input name="title" value={formData.title} className="input-field" onChange={handleInputChange} required placeholder="Book Title" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 mb-1 block">Author</label>
                                            <input name="author" value={formData.author} className="input-field" onChange={handleInputChange} required placeholder="Author Name" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 mb-1 block">Category</label>
                                            <select name="category" value={formData.category} className="input-field appearance-none" onChange={handleInputChange} required>
                                                <option value="">Select Category</option>
                                                <option value="Fiction">Fiction</option>
                                                <option value="Non-fiction">Non-fiction</option>
                                                <option value="Education">Education</option>
                                                <option value="Business">Business</option>
                                                <option value="Technology">Technology</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-span-2 md:col-span-1 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 mb-1 block">Price (‚¹)</label>
                                                <input name="price" type="number" value={formData.price} className="input-field" onChange={handleInputChange} required placeholder="0.00" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 mb-1 block">Stock</label>
                                                <input name="stock" type="number" value={formData.stock} className="input-field" onChange={handleInputChange} required placeholder="0" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 mb-1 block">Image URL (Optional)</label>
                                            <input name="image" value={formData.image} className="input-field" onChange={handleInputChange} placeholder="http://..." />
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="text-sm font-bold text-gray-700 mb-1 block">Description</label>
                                        <textarea name="description" value={formData.description} rows="3" className="input-field resize-none" onChange={handleInputChange} required placeholder="Brief summary of the book..." />
                                    </div>

                                    <div className="col-span-2 flex gap-3 pt-4 border-t border-gray-100">
                                        <button className="flex-1 btn-primary py-3">{isEditing ? "Update Book" : "Publish Book"}</button>
                                        <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}



