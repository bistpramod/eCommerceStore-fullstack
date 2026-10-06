import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios";

const categoryItems = [
  { value: "fruits", label: "Fresh picks", detail: "Everyday essentials", icon: "✦", color: "#fff0d6" },
  { value: "electronics", label: "Electronics", detail: "Useful, reliable tech", icon: "⌁", color: "#e9edff" },
  { value: "smartphones", label: "Smartphones", detail: "Stay connected", icon: "◫", color: "#f4e8ff" },
  { value: "laptops", label: "Laptops", detail: "Work and create", icon: "▱", color: "#e5f9f2" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("featured");
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

  const sortedProducts = useMemo(() => {
    const nextProducts = [...products];
    if (sort === "price-low") return nextProducts.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-high") return nextProducts.sort((a, b) => Number(b.price) - Number(a.price));
    return nextProducts;
  }, [products, sort]);

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

  const goToCollection = (nextCategory = "") => {
    setCategory(nextCategory);
    document.getElementById("products")?.scrollIntoView();
  };

  const heroProduct = products[0];
  const secondHeroProduct = products[1];

  return (
    <div>
      <section className="relative overflow-hidden bg-[#fff8f3] px-5 py-14 sm:py-20 lg:py-24">
        <div className="hero-orb absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#ffcf5a]/35" />
        <div className="hero-orb absolute -right-20 -top-24 h-[420px] w-[420px] rounded-full bg-[#cfc8ff]/55" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ff5b57]/20 bg-white px-3.5 py-2 text-xs font-bold text-[#e94743] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#ff5b57]" /> NEW FINDS ADDED WEEKLY
            </div>
            <h1 className="display-title max-w-3xl text-[clamp(3rem,6.5vw,6.3rem)]">
              Better things for <span className="gradient-text">every day.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-[#66708f] sm:text-lg sm:leading-8">
              A thoughtfully selected store for useful tech, daily essentials, and the little upgrades that make life easier.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => goToCollection()} className="store-button bg-[#5368ef] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#4358dc]">Shop the collection <span className="ml-2">→</span></button>
              <button onClick={() => document.getElementById("categories")?.scrollIntoView()} className="store-button border border-[#dfe2ed] bg-white px-6 py-4 text-sm font-bold text-[#19203a] transition hover:-translate-y-0.5 hover:border-[#5368ef]">Browse categories</button>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs font-semibold text-[#66708f]">
              <span className="flex items-center gap-2"><b className="grid h-5 w-5 place-items-center rounded-full bg-[#e5f9f2] text-[#25856a]">✓</b> Easy checkout</span>
              <span className="flex items-center gap-2"><b className="grid h-5 w-5 place-items-center rounded-full bg-[#e9edff] text-[#5368ef]">✓</b> Clear pricing</span>
              <span className="flex items-center gap-2"><b className="grid h-5 w-5 place-items-center rounded-full bg-[#fff0d6] text-[#b77700]">✓</b> Cash on delivery</span>
            </div>
          </div>

          <div className="soft-grid relative min-h-[430px] rounded-[32px] border border-[#dfe2ed] bg-white/70 p-6 shadow-[0_35px_80px_-45px_rgba(83,104,239,0.55)] sm:min-h-[520px] sm:p-9">
            <div className="absolute left-5 top-5 rounded-full bg-[#ffcf5a] px-4 py-2 text-xs font-extrabold text-[#19203a] shadow-sm sm:left-8 sm:top-8">THIS WEEK&rsquo;S FAVORITES</div>
            <div className="absolute right-7 top-20 w-[62%] rotate-3 overflow-hidden rounded-[24px] border-[6px] border-white bg-[#f1f3fb] shadow-2xl sm:right-12 sm:top-24">
              {heroProduct?.image ? <img src={heroProduct.image} alt={heroProduct.title} className="aspect-[4/5] w-full object-cover" /> : <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-[#ffd1ce] via-[#eadbff] to-[#cbd5ff]"><span className="text-center text-3xl font-black text-white/90">NEW<br />GOODS</span></div>}
              <div className="absolute inset-x-0 bottom-0 bg-white/92 p-4 backdrop-blur"><p className="truncate text-sm font-bold">{heroProduct?.title || "The everyday edit"}</p><p className="mt-1 text-xs font-semibold text-[#5368ef]">{heroProduct ? `$${Number(heroProduct.price).toFixed(2)}` : "Fresh arrivals"}</p></div>
            </div>
            <div className="absolute bottom-9 left-5 w-[45%] -rotate-6 overflow-hidden rounded-[20px] border-[5px] border-white bg-[#eefaf6] shadow-xl sm:bottom-12 sm:left-10">
              {secondHeroProduct?.image ? <img src={secondHeroProduct.image} alt={secondHeroProduct.title} className="aspect-square w-full object-cover" /> : <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-[#a7ead2] to-[#8aa4ff]"><span className="text-5xl text-white">✦</span></div>}
            </div>
            <div className="absolute bottom-6 right-3 rounded-2xl bg-[#a74de8] px-4 py-3 text-white shadow-lg sm:bottom-10 sm:right-7"><p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Curated for you</p><p className="mt-1 text-sm font-extrabold">Good picks, less noise.</p></div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e4e7f0] bg-white px-5 py-5">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 text-center sm:grid-cols-4">
          {[['100%', 'clear prices'], ['4', 'easy categories'], ['Secure', 'account access'], ['Simple', 'cash on delivery']].map(([value, label]) => (
            <div key={label} className="border-r border-[#e4e7f0] last:border-0"><p className="text-lg font-extrabold text-[#19203a]">{value}</p><p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8991a8]">{label}</p></div>
          ))}
        </div>
      </section>

      <section id="categories" className="scroll-mt-28 px-5 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="section-kicker">// Shop by category</p><h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">Start with what you need.</h2></div>
            <button onClick={() => goToCollection()} className="w-fit text-sm font-bold text-[#5368ef] hover:text-[#e94743]">View everything →</button>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryItems.map((item) => (
              <button key={item.value} onClick={() => goToCollection(item.value)} className="group store-card flex min-h-52 flex-col items-start p-5 text-left transition hover:-translate-y-1 hover:border-[#5368ef]/40 hover:shadow-[0_22px_50px_-32px_rgba(83,104,239,0.65)]">
                <span className="grid h-14 w-14 place-items-center rounded-2xl text-2xl font-black text-[#19203a]" style={{ backgroundColor: item.color }}>{item.icon}</span>
                <span className="mt-auto text-xl font-extrabold tracking-[-0.025em]">{item.label}</span>
                <span className="mt-1 flex w-full items-center justify-between text-xs font-semibold text-[#8991a8]">{item.detail}<b className="text-lg text-[#5368ef] transition group-hover:translate-x-1">→</b></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-28 bg-[#f6f7fb] px-5 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div><p className="section-kicker">// Our products</p><h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">Picked for real life.</h2><p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[#66708f]">Browse the full collection, search by name, or narrow it down to exactly what you came for.</p></div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <label className="relative block sm:w-72"><span className="sr-only">Search products</span><svg viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8991a8]" stroke="currentColor" strokeWidth="1.9"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input type="search" placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl border border-[#dfe2ed] bg-white py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition focus:border-[#5368ef]" /></label>
              <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products" className="rounded-xl border border-[#dfe2ed] bg-white px-4 py-3.5 text-sm font-bold outline-none focus:border-[#5368ef]"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            <button onClick={() => setCategory("")} className={`rounded-full px-4 py-2 text-xs font-bold transition ${category === "" ? "bg-[#19203a] text-white" : "border border-[#dfe2ed] bg-white text-[#66708f] hover:border-[#5368ef]"}`}>All products</button>
            {categoryItems.map((item) => <button key={item.value} onClick={() => setCategory(item.value)} className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${category === item.value ? "bg-[#5368ef] text-white" : "border border-[#dfe2ed] bg-white text-[#66708f] hover:border-[#5368ef]"}`}>{item.value}</button>)}
          </div>

          {loading ? (
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="store-card overflow-hidden p-3"><div className="aspect-[4/5] animate-pulse rounded-2xl bg-[#e9ebf3]" /><div className="mx-2 mt-5 h-5 animate-pulse rounded bg-[#e9ebf3]" /><div className="mx-2 mb-3 mt-3 h-4 w-1/3 animate-pulse rounded bg-[#e9ebf3]" /></div>)}</div>
          ) : error ? (
            <div className="store-card mt-9 border-[#ff5b57]/20 bg-[#fff5f4] p-12 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#ffe1df] text-xl">!</div><p className="mt-4 font-bold text-[#e94743]">{error}</p><button onClick={loadProducts} className="store-button mt-5 bg-[#5368ef] px-5 py-3 text-sm font-bold text-white">Try again</button></div>
          ) : sortedProducts.length === 0 ? (
            <div className="store-card mt-9 p-14 text-center"><h3 className="text-xl font-extrabold">No products found</h3><p className="mt-2 text-sm text-[#66708f]">Try a different search or category.</p><button onClick={() => { setSearch(""); setCategory(""); }} className="mt-5 text-sm font-bold text-[#5368ef]">Clear filters</button></div>
          ) : (
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product, index) => (
                <article key={product._id} className="product-card store-card group flex flex-col overflow-hidden p-3">
                  <Link to={`/product/${product._id}`} className="relative block overflow-hidden rounded-2xl bg-[#eef0f7]">
                    {product.image ? <img src={product.image} alt={product.title} className="product-image aspect-[4/5] w-full object-cover" /> : <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-br from-[#ffd8d5] via-[#eadbff] to-[#cdd7ff] text-6xl font-black text-white/80">{product.title?.charAt(0)}</div>}
                    {index % 4 === 0 && <span className="absolute left-3 top-3 rounded-full bg-[#ffcf5a] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#19203a]">Best pick</span>}
                    <span className={`absolute right-3 top-3 h-2.5 w-2.5 rounded-full ring-4 ring-white/80 ${product.stock > 0 ? "bg-[#46cda0]" : "bg-[#ff5b57]"}`} title={product.stock > 0 ? "In stock" : "Out of stock"} />
                  </Link>
                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8991a8]">{product.category || "Everyday"}</p>
                    <Link to={`/product/${product._id}`}><h3 className="mt-1.5 line-clamp-2 text-base font-extrabold leading-snug tracking-[-0.02em] transition group-hover:text-[#5368ef]">{product.title}</h3></Link>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-4"><div><p className="text-lg font-extrabold">${Number(product.price).toFixed(2)}</p><p className="mt-0.5 text-[10px] font-semibold text-[#8991a8]">{product.stock > 0 ? `${product.stock} ready to ship` : "Currently unavailable"}</p></div><button onClick={() => addToCart(product._id)} disabled={product.stock <= 0} aria-label={`Add ${product.title} to cart`} className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl font-bold transition disabled:cursor-not-allowed disabled:bg-[#e9ebf3] disabled:text-[#a7adbd] ${addedId === product._id ? "bg-[#46b68f] text-white" : "bg-[#19203a] text-white hover:bg-[#5368ef]"}`}>{addedId === product._id ? "✓" : "+"}</button></div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[28px] bg-gradient-to-r from-[#5368ef] via-[#7958e6] to-[#a74de8] p-7 text-white sm:p-12">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/65">Shopping, simplified</p>
            <div className="mt-4 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><h2 className="text-3xl font-extrabold tracking-[-0.045em] sm:text-5xl">Find it. Add it.<br />It&rsquo;s yours.</h2><div className="grid gap-4 sm:grid-cols-3">{[["01", "Browse", "Search a focused collection."], ["02", "Choose", "Clear prices and stock."], ["03", "Checkout", "A short, simple flow."]].map(([number, title, detail]) => <div key={number} className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur"><p className="text-xs font-black text-[#ffdf87]">{number}</p><h3 className="mt-5 font-extrabold">{title}</h3><p className="mt-1 text-xs leading-5 text-white/65">{detail}</p></div>)}</div></div>
          </div>
        </div>
      </section>
    </div>
  );
}
