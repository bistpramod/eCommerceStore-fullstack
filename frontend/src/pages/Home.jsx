import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios";

const categories = ["", "fruits", "electronics", "smartphones", "laptops"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedId, setAddedId] = useState("");
  const navigate = useNavigate();

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/products", { params: { search, category } });
      setProducts(response.data.data || []);
    } catch (requestError) {
      console.error("An error occurred:", requestError);
      setError("We could not load the products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) { navigate("/login"); return; }
    try {
      await api.post("/cart/add", { userId, productId });
      setAddedId(productId);
      window.dispatchEvent(new Event("cartUpdated"));
      setTimeout(() => setAddedId(""), 1500);
    } catch (requestError) {
      console.error("Failed to add item to cart:", requestError);
    }
  };

  const scrollToProducts = () => document.getElementById("products")?.scrollIntoView();

  return (
    <div>
      <section className="mx-auto grid min-h-[calc(100vh-71px)] max-w-[1160px] items-center gap-14 px-5 py-16 lg:grid-cols-[1.5fr_0.72fr] lg:gap-24 lg:py-20">
        <div>
          <p className="mono-label mb-7 flex items-center gap-2.5 text-[#6a6577]">
            <span className="h-2 w-2 rounded-full bg-[#0e7f5c] shadow-[0_0_0_4px_rgba(14,127,92,0.11)]" /> Independent online shop · Kathmandu
          </p>
          <h1 className="max-w-4xl text-[clamp(3.5rem,8vw,7.2rem)] font-bold leading-[0.88] tracking-[-0.065em]">
            Useful finds,<br />picked with <span className="marker-word">intent.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#6a6577]">A small, clear collection for everyday life. No endless aisles—just products worth keeping around.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button onClick={scrollToProducts} className="editorial-button border border-[#100e17] bg-[#100e17] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-[#c33418] hover:bg-[#c33418]">Browse the edit <span className="ml-2">↘</span></button>
            <Link to="/cart" className="editorial-button border border-[#e6e5ea] bg-white px-5 py-3.5 text-sm font-bold transition hover:-translate-y-0.5 hover:border-[#100e17]">View your cart</Link>
          </div>
        </div>
        <aside className="paper-note relative rotate-[-1.2deg] px-8 pb-7 pt-11 text-[#211d0b]" aria-label="Store note">
          <p className="mono-label mb-5">This week&rsquo;s edit</p>
          <div className="divide-y divide-[#211d0b]/15 border-y border-[#211d0b]/15">
            {["Objects for daily rituals", "Reliable tech essentials", "Small comforts, well chosen"].map((note, index) => (
              <div key={note} className="grid grid-cols-[32px_1fr] gap-3 py-4"><span className="font-mono text-xs text-[#211d0b]/45">0{index + 1}</span><p className="font-semibold leading-snug">{note}</p></div>
            ))}
          </div>
          <p className="mt-6 text-right font-mono text-xs text-[#211d0b]/55">VividVistaa — 2026</p>
        </aside>
      </section>

      <section id="products" className="scroll-mt-20 border-t border-[#e6e5ea] bg-white px-5 py-20 lg:py-28">
        <div className="mx-auto max-w-[1160px]">
          <div className="grid gap-8 border-b border-[#100e17] pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div><p className="mono-label text-[#c33418]">01 / The collection</p><h2 className="mt-3 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">Shop what made the cut.</h2></div>
            <label className="relative block w-full lg:w-80">
              <span className="sr-only">Search products</span>
              <svg viewBox="0 0 24 24" fill="none" className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6a6577]" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
              <input type="search" placeholder="Search the collection" value={search} onChange={(event) => setSearch(event.target.value)} className="editorial-input w-full border border-[#d6d4dc] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#100e17]" />
            </label>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-[#e6e5ea] py-5">
            {categories.map((item) => (
              <button key={item || "all"} onClick={() => setCategory(item)} className={`relative py-1 font-mono text-[11px] uppercase tracking-[0.08em] transition ${category === item ? "text-[#100e17] after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-[#c33418]" : "text-[#6a6577] hover:text-[#100e17]"}`}>{item || "All goods"}</button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-px border-x border-b border-[#e6e5ea] bg-[#e6e5ea] sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="bg-white p-5"><div className="aspect-[4/5] animate-pulse bg-[#f5f5f7]" /><div className="mt-5 h-5 animate-pulse bg-[#f5f5f7]" /></div>)}</div>
          ) : error ? (
            <div className="border-x border-b border-[#e6e5ea] bg-[#ffe9e4] p-12 text-center"><p className="font-semibold text-[#c33418]">{error}</p><button onClick={loadProducts} className="editorial-button mt-5 bg-[#100e17] px-5 py-3 text-sm font-bold text-white">Try again</button></div>
          ) : products.length === 0 ? (
            <div className="border-x border-b border-[#e6e5ea] p-16 text-center"><p className="mono-label text-[#c33418]">No match</p><h3 className="mt-3 text-2xl font-bold">Nothing in this aisle yet.</h3><button onClick={() => { setSearch(""); setCategory(""); }} className="mt-5 text-sm font-bold underline decoration-[#c33418] decoration-2 underline-offset-4">Clear filters</button></div>
          ) : (
            <div className="grid grid-cols-1 gap-px border-x border-b border-[#e6e5ea] bg-[#e6e5ea] sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <article key={product._id} className="product-card group flex flex-col bg-white p-5">
                  <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.09em] text-[#6a6577]"><span>No. {String(index + 1).padStart(2, "0")}</span><span>{product.category || "Everyday"}</span></div>
                  <Link to={`/product/${product._id}`} className="relative block overflow-hidden bg-[#f5f5f7]">
                    {product.image ? <img src={product.image} alt={product.title} className="product-image aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.025]" /> : <div className="flex aspect-[4/5] items-center justify-center text-7xl font-bold text-[#100e17]/10">{product.title?.charAt(0)}</div>}
                    <span className="absolute bottom-0 right-0 bg-white px-3 py-2 font-mono text-[10px] uppercase tracking-wider">{product.stock > 0 ? `${product.stock} available` : "Sold out"}</span>
                  </Link>
                  <div className="flex items-start justify-between gap-4 pt-5"><Link to={`/product/${product._id}`} className="min-w-0"><h3 className="text-xl font-bold leading-tight tracking-[-0.025em] transition group-hover:text-[#c33418]">{product.title}</h3></Link><p className="shrink-0 font-mono text-sm font-medium">${Number(product.price).toFixed(2)}</p></div>
                  <button onClick={() => addToCart(product._id)} disabled={product.stock <= 0} className={`editorial-button mt-5 w-full border py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:border-[#e6e5ea] disabled:bg-[#f5f5f7] disabled:text-[#6a6577] ${addedId === product._id ? "border-[#0e7f5c] bg-[#0e7f5c] text-white" : "border-[#100e17] bg-white hover:bg-[#100e17] hover:text-white"}`}>{product.stock <= 0 ? "Out of stock" : addedId === product._id ? "Added ✓" : "Add to cart +"}</button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="overflow-hidden border-y border-[#100e17] bg-[#ffd84d] py-4"><p className="whitespace-nowrap text-center font-mono text-xs font-medium uppercase tracking-[0.12em]">Careful picks &nbsp; ◆ &nbsp; Clear prices &nbsp; ◆ &nbsp; Cash on delivery &nbsp; ◆ &nbsp; Built for everyday use</p></section>
    </div>
  );
}
