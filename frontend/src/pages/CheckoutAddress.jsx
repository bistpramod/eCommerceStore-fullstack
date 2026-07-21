import { useState } from "react";
import api from "../api/Axios";
import { useNavigate } from "react-router-dom";

export default function CheckoutAddress() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "", 
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // FIX: this is now a real, callable function (was trapped inside handleChange before,
  // which is what would have crashed the app)
  const saveAddress = async () => {
    try {
      await api.post("/address/add", {
        ...form,
        userId,
      });

      navigate("/checkout");
    } catch (err) {
      console.error("Failed to save address:", err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Delivery Address
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Tell us where to send your order
        </p>

        <div className="space-y-4">
          {Object.keys(form).map((key) => (
            <input
              key={key}
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={key}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          ))}
        </div>

        <button
          onClick={saveAddress}
          className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Save Address
        </button>

      </div>
    </div>
  );
}