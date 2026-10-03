import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
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

      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("role", response.data.user.role);

      navigate("/");
    } catch (error) {
      setMsg(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#a65f46] lg:block">
        <div className="absolute -left-28 -top-20 h-96 w-96 rounded-full bg-[#d6bd83]" />
        <div className="absolute bottom-[-120px] right-[-50px] h-[430px] w-[430px] rounded-[7rem] bg-[#243029]" />
        <div className="relative flex h-full flex-col justify-between p-14 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.22em]">Welcome back</p>
          <h1 className="max-w-lg text-6xl font-bold leading-[0.98] tracking-[-0.06em]">
            Your good finds are waiting.
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a65f46]">Account</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em]">Log in</h2>
          <p className="mt-3 text-sm text-[#243029]/50">Enter your details to continue shopping.</p>

          {msg && (
            <div className="mt-6 rounded-2xl bg-[#f3e7e2] px-4 py-3 text-sm font-medium text-[#8e4b39]">{msg}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Email address</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#243029]/15 bg-[#fbfaf7] px-4 py-3.5 outline-none transition focus:border-[#243029]"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">Password</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#243029]/15 bg-[#fbfaf7] px-4 py-3.5 outline-none transition focus:border-[#243029]"
                required
              />
            </label>

            <button type="submit" disabled={loading} className="w-full rounded-full bg-[#243029] py-4 text-sm font-bold text-white transition hover:bg-[#a65f46] disabled:opacity-50">
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#243029]/50">
            New here? <Link to="/signup" className="font-bold text-[#243029] underline underline-offset-4">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
