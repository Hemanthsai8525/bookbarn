import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Coffee, Github, Heart, Linkedin, Twitter, MapPin, Mail, Phone } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans">
            {/* Hero */}
            <div className="relative py-24 bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2728&auto=format&fit=crop" alt="About" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold font-serif mb-6"
                    >
                        About BookBarn
                    </motion.h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Bridging the gap between passionate readers and their next great adventure.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-20 space-y-20">

                {/* Mission */}
                <section className="text-center">
                    <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">Our Mission</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6 font-serif">Empowering Readers Everywhere</h2>
                    <p className="text-lg text-gray-600 leading-relaxed text-left md:text-center">
                        At BookBarn, we believe that books have the power to change lives. Our mission is to create a seamless,
                        accessible, and inspiring platform where book lovers can discover, discuss, and purchase their favorite titles.
                        We are dedicated to supporting authors, publishers, and readers alike by fostering a vibrant literary community.
                    </p>
                </section>

                {/* Story */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                        <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2670&auto=format&fit=crop" alt="Reading" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Our Story</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Founded in 2024, BookBarn started as a small project by a group of bibliophiles who wanted to solve a simple problem:
                            finding the right book shouldn't be hard.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            What began as a simple catalog has grown into a comprehensive marketplace connecting vendors and readers.
                            We are constantly innovating to bring features like real-time delivery tracking, vendor management, and personalized recommendations.
                        </p>
                    </div>
                </section>

                {/* Team Placeholder */}
                <section className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 font-serif">Meet the Team</h2>
                        <p className="text-gray-500 mt-2">The people behind the pages.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="text-center group">
                                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-gray-50 group-hover:border-amber-100 transition-colors">
                                    <img src={`https://i.pravatar.cc/300?img=${10 + i}`} alt="Team Member" className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Alex Johnson</h3>
                                <p className="text-sm text-gray-500 mb-3">Co-Founder</p>
                                <div className="flex justify-center gap-3 text-gray-400">
                                    <Linkedin size={18} className="hover:text-blue-600 cursor-pointer transition-colors" />
                                    <Twitter size={18} className="hover:text-sky-500 cursor-pointer transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Info */}
                <section className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <h2 className="text-3xl font-bold font-serif mb-2">Get in Touch</h2>
                            <p className="text-gray-400">Have questions? We'd love to hear from you.</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <Mail className="text-amber-500" />
                                <span>support@bookbarn.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="text-amber-500" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-amber-500" />
                                <span>123 Book St, Library City</span>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
