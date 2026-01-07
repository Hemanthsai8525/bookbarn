import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        // Simulate API call
        setTimeout(() => {
            setSending(false);
            setSuccess(true);
            setForm({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setSuccess(false), 5000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans pt-10 pb-20">

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto px-4 mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black text-gray-900 font-serif mb-4"
                >
                    Contact Support
                </motion.h1>
                <p className="text-xl text-gray-500">We're here to help! Send us a message or reach out directly.</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                            <Mail size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Email Support</h3>
                        <p className="text-gray-500 text-sm mb-4">For general inquiries and order updates.</p>
                        <a href="mailto:support@bookbarn.com" className="text-amber-700 font-bold hover:underline">support@bookbarn.com</a>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                            <Phone size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Phone Support</h3>
                        <p className="text-gray-500 text-sm mb-4">Mon-Fri from 8am to 5pm.</p>
                        <a href="tel:+15550000000" className="text-emerald-700 font-bold hover:underline">+1 (555) 000-0000</a>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                            <MapPin size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Office</h3>
                        <p className="text-gray-500 text-sm mb-4">Come say hello.</p>
                        <p className="text-gray-900 font-medium">123 Book St, Library City, BK 90210</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <MessageSquare className="text-amber-600" size={28} />
                            <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                                    <input
                                        required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Subject</label>
                                <input
                                    required
                                    value={form.subject}
                                    onChange={e => setForm({ ...form, subject: e.target.value })}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Message</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                                    placeholder="Tell us more..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                            >
                                {sending ? (
                                    <>Sending...</>
                                ) : (
                                    <>Send Message <Send size={18} /></>
                                )}
                            </button>

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-100 text-green-700 p-4 rounded-xl text-center font-bold"
                                >
                                    Message sent successfully! We'll get back to you soon.
                                </motion.div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
