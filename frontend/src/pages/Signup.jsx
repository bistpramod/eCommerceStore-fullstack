import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMsg("");
      setSuccess(false);

      const response = await api.post("/auth/signup", form);
      setMsg(response.data.message);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMsg(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4572e]">Join us</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em]">Create an account</h2>
          <p className="mt-3 text-sm text-black/50">A few details and you are ready to shop.</p>

          {msg && (
            <div className={`mt-6 rounded-2xl px-4 py-3 text-sm font-medium ${success ? "bg-[#eaf2e2] text-[#315c35]" : "bg-[#fff1eb] text-[#a73516]"}`}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Full name</span>
              <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3.5 outline-none transition focus:border-black" required />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">Email address</span>
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3.5 outline-none transition focus:border-black" required />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">Password</span>
              <input type="password" name="password" placeholder="Create a password" value={form.password} onChange={handleChange} minLength="6" className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3.5 outline-none transition focus:border-black" required />
            </label>

            <button type="submit" disabled={loading} className="w-full rounded-full bg-[#1c1c1a] py-4 text-sm font-bold text-white transition hover:bg-[#e4572e] disabled:opacity-50">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-black/50">
            Already have an account? <Link to="/login" className="font-bold text-black underline underline-offset-4">Log in</Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-[#dfe8d2] lg:block">
        <div className="absolute right-16 top-16 h-72 w-72 rounded-full bg-[#f4b942]" />
        <div className="absolute bottom-[-100px] left-[-60px] h-[420px] w-[420px] rotate-12 rounded-[6rem] bg-[#4f7b53]" />
        <div className="relative flex h-full flex-col justify-between p-14">
          <p className="text-sm font-bold uppercase tracking-[0.22em]">Made simple</p>
          <h1 className="max-w-lg text-6xl font-bold leading-[0.98] tracking-[-0.06em]">
            Find it. Love it. Make it yours.
          </h1>
        </div>
      </div>
    </div>
  );
}
