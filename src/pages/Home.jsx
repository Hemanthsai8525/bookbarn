import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Star, Truck, Shield, Users } from "lucide-react";

export default function Home() {
    return (
        <div className="font-sans text-gray-900 bg-[#FDFBF7]">
            {/* Hero Section */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1507842217121-9e93c8aaf27c?q=80&w=3270&auto=format&fit=crop"
                        alt="Library"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-sm font-bold tracking-widest uppercase mb-6 shadow-lg">
                            Est. 2024
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white font-serif leading-tight drop-shadow-2xl mb-6">
                            Stories That <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-100">Ignite Your Mind</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                            Discover a universe of knowledge, adventure, and inspiration. Your next favorite book is waiting.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            to="/books"
                            className="px-8 py-4 bg-amber-600 text-white text-lg font-bold rounded-full shadow-xl hover:bg-amber-700 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                        >
                            Browse Books <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/about"
                            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white text-lg font-bold rounded-full shadow-xl hover:bg-white/20 transition-all"
                        >
                            Our Story
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 bg-white relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold font-serif text-gray-900 mb-4">Why BookBarn?</h2>
                        <p className="text-lg text-gray-500">We are more than just a bookstore. We are a community of book lovers.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: BookOpen,
                                title: "Curated Collection",
                                desc: "Handpicked titles from bestsellers to rare indie gems."
                            },
                            {
                                icon: Truck,
                                title: "Fast Delivery",
                                desc: "Get your books delivered to your doorstep in record time."
                            },
                            {
                                icon: Shield,
                                title: "Secure Payment",
                                desc: "100% secure payment gateways for a worry-free experience."
                            }
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="text-center p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                            >
                                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                                    <f.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Categories Preview */}
            <section className="py-24 px-4 bg-[#FDFBF7]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-bold font-serif text-gray-900 mb-2">Popular Categories</h2>
                            <p className="text-gray-500">Explore different worlds.</p>
                        </div>
                        <Link to="/books" className="hidden md:flex items-center gap-2 text-amber-700 font-bold hover:underline">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {["Fiction", "Business", "Self Help", "Kids"].map((cat, i) => (
                            <Link to="/books" key={cat} className="group relative overflow-hidden rounded-3xl aspect-[3/4] shadow-md hover:shadow-2xl transition-all">
                                <img
                                    src={`https://source.unsplash.com/random/400x600?${cat.toLowerCase().replace(' ', '')},book`}
                                    alt={cat}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-2 transition-transform">{cat}</h3>
                                    <p className="text-white/80 text-sm group-hover:translate-x-2 transition-transform delay-75">Explore Category &rarr;</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/books" className="inline-flex items-center gap-2 text-amber-700 font-bold hover:underline">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-4 bg-gray-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold font-serif mb-4">What Our Readers Say</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah J.", role: "Book Blogger", text: "BookBarn has completely changed how I find books. The aggregation is seamless and the prices are unbeatable." },
                            { name: "Michael R.", role: "Avid Reader", text: "Fast shipping and excellent packaging. My books always arrive in pristine condition. Highly recommended!" },
                            { name: "Emily W.", role: "Student", text: "I love the variety of academic and fiction books available. The student discounts are a lifesaver." }
                        ].map((t, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl">
                                <div className="flex gap-1 text-amber-500 mb-4">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-gray-300 text-lg italic mb-6">"{t.text}"</p>
                                <div>
                                    <div className="font-bold text-white">{t.name}</div>
                                    <div className="text-sm text-gray-500">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-4 bg-[#FDFBF7]">
                <div className="max-w-5xl mx-auto bg-amber-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black font-serif mb-6">Ready to Start Reading?</h2>
                        <p className="text-xl md:text-2xl text-amber-100 mb-10 max-w-2xl mx-auto">Join thousands of happy readers and find your next favorite book today.</p>
                        <Link to="/books" className="inline-block bg-white text-amber-700 px-10 py-5 rounded-full text-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all">
                            Browse Collection
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
