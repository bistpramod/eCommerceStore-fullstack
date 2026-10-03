import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios";

export default function Checkout() {
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        Promise.all([
            api.get(`/cart/${userId}`),
            api.get(`/address/${userId}`),
        ])
            .then(([cartResponse, addressResponse]) => {
                setCart(cartResponse.data);
                setAddresses(addressResponse.data);
                setSelectedAddress(addressResponse.data[0] || null);
            })
            .catch((error) => {
                console.error("Failed to load checkout:", error);
                setError("We could not load your checkout details.");
            })
            .finally(() => setLoading(false));
    }, [userId, navigate]);

    const placeOrder = async () => {
        if (!selectedAddress) {
            setError("Please select or add a delivery address.");
            return;
        }

        try {
            setPlacing(true);
            setError("");

            const response = await api.post("/order/place", {
                userId,
                address: selectedAddress,
            });

            window.dispatchEvent(new Event("cartUpdated"));
            navigate(`/order-success/${response.data.order._id}`);
        } catch (error) {
            console.error("Failed to place order:", error);
            setError(error.response?.data?.message || "Something went wrong placing your order.");
        } finally {
            setPlacing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black" />
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-5 text-center">
                <div>
                    <h1 className="text-3xl font-bold">Your cart is empty</h1>
                    <p className="mt-3 text-black/50">Add something to your cart before checking out.</p>
                    <Link to="/" className="mt-6 inline-block rounded-full bg-[#1c1c1a] px-6 py-3 text-sm font-bold text-white">Back to shop</Link>
                </div>
            </div>
        );
    }

    const total = cart.items.reduce((sum, item) => sum + item.quantity * item.productId.price, 0);

    return (
        <div className="px-5 py-10 lg:px-8 lg:py-14">
            <div className="mx-auto max-w-7xl">
                <Link to="/cart" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-black/50 transition hover:text-black">
                    <span>←</span> Back to cart
                </Link>

                <div className="mb-9">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4572e]">Almost there</p>
                    <h1 className="mt-2 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Checkout</h1>
                </div>

                {error && (
                    <p className="mb-6 rounded-2xl bg-[#fff1eb] px-5 py-4 text-sm font-medium text-[#a73516]">{error}</p>
                )}

                <div className="grid gap-7 lg:grid-cols-[1fr_390px]">
                    <div className="space-y-7">
                        <section className="rounded-[2rem] bg-white p-6 sm:p-8">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-black/40">Step 1</p>
                                    <h2 className="mt-1 text-2xl font-bold">Delivery address</h2>
                                </div>
                                <Link to="/checkout-address" className="rounded-full border border-black/15 px-4 py-2.5 text-xs font-bold transition hover:border-black">
                                    + Add address
                                </Link>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="mt-7 rounded-2xl border border-dashed border-black/20 p-7 text-center">
                                    <p className="font-bold">No saved address yet</p>
                                    <p className="mt-1 text-sm text-black/50">Add one to continue with your order.</p>
                                    <Link to="/checkout-address" className="mt-4 inline-block text-sm font-bold underline underline-offset-4">Add delivery address</Link>
                                </div>
                            ) : (
                                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                                    {addresses.map((address) => (
                                        <label key={address._id} className={`cursor-pointer rounded-2xl border p-5 transition ${selectedAddress?._id === address._id ? "border-[#4f7b53] bg-[#eef4e9]" : "border-black/10 hover:border-black/30"}`}>
                                            <div className="flex items-start gap-3">
                                                <input type="radio" name="address" checked={selectedAddress?._id === address._id} onChange={() => setSelectedAddress(address)} className="mt-1 accent-[#4f7b53]" />
                                                <div>
                                                    <p className="font-bold">{address.fullName}</p>
                                                    <p className="mt-2 text-sm leading-6 text-black/50">{address.addressLine}<br />{address.city}, {address.state} {address.pincode}<br />{address.phone}</p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="rounded-[2rem] bg-white p-6 sm:p-8">
                            <p className="text-xs font-bold uppercase tracking-widest text-black/40">Step 2</p>
                            <h2 className="mt-1 text-2xl font-bold">Payment</h2>
                            <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#4f7b53] bg-[#eef4e9] p-5">
                                <div>
                                    <p className="font-bold">Cash on delivery</p>
                                    <p className="mt-1 text-sm text-black/50">Pay when your order arrives.</p>
                                </div>
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4f7b53] text-xs text-white">✓</span>
                            </div>
                        </section>
                    </div>

                    <aside className="h-fit rounded-[2rem] bg-[#1c1c1a] p-7 text-white lg:sticky lg:top-24">
                        <h2 className="text-2xl font-bold">Your order</h2>
                        <div className="mt-6 max-h-72 space-y-4 overflow-auto border-b border-white/15 pb-6">
                            {cart.items.map((item) => (
                                <div key={item.productId._id} className="flex items-center gap-3">
                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/10">
                                        {item.productId.image && <img src={item.productId.image} alt={item.productId.title} className="h-full w-full object-cover" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold">{item.productId.title}</p>
                                        <p className="mt-1 text-xs text-white/45">Quantity {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold">${(item.productId.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-end justify-between py-6">
                            <div>
                                <p className="text-sm text-white/50">Total</p>
                                <p className="mt-1 text-xs text-white/35">Taxes included</p>
                            </div>
                            <p className="text-3xl font-bold">${total.toFixed(2)}</p>
                        </div>
                        <button onClick={placeOrder} disabled={placing || !selectedAddress} className="w-full rounded-full bg-[#f4b942] py-4 text-sm font-bold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">
                            {placing ? "Placing order..." : "Place order"}
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    );
}
