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

  const navClass = ({ isActive }) => `text-sm font-bold transition ${isActive ? "text-[#5368ef]" : "text-[#66708f] hover:text-[#19203a]"}`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl">
      <div className="bg-gradient-to-r from-[#ff5b57] via-[#ef566f] to-[#a74de8] px-4 py-2.5 text-center text-[10px] font-extrabold uppercase tracking-[0.12em] text-white sm:text-xs">
        Fresh finds, fair prices <span className="mx-2 text-white/45">•</span> Cash on delivery available
      </div>
      <nav className="border-b border-[#e4e7f0]" aria-label="Primary navigation">
        <div className="mx-auto flex min-h-[70px] max-w-7xl items-center justify-between gap-5 px-5">
          <Link to="/" className="flex items-center gap-2.5" aria-label="VividVistaa home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ff5b57] to-[#7958e6] text-sm font-black text-white shadow-md">V</span>
            <span className="text-xl font-extrabold tracking-[-0.04em]">VividVistaa</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <NavLink to="/" className={navClass}>Shop</NavLink>
            <a href="/#categories" className="text-sm font-bold text-[#66708f] transition hover:text-[#19203a]">Categories</a>
            <a href="/#products" className="text-sm font-bold text-[#66708f] transition hover:text-[#19203a]">New arrivals</a>
            {role === "admin" && <NavLink to="/admin/products" className={navClass}>Admin</NavLink>}
          </div>

          <div className="flex items-center gap-2">
            {!userId ? <Link to="/login" className="hidden px-3 py-2 text-sm font-bold text-[#66708f] transition hover:text-[#19203a] sm:block">Log in</Link> : <button onClick={logout} className="hidden px-3 py-2 text-sm font-bold text-[#66708f] transition hover:text-[#e94743] sm:block">Log out</button>}
            {!userId && <Link to="/signup" className="store-button hidden bg-[#eef0ff] px-4 py-2.5 text-sm font-bold text-[#5368ef] transition hover:bg-[#e3e6ff] lg:block">Create account</Link>}
            <Link to="/cart" aria-label={`Shopping cart with ${cartCount} items`} className="relative flex h-11 items-center gap-2 rounded-xl bg-[#19203a] px-3.5 text-white transition hover:bg-[#5368ef]">
              <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.9"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 7H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
              <span className="text-xs font-extrabold">{cartCount}</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
