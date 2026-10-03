import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/products");
            setProducts(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error("Error loading products", error);
            setError("Could not load the products.");
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        const shouldDelete = window.confirm("Delete this product?");

        if (!shouldDelete) {
            return;
        }

        try {
            setDeletingId(id);
            await api.delete(`/products/delete/${id}`);
            await loadProducts();
        } catch (error) {
            console.error("Error deleting the product", error);
            setError(error.response?.data?.message || "Could not delete the product.");
        } finally {
            setDeletingId("");
        }
    };

    useEffect(() => {
        if (localStorage.getItem("role") !== "admin") {
            navigate("/");
            return;
        }

        api.get("/products")
            .then((response) => {
                setProducts(Array.isArray(response.data.data) ? response.data.data : []);
            })
            .catch((error) => {
                console.error("Error loading products", error);
                setError("Could not load the products.");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    return (
        <div className="px-5 py-10 lg:px-8 lg:py-14">
            <div className="mx-auto max-w-7xl">
                <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e4572e]">Admin area</p>
                        <h1 className="mt-2 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Products</h1>
                        <p className="mt-3 text-sm text-black/50">Add products, update stock, and keep the store current.</p>
                    </div>
                    <Link to="/admin/products/add" className="w-fit rounded-full bg-[#1c1c1a] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#e4572e]">
                        + Add product
                    </Link>
                </div>

                {error && (
                    <p className="mb-6 rounded-2xl bg-[#fff1eb] px-5 py-4 text-sm font-medium text-[#a73516]">{error}</p>
                )}

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-3xl bg-black/10" />)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="rounded-[2rem] bg-white p-14 text-center">
                        <h2 className="text-2xl font-bold">No products yet</h2>
                        <p className="mt-2 text-sm text-black/50">Add your first product to start the store.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white">
                        <div className="hidden grid-cols-[1fr_140px_110px_170px] gap-4 border-b border-black/10 bg-[#efede7] px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-black/45 md:grid">
                            <p>Product</p>
                            <p>Price</p>
                            <p>Stock</p>
                            <p className="text-right">Actions</p>
                        </div>

                        {products.map((product) => (
                            <article key={product._id} className="grid gap-5 border-b border-black/10 p-5 last:border-0 md:grid-cols-[1fr_140px_110px_170px] md:items-center md:gap-4 md:px-6">
                                <div className="flex min-w-0 items-center gap-4">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#ebe9e2]">
                                        {product.image ? <img src={product.image} alt={product.title} className="h-full w-full object-cover" /> : <span className="text-xl font-bold text-black/15">{product.title?.charAt(0)}</span>}
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="truncate font-bold">{product.title}</h2>
                                        <p className="mt-1 text-xs uppercase tracking-wider text-black/40">{product.category || "No category"}</p>
                                    </div>
                                </div>

                                <p className="font-bold">${Number(product.price).toFixed(2)}</p>
                                <p className={`text-sm font-semibold ${product.stock > 0 ? "text-[#4f7b53]" : "text-[#e4572e]"}`}>{product.stock} in stock</p>

                                <div className="flex gap-2 md:justify-end">
                                    <Link to={`/admin/products/edit/${product._id}`} className="rounded-full border border-black/15 px-4 py-2 text-xs font-bold transition hover:border-black">Edit</Link>
                                    <button onClick={() => deleteProduct(product._id)} disabled={deletingId === product._id} className="rounded-full bg-[#fff1eb] px-4 py-2 text-xs font-bold text-[#a73516] transition hover:bg-[#e4572e] hover:text-white disabled:opacity-40">
                                        {deletingId === product._id ? "Deleting" : "Delete"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
