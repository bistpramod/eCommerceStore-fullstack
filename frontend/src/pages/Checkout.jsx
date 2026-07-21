import { useState, useEffect } from "react";
import api from "../api/Axios";
import { useNavigate } from "react-router-dom";


export default function Checkout() {
    const userId = localStorage.getItem("userId"); // FIX: was userID, mismatched with usage below

    const [address, setAddress] = useState([]);
    const [selectAddress, setSelectAddress] = useState(null)
    const [cart, setCart] = useState(null);
    const navigate = useNavigate()


    useEffect(() => {
        if (!userId) {
            navigate("/");
            return;
        }

        api.get(`/cart/${userId}`).then((res) => setCart(res.data));
        api.get(`/address/${userId}`).then((res) => {
            setSelectedAddress(res.data[0]); // Default to first address
        });
    }, []);
    if (!cart) {
        return (
            <div className="flex min-h-screen items-center justify-center text-lg font-medium text-gray-500">
                Loading...
            </div>
        );
    }


    // items are populated as productId, not product
    const total = cart.items.reduce(
        (sum, i) => sum + i.quantity * i.productId.price, 0
    );

    const placeOrder = async () => {
        if (!selectAddress) {
            alert("Please select an address")
            return;

        }
        const response = await api.post("/order/place", {
            userId,
            address: selectAddress,
        })
    }

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


                    {address.map((addr) => (
                        <label
                            key={addr._id}
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition
            ${selectAddress?._id === addr._id
                                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                    : "border-gray-200 hover:border-blue-300"}
        `}
                        >
                            <input
                                type="radio"
                                name="address"
                                checked={selectAddress?._id === addr._id}
                                onChange={() => setSelectAddress(addr)}
                                className="mt-1 h-4 w-4 accent-blue-600"
                            />

                            <div>
                                <strong className="block text-gray-800">{addr.fullName}</strong>
                                <p className="text-sm text-gray-500">{addr.phone}</p>
                                <p className="text-sm text-gray-500">
                                    {addr.addressLine}, {addr.city}, {addr.state} {addr.pincode}
                                </p>
                                <p className="text-sm">{addr.phone}</p>
                            </div>
                        </label>
                    ))}
                </div>

                <h2 className="mb-3 text-lg font-semibold text-gray-700">
                    Order Summary
                </h2>
                <p className="mb-6 text-xl font-bold text-green-600">
                    Total Amount: ${total}
                </p>

                <button className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700" onClick={placeOrder}>
                    Place Order (COD)
                </button>

            </div>
        </div>
    );
}