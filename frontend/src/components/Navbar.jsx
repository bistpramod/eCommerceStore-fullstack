import { Link, useNavigate } from "react-router-dom";
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
        <nav className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-gray-100 bg-white/95 px-4 py-4 shadow-sm backdrop-blur md:px-8">

            <Link
                to="/"
                className="text-2xl font-bold tracking-tight text-purple-600 transition hover:text-purple-800"
            >
                VividVistaa
            </Link>

            <div className="flex items-center gap-3 md:gap-5">

                {role === "admin" && (
                    <Link
                        to="/admin/products"
                        className="hidden rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 sm:block"
                    >
                        Admin
                    </Link>
                )}

                <Link
                    to="/cart"
                    className="relative rounded-lg p-2 text-xl transition hover:bg-gray-100"
                >
                    🛒

                    {cartCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {!userId ? (
                    <>
                        <Link
                            to="/login"
                            className="rounded-lg border border-purple-600 px-3 py-2 text-sm text-purple-600 transition hover:bg-purple-600 hover:text-white md:px-4"
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="rounded-lg bg-purple-600 px-3 py-2 text-sm text-white transition hover:bg-purple-700 md:px-4"
                        >
                            Signup
                        </Link>
                    </>
                ) : (
                    <button
                        onClick={logout}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
                    >
                        Logout
                    </button>
                )}

            </div>
        </nav>
    );
}
