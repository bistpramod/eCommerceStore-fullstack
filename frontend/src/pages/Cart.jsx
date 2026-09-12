import { useState, useEffect } from "react";
import api from "../api/Axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const userId = localStorage.getItem("userId");

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loadCart = async () => {
        if (!userId) {
            setCart({ items: [] });
            return;
        }

        try {
            const response = await api.get(`/cart/${userId}`);
            setCart(response.data);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const removeItems = async (productId) => {
        try {
            setLoading(true);

            await api.post("/cart/remove", { userId, productId });

            await loadCart();
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            if (quantity <= 0) {
                await removeItems(productId);
                return;
            }

            await api.post("/cart/update", {
                userId,
                productId,
                quantity,
            });

            await loadCart();
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error(error);
        }
    };

    if (!cart) {
        return (
            <div className="flex min-h-screen items-center justify-center text-gray-500">
                Loading cart...
            </div>
        );
    }

    const total = cart.items.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-5xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        Your Cart
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Review your items before checkout.
                    </p>
                </div>

                {cart.items.length === 0 ? (
                    <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Your cart is empty
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Add some products and they will appear here.
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <div
                                    key={item.productId._id}
                                    className="rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                                >
                                    <div className="flex gap-4">

                                        <img
                                            src={item.productId.image || "https://via.placeholder.com/200"}
                                            alt={item.productId.title}
                                            className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h2 className="truncate text-lg font-semibold text-gray-800">
                                                        {item.productId.title}
                                                    </h2>

                                                    <p className="mt-1 text-gray-500">
                                                        ${item.productId.price.toFixed(2)}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => removeItems(item.productId._id)}
                                                    disabled={loading}
                                                    className="text-sm text-red-500 transition hover:text-red-700 disabled:opacity-50"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="mt-5 flex items-center justify-between">
                                                <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.productId._id,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-lg transition hover:bg-gray-100"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="min-w-10 text-center font-medium">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.productId._id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-lg transition hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <p className="font-semibold text-gray-900">
                                                    ${(item.productId.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-24">
                            <h2 className="text-xl font-bold text-gray-900">
                                Order Summary
                            </h2>

                            <div className="my-5 border-t border-gray-100 pt-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Total</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/checkout-address")}
                                className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
                            >
                                Proceed to Checkout
                            </button>

                            <button
                                onClick={() => navigate("/")}
                                className="mt-3 w-full rounded-lg border border-gray-200 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Continue Shopping
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
