import { Link } from "react-router-dom";

export default function DeliveryNavbar() {
  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between">
      <Link to="/delivery/dashboard" className="font-bold">Delivery Portal</Link>
      <button
        onClick={() => { localStorage.clear(); window.location.href="/delivery/login"; }}
      >
        Logout
      </button>
    </div>
  );
}
