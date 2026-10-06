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

  const navClass = ({ isActive }) => `relative py-2 text-sm font-semibold transition ${isActive ? "text-[#100e17] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#c33418]" : "text-[#6a6577] hover:text-[#100e17]"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6e5ea] bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[70px] max-w-[1160px] items-center justify-between gap-5 px-5" aria-label="Primary navigation">
        <Link to="/" className="text-[22px] font-bold tracking-[-0.045em]" aria-label="VividVistaa home">VividVistaa<span className="text-[#c33418]">.</span></Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={navClass}>Shop</NavLink>
          {role === "admin" && <NavLink to="/admin/products" className={navClass}>Products</NavLink>}
          <Link to="/cart" className="relative py-2 text-sm font-semibold text-[#6a6577] transition hover:text-[#100e17]">Cart <span className="font-mono text-[10px] text-[#c33418]">({String(cartCount).padStart(2, "0")})</span></Link>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/cart" aria-label={`Shopping cart with ${cartCount} items`} className="relative grid h-9 w-9 place-items-center border border-[#e6e5ea] bg-white transition hover:border-[#c33418] hover:text-[#c33418] md:hidden">
            <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" stroke="currentColor" strokeWidth="1.8"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 7H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
            {cartCount > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center bg-[#c33418] px-1 font-mono text-[9px] text-white">{cartCount}</span>}
          </Link>
          {!userId ? (
            <><Link to="/login" className="hidden px-3 py-2 text-sm font-semibold text-[#6a6577] transition hover:text-[#100e17] sm:block">Log in</Link><Link to="/signup" className="editorial-button border border-[#100e17] bg-[#100e17] px-4 py-2.5 text-sm font-bold text-white transition hover:border-[#c33418] hover:bg-[#c33418]">Create account</Link></>
          ) : (
            <button onClick={logout} className="editorial-button border border-[#e6e5ea] bg-white px-4 py-2.5 text-sm font-bold transition hover:border-[#c33418] hover:text-[#c33418]">Log out ↗</button>
          )}
        </div>
      </nav>
    </header>
  );
}
