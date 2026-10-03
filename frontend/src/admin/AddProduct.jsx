import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios";

export default function AddProduct() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        stock: "",
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("role") !== "admin") {
            navigate("/");
        }
    }, [navigate]);

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
            setError("");

            const data = new FormData();

            Object.keys(form).forEach((key) => {
                data.append(key, form[key]);
            });

            if (image) {
                data.append("image", image);
            }

            await api.post("/products/add", data);
            navigate("/admin/products");
        } catch (error) {
            console.error("An error occurred while adding the product", error);
            setError(error.response?.data?.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-5 py-10 lg:px-8 lg:py-14">
            <div className="mx-auto max-w-4xl">
                <Link to="/admin/products" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-black/50 transition hover:text-black">
                    <span>←</span> Back to products
                </Link>

                <div className="rounded-[2rem] bg-white p-6 sm:p-10">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4572e]">New listing</p>
                    <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em]">Add product</h1>
                    <p className="mt-3 text-sm text-black/50">Fill in the details customers need to know.</p>

                    {error && <p className="mt-6 rounded-2xl bg-[#fff1eb] px-4 py-3 text-sm font-medium text-[#a73516]">{error}</p>}

                    <form onSubmit={handleSubmit} className="mt-8 grid gap-6 md:grid-cols-2">
                        <label className="block md:col-span-2">
                            <span className="mb-2 block text-sm font-bold">Product title</span>
                            <input name="title" value={form.title} onChange={handleChange} placeholder="What is the product called?" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" required />
                        </label>

                        <label className="block md:col-span-2">
                            <span className="mb-2 block text-sm font-bold">Description</span>
                            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Tell customers about this product" rows="5" className="w-full resize-none rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-bold">Price</span>
                            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" min="0" step="0.01" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" required />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-bold">Stock</span>
                            <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" min="0" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" required />
                        </label>

                        <label className="block md:col-span-2">
                            <span className="mb-2 block text-sm font-bold">Category</span>
                            <input name="category" value={form.category} onChange={handleChange} placeholder="For example: electronics" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" />
                        </label>

                        <label className="block md:col-span-2">
                            <span className="mb-2 block text-sm font-bold">Product image</span>
                            <div className="rounded-2xl border border-dashed border-black/25 bg-[#f7f6f2] p-6 text-center transition hover:border-black/50">
                                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm text-black/50 file:mr-4 file:rounded-full file:border-0 file:bg-[#1c1c1a] file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-white" />
                                {image && <p className="mt-3 text-xs font-semibold text-[#4f7b53]">Selected: {image.name}</p>}
                            </div>
                        </label>

                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end md:col-span-2">
                            <Link to="/admin/products" className="rounded-full border border-black/15 px-6 py-3.5 text-center text-sm font-bold transition hover:border-black">Cancel</Link>
                            <button type="submit" disabled={loading} className="rounded-full bg-[#1c1c1a] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#e4572e] disabled:opacity-50">
                                {loading ? "Adding product..." : "Add product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
