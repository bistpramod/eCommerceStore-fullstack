import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/Axios";

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
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (localStorage.getItem("role") !== "admin") {
            navigate("/");
            return;
        }

        api.get("/products")
            .then((response) => {
                const product = response.data.data.find((item) => item._id === id);

                if (!product) {
                    setError("Product not found.");
                    return;
                }

                setForm({
                    title: product.title || "",
                    description: product.description || "",
                    price: product.price || "",
                    category: product.category || "",
                    stock: product.stock ?? "",
                });
                setOldImage(product.image || "");
            })
            .catch((error) => {
                console.error("Error loading product:", error);
                setError("Could not load the product.");
            })
            .finally(() => setPageLoading(false));
    }, [id, navigate]);

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

            await api.put(`/products/update/${id}`, data);
            navigate("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
            setError(error.response?.data?.message || "Could not update the product.");
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black" />
            </div>
        );
    }

    return (
        <div className="px-5 py-10 lg:px-8 lg:py-14">
            <div className="mx-auto max-w-4xl">
                <Link to="/admin/products" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-black/50 transition hover:text-black">
                    <span>←</span> Back to products
                </Link>

                <div className="rounded-[2rem] bg-white p-6 sm:p-10">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4572e]">Edit listing</p>
                    <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em]">Update product</h1>
                    <p className="mt-3 text-sm text-black/50">Keep the product information accurate and useful.</p>

                    {error && <p className="mt-6 rounded-2xl bg-[#fff1eb] px-4 py-3 text-sm font-medium text-[#a73516]">{error}</p>}

                    <form onSubmit={handleSubmit} className="mt-8 grid gap-6 md:grid-cols-2">
                        <label className="block md:col-span-2">
                            <span className="mb-2 block text-sm font-bold">Product title</span>
                            <input name="title" value={form.title} onChange={handleChange} placeholder="Product title" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" required />
                        </label>

                        <label className="block md:col-span-2">
                            <span className="mb-2 block text-sm font-bold">Description</span>
                            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description" rows="5" className="w-full resize-none rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-bold">Price</span>
                            <input type="number" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" required />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-bold">Stock</span>
                            <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" required />
                        </label>

                        <label className="block md:col-span-2">
                            <span className="mb-2 block text-sm font-bold">Category</span>
                            <input name="category" value={form.category} onChange={handleChange} placeholder="Product category" className="w-full rounded-2xl border border-black/15 bg-[#f7f6f2] px-4 py-3.5 outline-none transition focus:border-black focus:bg-white" />
                        </label>

                        <div className="grid gap-5 md:col-span-2 sm:grid-cols-[160px_1fr] sm:items-center">
                            <div className="flex h-36 items-center justify-center overflow-hidden rounded-2xl bg-[#ebe9e2]">
                                {oldImage ? <img src={oldImage} alt={form.title} className="h-full w-full object-cover" /> : <span className="text-sm font-semibold text-black/35">No image</span>}
                            </div>
                            <label className="block">
                                <span className="mb-2 block text-sm font-bold">Replace image</span>
                                <div className="rounded-2xl border border-dashed border-black/25 bg-[#f7f6f2] p-5">
                                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm text-black/50 file:mr-4 file:rounded-full file:border-0 file:bg-[#1c1c1a] file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-white" />
                                    {image && <p className="mt-3 text-xs font-semibold text-[#4f7b53]">Selected: {image.name}</p>}
                                </div>
                            </label>
                        </div>

                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end md:col-span-2">
                            <Link to="/admin/products" className="rounded-full border border-black/15 px-6 py-3.5 text-center text-sm font-bold transition hover:border-black">Cancel</Link>
                            <button type="submit" disabled={loading} className="rounded-full bg-[#1c1c1a] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#e4572e] disabled:opacity-50">
                                {loading ? "Saving changes..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
