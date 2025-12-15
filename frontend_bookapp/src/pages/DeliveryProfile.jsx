import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function DeliveryProfile() {
  const agent = JSON.parse(localStorage.getItem("deliveryAgent"));
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const res = await api.get(`/delivery/me/${agent.id}`);
    setProfile(res.data);
  }

  if (!profile) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>

      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <p><strong>Area:</strong> {profile.area}</p>
      <p><strong>Status:</strong> {profile.status}</p>

      <button
        onClick={() => (window.location.href = "/delivery/update-profile")}
        className="mt-4 bg-amber-600 text-white px-4 py-2 rounded"
      >
        Update Profile
      </button>
    </div>
  );
}
