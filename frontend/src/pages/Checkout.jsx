import { useState, useEffect } from "react";
import api from "../api/Axios";

export default function Checkout() {
    const userId = localStorage.getItem("userId"); // FIX: was userID, mismatched with usage below

    const [address, setAddress] = useState([]);
    const [cart, setCart] = useState(null);

    useEffect(() => {
        api.get(`/cart/${userId}`)
            .then((res) => setCart(res.data))
            .catch((err) => console.error("Failed to load cart:", err));

        api.get(`/address/${userId}`)
            .then((res) => setAddress(res.data))
            .catch((err) => console.error("Failed to load address:", err));
    }, []);

    if (!cart) {
        return (
            <div className="flex min-h-screen items-center justify-center text-lg font-medium text-gray-500">
                Loading...
            </div>
        );
    }

    // FIX: accumulator was named "SubmitEvent" but body referenced undefined "sum";
    // also items are populated as productId, not product
    const total = cart.items.reduce(
        (sum, i) => sum + i.quantity * i.productId.price, 0
    );

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10">
            <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg">

                <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Checkout
                </h1>

                <h2 className="mb-3 text-lg font-semibold text-gray-700">
                    Select Address
                </h2>

                <div className="mb-8 space-y-3">
                    {address.length === 0 && (
                        <p className="text-sm text-gray-500">No saved addresses yet.</p>
                    )}

                    {/* FIX: arrow function body needs an explicit return to render the div */}
                    {address.map((addr) => (
                        <div
                            key={addr._id}
                            className="rounded-lg border border-gray-200 p-4 transition hover:border-blue-400"
                        >
                            <p className="font-medium text-gray-800">{addr.fullName}</p>
                            <p className="text-sm text-gray-500">{addr.phone}</p>
                            <p className="text-sm text-gray-500">
                                {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                        </div>
                    ))}
                </div>

                <h2 className="mb-3 text-lg font-semibold text-gray-700">
                    Order Summary
                </h2>
                <p className="mb-6 text-xl font-bold text-green-600">
                    Total Amount: ${total}
                </p>

                <button className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700">
                    Place Order (COD)
                </button>

            </div>
        </div>
    );
}