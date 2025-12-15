import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logout } from "../services/auth";
import { ShoppingCart, BookOpen, Menu, X, Truck, User, LogOut, LayoutDashboard, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const user = getCurrentUser();
  const nav = useNavigate();
  const location = useLocation();

  // Safe parse deliveryAgent from localStorage
  const [deliveryAgent, setDeliveryAgent] = useState(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("deliveryAgent");
      if (raw) setDeliveryAgent(JSON.parse(raw));
    } catch (e) {
      console.warn("Invalid deliveryAgent in localStorage", e);
      setDeliveryAgent(null);
    }
  }, []);

  const [vendorToken, setVendorToken] = useState(null);
  const [vendorName, setVendorName] = useState(null);

  useEffect(() => {
    const vToken = localStorage.getItem("vendorToken");
    const vName = localStorage.getItem("vendorName");
    if (vToken) {
      setVendorToken(vToken);
      setVendorName(vName);
    }
  }, []);

  const isUser = !!user;
  const isAdmin = user?.role === "ADMIN";
  const isDelivery = !!deliveryAgent;
  const isVendor = !!vendorToken;

  const vendorLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorName");
    setVendorToken(null);
    setVendorName(null);
    nav("/login");
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const deliveryLogout = () => {
    localStorage.removeItem("deliveryToken");
    localStorage.removeItem("deliveryAgent");
    setDeliveryAgent(null);
    nav("/login");
  };

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const profileInitial = (() => {
    if (isDelivery && deliveryAgent?.name) return deliveryAgent.name.charAt(0).toUpperCase();
    if (isUser && user?.username) return user.username.charAt(0).toUpperCase();
    return "U";
  })();

  const navLinks = [
    { name: "Home", path: "/", visible: true },
    { name: "Shop", path: "/", visible: true }, // Assuming Home lists books for now, or redirect
    { name: "Orders", path: "/orders", visible: isUser && !isAdmin && !isDelivery },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-[50] border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-sm transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20"> {/* Taller navbar for premium feel */}

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-amber-600 rounded-xl text-white shadow-lg shadow-amber-600/20 group-hover:scale-105 transition-transform duration-300">
                <BookOpen size={24} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight font-serif group-hover:text-amber-800 transition-colors">
                BookBarn
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {/* Links */}
              <div className="flex items-center gap-6">
                {/* Only show 'Shop' link if we strictly want it, but 'BookBarn' logo goes home. */}
                {isUser && !isAdmin && !isDelivery && !isVendor && (
                  <>
                    <Link to="/" className="text-gray-600 font-medium hover:text-amber-700 transition-colors">Shop</Link>
                    <Link to="/orders" className="text-gray-600 font-medium hover:text-amber-700 transition-colors">Orders</Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Link to="/admin/books" className="text-gray-600 font-medium hover:text-amber-700">Books</Link>
                    <Link to="/admin/orders" className="text-gray-600 font-medium hover:text-amber-700">Orders</Link>
                    <Link to="/admin/users" className="text-gray-600 font-medium hover:text-amber-700">Users</Link>
                    <Link to="/admin/vendors" className="text-gray-600 font-medium hover:text-amber-700">Vendors</Link>
                  </>
                )}
                {isDelivery && (
                  <Link to="/delivery/dashboard" className="text-gray-600 font-medium hover:text-amber-700 flex items-center gap-2">
                    <Truck size={18} /> Dashboard
                  </Link>
                )}
                {isVendor && (
                  <Link to="/vendor/dashboard" className="text-gray-600 font-medium hover:text-amber-700 flex items-center gap-2">
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                )}
              </div>

              <div className="h-6 w-px bg-gray-200"></div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {isUser && !isAdmin && !isDelivery && !isVendor && (
                  <Link to="/cart" className="relative group p-2 rounded-full hover:bg-amber-50 transition-colors">
                    <ShoppingCart size={22} className="text-gray-700 group-hover:text-amber-700 transition-colors" />
                    {/* Badge could go here */}
                  </Link>
                )}

                {/* Profile Auth */}
                {(isUser || isAdmin || isDelivery || isVendor) ? (
                  <div className="relative" ref={dropdownRef}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold shadow-md shadow-amber-600/20 hover:shadow-lg transition-all"
                    >
                      {profileInitial}
                    </motion.button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-4 w-56 glass-panel overflow-hidden py-2 z-50 origin-top-right"
                        >
                          <div className="px-4 py-2 border-b border-gray-100 mb-1">
                            <p className="text-sm text-gray-500">Signed in as</p>
                            <p className="font-semibold text-gray-900 truncate">
                              {isDelivery ? deliveryAgent?.email : isVendor ? vendorName : user?.username || "User"}
                            </p>
                            {isVendor && <span className="text-xs text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 mt-1 inline-block">Vendor</span>}
                          </div>

                          {isDelivery ? (
                            <>
                              <Link to="/delivery/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors">
                                <LayoutDashboard size={16} /> Dashboard
                              </Link>
                              <Link to="/delivery/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors">
                                <User size={16} /> Profile
                              </Link>
                              <button onClick={deliveryLogout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut size={16} /> Logout
                              </button>
                            </>
                          ) : isVendor ? (
                            <>
                              <Link to="/vendor/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors">
                                <LayoutDashboard size={16} /> Dashboard
                              </Link>
                              <Link to="/vendor/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors">
                                <User size={16} /> Profile
                              </Link>
                              <button onClick={vendorLogout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut size={16} /> Logout
                              </button>
                            </>
                          ) : (
                            <>
                              {isAdmin ? (
                                <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors">
                                  <LayoutDashboard size={16} /> Admin Dashboard
                                </Link>
                              ) : (
                                <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors">
                                  <Package size={16} /> My Orders
                                </Link>
                              )}
                              <Link to={isAdmin ? "/admin" : "/profile"} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors">
                                <User size={16} /> Profile
                              </Link>
                              <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut size={16} /> Logout
                              </button>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link to="/login" className="px-5 py-2.5 text-gray-700 font-medium hover:text-amber-700 transition-colors">
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white/90 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {isUser && !isAdmin && !isDelivery && !isVendor && (
                  <>
                    <Link to="/" className="block text-lg font-medium text-gray-800">Shop</Link>
                    <Link to="/orders" className="block text-lg font-medium text-gray-800">My Orders</Link>
                    <Link to="/cart" className="block text-lg font-medium text-gray-800">Cart</Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Link to="/admin/books" className="block text-lg font-medium text-gray-800">Manage Books</Link>
                    <Link to="/admin/users" className="block text-lg font-medium text-gray-800">Users</Link>
                    <Link to="/admin/orders" className="block text-lg font-medium text-gray-800">Orders</Link>
                    <Link to="/admin/vendors" className="block text-lg font-medium text-gray-800">Vendors</Link>
                  </>
                )}
                {isDelivery && (
                  <Link to="/delivery/dashboard" className="block text-lg font-medium text-gray-800">Dashboard</Link>
                )}
                {isVendor && (
                  <Link to="/vendor/dashboard" className="block text-lg font-medium text-gray-800">Dashboard</Link>
                )}

                <div className="pt-4 border-t border-gray-200">
                  {(!user && !deliveryAgent && !isVendor) ? (
                    <div className="flex flex-col gap-3">
                      <Link to="/login" className="w-full btn-secondary text-center justify-center">Login</Link>
                      <Link to="/register" className="w-full btn-primary text-center justify-center">Sign Up</Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => isDelivery ? deliveryLogout() : isVendor ? vendorLogout() : handleLogout()}
                      className="w-full py-3 text-left text-red-600 font-medium"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Spacer */}
      <div className="h-20" aria-hidden="true" />
    </>
  );
}
