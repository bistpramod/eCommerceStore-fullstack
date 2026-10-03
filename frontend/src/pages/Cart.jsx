import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios";

export default function Cart() {
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [cart, setCart] = useState(userId ? null : { items: [] });
    const [updatingId, setUpdatingId] = useState("");
    const [error, setError] = useState("");

    const loadCart = async () => {
        if (!userId) {
            setCart({ items: [] });
            return;
        }

        try {
            setError("");
            const response = await api.get(`/cart/${userId}`);
            setCart(response.data);
        } catch (error) {
            console.error("An error occurred:", error);
            setError("We could not load your cart.");
            setCart({ items: [] });
        }
    };

    useEffect(() => {
        if (!userId) {
            return;
        }

        api.get(`/cart/${userId}`)
            .then((response) => setCart(response.data))
            .catch((error) => {
                console.error("An error occurred:", error);
                setError("We could not load your cart.");
                setCart({ items: [] });
            });
    }, [userId]);

    const removeItem = async (productId) => {
        try {
            setUpdatingId(productId);
            await api.post("/cart/remove", { userId, productId });
            await loadCart();
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error(error);
            setError("Could not remove that item.");
        } finally {
            setUpdatingId("");
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            await removeItem(productId);
            return;
        }

        try {
            setUpdatingId(productId);
            await api.post("/cart/update", { userId, productId, quantity });
            await loadCart();
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error(error);
            setError("Could not update the quantity.");
        } finally {
            setUpdatingId("");
        }
    };

    if (!cart) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black" />
            </div>
        );
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

    return (
        <div className="px-5 py-10 lg:px-8 lg:py-14">
            <div className="mx-auto max-w-7xl">
                <div className="mb-9 flex items-end justify-between gap-5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4572e]">Your selection</p>
                        <h1 className="mt-2 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Shopping cart</h1>
                    </div>
                    <p className="hidden text-sm font-medium text-black/50 sm:block">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
                </div>

                {error && (
                    <p className="mb-6 rounded-2xl bg-[#fff1eb] px-5 py-4 text-sm font-medium text-[#a73516]">{error}</p>
                )}

                {cart.items.length === 0 ? (
                    <div className="rounded-[2rem] border border-black/10 bg-white px-6 py-20 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4b942] text-2xl">＋</div>
                        <h2 className="mt-6 text-2xl font-bold tracking-tight">Your cart is ready for something good</h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/50">
                            {userId ? "Browse the shop and add the products you love." : "Log in to see your cart or start shopping."}
                        </p>
                        <Link to={userId ? "/" : "/login"} className="mt-7 inline-block rounded-full bg-[#1c1c1a] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#e4572e]">
                            {userId ? "Start shopping" : "Log in"}
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-7 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <article key={item.productId._id} className="flex gap-4 rounded-3xl bg-white p-4 sm:gap-6 sm:p-5">
                                    <Link to={`/product/${item.productId._id}`} className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#ebe9e2] sm:h-36 sm:w-36">
                                        {item.productId.image ? (
                                            <img src={item.productId.image} alt={item.productId.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-4xl font-bold text-black/10">{item.productId.title?.charAt(0)}</span>
                                        )}
                                    </Link>

                                    <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">{item.productId.category || "Product"}</p>
                                                <Link to={`/product/${item.productId._id}`} className="mt-1 block truncate text-base font-bold sm:text-xl">
                                                    {item.productId.title}
                                                </Link>
                                                <p className="mt-1 text-sm text-black/50">${Number(item.productId.price).toFixed(2)} each</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.productId._id)}
                                                disabled={updatingId === item.productId._id}
                                                className="text-xs font-bold text-black/40 underline underline-offset-4 transition hover:text-[#e4572e] disabled:opacity-40"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center rounded-full border border-black/10 bg-[#f7f6f2] p-1">
                                                <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)} disabled={updatingId === item.productId._id} className="h-8 w-8 rounded-full transition hover:bg-white disabled:opacity-30">−</button>
                                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)} disabled={updatingId === item.productId._id || item.quantity >= item.productId.stock} className="h-8 w-8 rounded-full transition hover:bg-white disabled:opacity-30">+</button>
                                            </div>
                                            <p className="font-bold">${(item.productId.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <aside className="h-fit rounded-3xl bg-[#1c1c1a] p-7 text-white lg:sticky lg:top-24">
                            <h2 className="text-2xl font-bold tracking-tight">Order summary</h2>
                            <div className="mt-7 space-y-4 border-b border-white/15 pb-6 text-sm">
                                <div className="flex justify-between text-white/60">
                                    <span>Subtotal</span>
                                    <span className="text-white">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span>Delivery</span>
                                    <span className="text-white">Calculated later</span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between py-6">
                                <span className="font-semibold">Total</span>
                                <span className="text-3xl font-bold">${subtotal.toFixed(2)}</span>
                            </div>
                            <button onClick={() => navigate("/checkout")} className="w-full rounded-full bg-[#f4b942] py-4 text-sm font-bold text-black transition hover:bg-white">
                                Continue to checkout
                            </button>
                            <button onClick={() => navigate("/")} className="mt-4 w-full py-2 text-sm font-semibold text-white/60 transition hover:text-white">
                                Keep shopping
                            </button>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
