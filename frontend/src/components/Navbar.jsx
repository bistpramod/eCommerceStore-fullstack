import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/Axios.jsx";

export default function Navbar() {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    useEffect(() => {
        const loadCart = async () => {
            try {
                if (!userId) {
                    setCartCount(0);
                    return;
                }

                const response = await api.get(`/cart/${userId}`);

                const total = response.data.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );

                setCartCount(total);
            } catch (error) {
                console.log(error);
                setCartCount(0);
            }
        };

        loadCart();

        window.addEventListener("cartUpdated", loadCart);

        return () => {
            window.removeEventListener("cartUpdated", loadCart);
        };
    }, [userId]);

    const logout = () => {
        localStorage.clear();
        setCartCount(0);
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-[#243029]/10 bg-[#f4f2ed]/95 backdrop-blur-xl">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
                <Link to="/" className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#243029] text-sm font-bold text-white">
                        V
                    </span>
                    <span className="text-xl font-bold tracking-[-0.04em]">VividVistaa</span>
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `text-sm font-medium transition ${isActive ? "text-[#243029]" : "text-[#243029]/50 hover:text-[#243029]"}`}
                    >
                        Shop
                    </NavLink>

                    {role === "admin" && (
                        <NavLink
                            to="/admin/products"
                            className={({ isActive }) => `text-sm font-medium transition ${isActive ? "text-[#243029]" : "text-[#243029]/50 hover:text-[#243029]"}`}
                        >
                            Products
                        </NavLink>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        to="/cart"
                        aria-label="Shopping cart"
                        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#243029]/10 bg-[#fbfaf7] transition hover:border-[#243029]/30"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                            <path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 1.9-1.4L21 7H6" />
                            <circle cx="9" cy="20" r="1" />
                            <circle cx="18" cy="20" r="1" />
                        </svg>

                        {cartCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a65f46] px-1 text-[10px] font-bold text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {!userId ? (
                        <>
                            <Link to="/login" className="hidden px-3 py-2 text-sm font-semibold sm:block">
                                Log in
                            </Link>
                            <Link to="/signup" className="rounded-full bg-[#243029] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a65f46]">
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <button onClick={logout} className="rounded-full border border-[#243029]/15 bg-[#fbfaf7] px-4 py-2.5 text-sm font-semibold transition hover:border-[#243029]">
                            Log out
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
