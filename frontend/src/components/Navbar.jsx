import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/Axios.jsx";

export default function Navbar() {

    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    const userId = localStorage.getItem("userId");

    useEffect(() => {

        const loadCart = async () => {
            try {
                if (!userId) return setCartCount(0);

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
        <nav className="flex w-full items-center justify-between bg-white px-8 py-4 shadow-md">

            <Link to="/" className="text-2xl font-bold text-purple-600 transition hover:text-purple-800">
                VividVistaa
            </Link>


            <div className="flex items-center gap-6">

                <Link to="/cart" className="relative text-2xl transition hover:scale-110">
                    🛒

                    {cartCount > 0 && (
                        <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {cartCount}
                        </span>
                    )}
                </Link>


                {!userId ? (
                    <>
                        <Link to="/login" className="rounded-lg border border-purple-600 px-4 py-2 text-purple-600 transition hover:bg-purple-600 hover:text-white">
                            Login
                        </Link>

                        <Link to="/signup" className="rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700">
                            Signup
                        </Link>
                    </>
                ) : (
                    <button onClick={logout} className="rounded-lg bg-red-500 px-5 py-2 text-white transition hover:bg-red-600">
                        Logout
                    </button>
                )}

            </div>

        </nav>
    );
}