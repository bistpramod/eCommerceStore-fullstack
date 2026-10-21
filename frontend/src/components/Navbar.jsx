import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/Axios.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (!userId) { setCartCount(0); return; }
        const response = await api.get(`/cart/${userId}`);
        setCartCount(response.data.items.reduce((sum, item) => sum + item.quantity, 0));
      } catch (error) {
        console.log(error);
        setCartCount(0);
      }
    };
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, [userId]);

  const logout = () => {
    localStorage.clear();
    setCartCount(0);
    navigate("/login");
  };

  const navClass = ({ isActive }) => `border-b py-1 text-sm transition ${isActive ? "border-[#171813] text-[#171813]" : "border-transparent text-[#6f7068] hover:text-[#171813]"}`;

  return (
    <header className="sticky top-0 z-50 bg-[#f7f6f2]/95 backdrop-blur-xl">
      <div className="border-b border-[#2b2c27] bg-[#171813] px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-[#f5f4ef] sm:text-[11px]">
        Free delivery on qualifying orders <span className="mx-2 text-white/30">•</span> Cash on delivery available
      </div>
      <nav className="border-b border-[#deddd6]" aria-label="Primary navigation">
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-5 px-5">
          <Link to="/" className="flex items-center gap-3" aria-label="VividVistaa home">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#171813] text-[10px] font-bold tracking-[-0.04em] text-white">VV</span>
            <span className="text-xl font-semibold tracking-[-0.045em]">VividVistaa</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <NavLink to="/" className={navClass}>Shop</NavLink>
            <a href="/#categories" className="border-b border-transparent py-1 text-sm text-[#6f7068] transition hover:text-[#171813]">Categories</a>
            <a href="/#products" className="border-b border-transparent py-1 text-sm text-[#6f7068] transition hover:text-[#171813]">New arrivals</a>
            {role === "admin" && <NavLink to="/admin/products" className={navClass}>Admin</NavLink>}
          </div>

          <div className="flex items-center gap-2">
            {!userId ? <Link to="/login" className="hidden px-3 py-2 text-sm text-[#62635c] transition hover:text-[#171813] sm:block">Log in</Link> : <button type="button" onClick={logout} className="hidden px-3 py-2 text-sm text-[#62635c] transition hover:text-[#171813] sm:block">Log out</button>}
            {!userId && <Link to="/signup" className="hidden border border-[#cfcec6] px-4 py-2.5 text-sm font-medium transition hover:border-[#171813] lg:block">Create account</Link>}
            <Link to="/cart" aria-label={`Shopping cart with ${cartCount} items`} className="relative flex h-10 items-center gap-2 rounded-full bg-[#171813] px-4 text-white transition hover:bg-[#6f7655]">
              <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.9"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 7H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
              <span className="text-xs font-extrabold">{cartCount}</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
