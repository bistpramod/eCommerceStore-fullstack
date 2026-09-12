import { useEffect, useState } from "react";
import api from "../api/Axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        stock: "",
    });

    const [oldImage, setOldImage] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadProduct = async () => {
        try {
            const response = await api.get("/products");

            const product = response.data.data.find(
                (product) => product._id === id
            );

            if (product) {
                setForm({
                    title: product.title || "",
                    description: product.description || "",
                    price: product.price || "",
                    category: product.category || "",
                    stock: product.stock || "",
                });

                setOldImage(product.image || "");
            }
        } catch (error) {
            console.error("Error loading product:", error);
        }
    };

    useEffect(() => {
        loadProduct();
    }, [id]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const data = new FormData();

            Object.keys(form).forEach((key) => {
                data.append(key, form[key]);
            });

            if (image) {
                data.append("image", image);
            }

            await api.put(`/products/update/${id}`, data);

            navigate("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm">

                <h2 className="text-3xl font-bold text-gray-800">
                    Edit Product
                </h2>

                <p className="mb-7 mt-1 text-sm text-gray-500">
                    Update your product details
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Product title"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Product description"
                        rows="4"
                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Price"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            required
                        />

                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            placeholder="Stock"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <input
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Category"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    {oldImage && (
                        <div>
                            <p className="mb-2 text-sm font-medium text-gray-700">
                                Current image
                            </p>

                            <img
                                src={oldImage}
                                alt={form.title}
                                className="h-40 w-full rounded-lg object-cover"
                            />
                        </div>
                    )}

                    <div className="rounded-lg border border-dashed border-gray-300 p-4">
                        <p className="mb-2 text-sm font-medium text-gray-700">
                            Replace image
                        </p>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full text-sm text-gray-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Updating..." : "Update Product"}
                    </button>

                </form>
            </div>
        </div>
    );
}
