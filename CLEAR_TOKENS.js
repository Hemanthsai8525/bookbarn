// EMERGENCY FIX FOR DELIVERY AGENT 403 ERROR
// Run this in your browser console to clear all auth data

// Clear all authentication tokens
localStorage.removeItem("deliveryToken");
localStorage.removeItem("deliveryAgent");
localStorage.removeItem("accessToken");
localStorage.removeItem("refreshToken");
localStorage.removeItem("user");
localStorage.removeItem("vendorToken");
localStorage.removeItem("vendorName");

// Or clear everything at once
// localStorage.clear();

console.log("✅ All auth tokens cleared!");
console.log("Now refresh the page and login again as delivery agent");
