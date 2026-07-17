import { useState, useEffect } from "react";
import api from "../api/Axios"; // FIXED: Use your configured Axios instance
import { Link } from "react-router-dom";

export default function ProductList() {
    const [products, setProducts] = useState([]);

    const loadProducts = async () => {
        try {
            const response = await api.get("/products");

            console.log("Backend response:", response.data);

            // FIXED:
            // Your backend returns:
            // {
            //   message: "...",
            //   success: true,
            //   data: [...]
            // }
            // So we need response.data.data
            setProducts(
                Array.isArray(response.data.data)
                    ? response.data.data
                    : []
            );

        } catch (error) {
            console.error("Error loading products", error);
        }
    };

    const deletedProduct = async (id) => {
        try {
            await api.delete(`/products/delete/${id}`);

            alert("Product deleted successfully");

            // Reload products after deleting
            await loadProducts();

        } catch (error) {
            console.error("Error deleting the Product", error);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow-lg">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            Product List
                        </h2>

                        <p className="mt-1 text-gray-500">
                            Manage your products.
                        </p>
                    </div>

                    <Link
                        to="/admin/products/add"
                        className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        + Add Product
                    </Link>
                </div>

                {/* Product table */}
                <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full">

                        {/* Table headings */}
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold text-gray-700">
                                    Title
                                </th>

                                <th className="px-6 py-4 text-left font-semibold text-gray-700">
                                    Price
                                </th>

                                <th className="px-6 py-4 text-left font-semibold text-gray-700">
                                    Stock
                                </th>

                                <th className="px-6 py-4 text-left font-semibold text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/* Product rows */}
                        <tbody>
                            {
                                Array.isArray(products) &&
                                products.map((product) => (
                                    <tr
                                        // FIXED:
                                        // MongoDB uses _id, not id.
                                        key={product._id}
                                        className="border-t border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            {product.title}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-blue-600">
                                            ${product.price}
                                        </td>

                                        <td className="px-6 py-4">
                                            {product.stock}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">

                                                <Link
                                                    // FIXED:
                                                    // MongoDB uses _id
                                                    to={`/admin/products/edit/${product._id}`}
                                                    className="rounded-lg bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    // FIXED:
                                                    // MongoDB uses _id
                                                    onClick={() => deletedProduct(product._id)}
                                                    className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>
                </div>

            </div>
        </div>
    );
}