import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/address/add", {
        ...form,
        userId,
      });

      navigate("/checkout");
    } catch (error) {
      console.error("Failed to save address:", error);
      setError(error.response?.data?.message || "Could not save the address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 py-10 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <Link to="/checkout" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-black/50 transition hover:text-black">
          <span>←</span> Back to checkout
        </Link>

        <div className="rounded-[2rem] bg-white p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4572e]">Delivery details</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Add a new address</h1>
          <p className="mt-3 text-sm text-black/50">Enter the address where you would like to receive your order.</p>

          {error && (
            <p className="mt-6 rounded-2xl bg-[#fff1eb] px-4 py-3 text-sm font-medium text-[#a73516]">{error}</p>
          )}

          <form onSubmit={saveAddress} className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Full name</span>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Name of the receiver" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" required />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Phone number</span>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" required />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Street address</span>
              <input name="addressLine" value={form.addressLine} onChange={handleChange} placeholder="House number and street" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" required />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">City</span>
              <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" required />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">State</span>
              <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" required />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-bold">Postal code</span>
              <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Postal code" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" required />
            </label>

            <button type="submit" disabled={loading} className="mt-2 w-full rounded-full bg-[#1c1c1a] py-4 text-sm font-bold text-white transition hover:bg-[#e4572e] disabled:opacity-50 sm:col-span-2">
              {loading ? "Saving address..." : "Save and continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
