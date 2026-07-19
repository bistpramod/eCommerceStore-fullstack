import { useState, useEffect } from "react";
import api from "../api/Axios";

export default function Cart() {
    const userId = localStorage.getItem("userId");

    const [cart, setCart] = useState(null);

    //* load cart data
    const loadCart = async () => {
        if (!userId) return;

        try {
            const response = await api.get(`/cart/${userId}`);

            // FIX: setcart -> setCart
            setCart(response.data);

        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    //* remove item
    const removeItems = async (productId) => {
        try {
            await api.post("/cart/remove", { userId, productId });

            loadCart();

            // FIX: event name
            window.dispatchEvent(new Event("cartUpdated"));

        } catch (error) {
            console.error(error);
        }
    };

    //* update quantity
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

            loadCart();

            // FIX: event name
            window.dispatchEvent(new Event("cartUpdated"));

        } catch (error) {
            console.error(error);
        }
    };

    if (!cart) {
        return (
            <div className="flex min-h-screen items-center justify-center text-xl">
                Loading...
            </div>
        );
    }

    // FIX: reduct -> reduce
    // FIX: productid -> productId

    const total = cart.items.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0
    );

    return (
        <div className="mx-auto max-w-5xl px-6 py-10">

            <h1 className="mb-8 text-4xl font-bold">
                Your Cart
            </h1>

            {cart.items.length === 0 ? (

                <div className="rounded-xl bg-gray-100 p-8 text-center text-xl">
                    Your cart is empty
                </div>

            ) : (

                <>
                    <div className="space-y-4">

                        {cart.items.map((item) => (

                            <div
                                key={item.productId._id}
                                className="flex items-center justify-between rounded-xl border p-5 shadow-sm"
                            >

                                <div className="flex items-center gap-4">

                                    {/* FIX: image.productId.title -> item.productId.title */}

                                    <img
                                        src={item.productId.image}
                                        alt={item.productId.title}
                                        className="h-24 w-24 rounded-lg object-cover"
                                    />

                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            {item.productId.title}
                                        </h2>

                                        <p className="text-gray-500">
                                            ${item.productId.price.toFixed(2)}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-3">

                                    {/* FIX: pass _id */}

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.productId._id,
                                                item.quantity - 1
                                            )
                                        }
                                        className="rounded bg-gray-200 px-3 py-1 text-lg"
                                    >
                                        -
                                    </button>

                                    <span className="text-lg font-medium">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.productId._id,
                                                item.quantity + 1
                                            )
                                        }
                                        className="rounded bg-gray-200 px-3 py-1 text-lg"
                                    >
                                        +
                                    </button>

                                </div>

                                <div className="text-lg font-semibold">
                                    $
                                    {(
                                        item.productId.price * item.quantity
                                    ).toFixed(2)}
                                </div>

                                <button
                                    onClick={() =>
                                        removeItems(item.productId._id)
                                    }
                                    className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                                >
                                    Remove
                                </button>

                            </div>

                        ))}

                    </div>

                    <div className="mt-8 flex justify-end">

                        <div className="rounded-xl bg-gray-100 p-6 shadow">

                            <h2 className="text-2xl font-bold">
                                Total: ${total.toFixed(2)}
                            </h2>

                        </div>

                    </div>
                </>
            )}
        </div>
    );
}