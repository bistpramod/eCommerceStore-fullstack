import { useState, useEffect } from "react";
import api from "axios";
import { Link } from "react-router-dom";

export default function ProductList() {
    const [products, setProducts] = useState([])

    const loadProducts = async () => {
    try {
        const response = await api.get("/products");
        setProducts(response.data);
    } catch (error) {
        console.error("Error loading products:", error);
    }
};
    const deletedProduct = async (id) => {
        try {
            await api.delete(`/products/delete/${id}`);
            alert("Product deleted successfully");
            await loadProducts(); // updated backend data is received from here which means the deleted product removed and newly sorted data  
        }
        catch (error) {
            console.error("Error deleting the Product", error)
        }
    }
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
                        {products.map((product) => (
                            <tr
                                key={product.id}
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
                                            to={`/admin/products/edit/${product.id}`}
                                            className="rounded-lg bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => deletedProduct(product.id)}
                                            className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    </div>
);
}