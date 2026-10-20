import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios";

const categoryItems = [
  { value: "fruits", label: "Fresh picks", detail: "Everyday pantry and produce" },
  { value: "electronics", label: "Electronics", detail: "Practical technology" },
  { value: "smartphones", label: "Smartphones", detail: "Devices and essentials" },
  { value: "laptops", label: "Laptops", detail: "Tools for work and study" },
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

  return (
    <div>
      <section className="border-b border-[#deddd6] px-5 py-10 sm:py-14 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
          <div className="flex flex-col justify-center py-5 lg:pr-10">
            <p className="section-kicker">The everyday collection</p>
            <h1 className="display-title mt-5 max-w-2xl text-[clamp(3.25rem,7vw,6.8rem)]">
              Well chosen.<br />Simply sold.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#66675f]">
              Useful products with clear prices, honest stock information, and a checkout that stays out of your way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => goToCollection()} className="store-button bg-[#171813] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#6f7655]">Shop all products</button>
              <button onClick={() => document.getElementById("categories")?.scrollIntoView()} className="store-button border border-[#cfcec6] bg-transparent px-6 py-3.5 text-sm font-medium transition hover:border-[#171813]">Browse categories</button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[#deddd6] pt-5 text-xs text-[#74756d]">
              <span>Clear pricing</span><span>Secure account</span><span>Cash on delivery</span>
            </div>
          </div>

          <Link to={heroProduct ? `/product/${heroProduct._id}` : "/#products"} className="group relative min-h-[430px] overflow-hidden bg-[#e9e8e2] sm:min-h-[560px]">
            {heroProduct?.image ? (
              <img src={heroProduct.image} alt={heroProduct.title} className="h-full min-h-[430px] w-full object-cover transition duration-700 group-hover:scale-[1.02] sm:min-h-[560px]" />
            ) : (
              <div className="flex h-full min-h-[430px] items-center justify-center bg-[#deddd6] text-center text-4xl font-semibold tracking-[-0.05em] text-[#aaa99f] sm:min-h-[560px]">The new<br />collection</div>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-6 pt-24 text-white sm:p-8">
              <div><p className="text-[10px] uppercase tracking-[0.18em] text-white/65">Featured</p><h2 className="mt-2 text-2xl font-medium tracking-[-0.03em]">{heroProduct?.title || "Everyday essentials"}</h2></div>
              <p className="shrink-0 text-lg font-medium">{heroProduct ? `$${Number(heroProduct.price).toFixed(2)}` : "View collection"}</p>
            </div>
          </Link>
        </div>
      </section>

      <section id="categories" className="scroll-mt-28 border-b border-[#deddd6] px-5 py-14 lg:py-18">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="section-kicker">Departments</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Shop by category</h2></div>
            <button onClick={() => goToCollection()} className="w-fit text-sm text-[#66675f] underline decoration-[#b8b8af] underline-offset-4 hover:text-[#171813]">View everything</button>
          </div>
          <div className="mt-8 grid border-l border-t border-[#deddd6] sm:grid-cols-2 lg:grid-cols-4">
            {categoryItems.map((item, index) => (
              <button key={item.value} onClick={() => goToCollection(item.value)} className="group min-h-44 border-b border-r border-[#deddd6] bg-[#f7f6f2] p-6 text-left transition hover:bg-[#efeee8]">
                <span className="text-[10px] font-medium text-[#92938a]">0{index + 1}</span>
                <span className="mt-12 block text-lg font-medium">{item.label}</span>
                <span className="mt-1 flex items-center justify-between text-xs text-[#787970]">{item.detail}<b className="font-normal transition group-hover:translate-x-1">→</b></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-28 px-5 py-14 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div><p className="section-kicker">The collection</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Products for real life</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#717269]">Search the catalogue or narrow the selection by department.</p></div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <label className="relative block sm:w-72"><span className="sr-only">Search products</span><svg viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8d8e85]" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input type="search" placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full border border-[#cfcec6] bg-[#f7f6f2] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#171813]" /></label>
              <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products" className="border border-[#cfcec6] bg-[#f7f6f2] px-4 py-3 text-sm outline-none focus:border-[#171813]"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-y border-[#deddd6] py-4">
            <button onClick={() => setCategory("")} className={`text-xs transition ${category === "" ? "font-semibold text-[#171813]" : "text-[#77786f] hover:text-[#171813]"}`}>All products</button>
            {categoryItems.map((item) => <button key={item.value} onClick={() => setCategory(item.value)} className={`text-xs capitalize transition ${category === item.value ? "font-semibold text-[#171813]" : "text-[#77786f] hover:text-[#171813]"}`}>{item.value}</button>)}
          </div>

          {loading ? (
            <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item}><div className="aspect-[4/5] animate-pulse bg-[#e7e6df]" /><div className="mt-4 h-4 animate-pulse bg-[#e7e6df]" /><div className="mt-3 h-3 w-1/3 animate-pulse bg-[#e7e6df]" /></div>)}</div>
          ) : error ? (
            <div className="mt-8 border border-[#d9cbc7] bg-[#f4ece9] p-12 text-center"><p className="font-medium text-[#754f43]">{error}</p><button onClick={loadProducts} className="store-button mt-5 bg-[#171813] px-5 py-3 text-sm text-white">Try again</button></div>
          ) : sortedProducts.length === 0 ? (
            <div className="mt-8 border border-[#deddd6] p-14 text-center"><h3 className="text-xl font-medium">No products found</h3><p className="mt-2 text-sm text-[#717269]">Try a different search or category.</p><button onClick={() => { setSearch(""); setCategory(""); }} className="mt-5 text-sm underline underline-offset-4">Clear filters</button></div>
          ) : (
            <div className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product) => (
                <article key={product._id} className="product-card group flex min-w-0 flex-col">
                  <Link to={`/product/${product._id}`} className="relative block overflow-hidden bg-[#e9e8e2]">
                    {product.image ? <img src={product.image} alt={product.title} className="product-image aspect-[4/5] w-full object-cover" /> : <div className="flex aspect-[4/5] items-center justify-center bg-[#e5e4dd] text-5xl font-medium text-[#b0afa6]">{product.title?.charAt(0)}</div>}
                    <span className={`absolute right-3 top-3 rounded-full border border-white/70 px-2.5 py-1 text-[9px] uppercase tracking-wider backdrop-blur ${product.stock > 0 ? "bg-white/85 text-[#4f5940]" : "bg-[#272823]/85 text-white"}`}>{product.stock > 0 ? "In stock" : "Sold out"}</span>
                  </Link>
                  <div className="flex flex-1 flex-col pt-4">
                    <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#8a8b82]">{product.category || "Everyday"}</p>
                    <Link to={`/product/${product._id}`}><h3 className="mt-1.5 line-clamp-2 text-base font-medium leading-snug tracking-[-0.02em] group-hover:underline group-hover:underline-offset-4">{product.title}</h3></Link>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-4"><p className="text-sm font-medium">${Number(product.price).toFixed(2)}</p><button onClick={() => addToCart(product._id)} disabled={product.stock <= 0} className={`border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:border-[#deddd6] disabled:text-[#aaa99f] ${addedId === product._id ? "border-[#6f7655] bg-[#6f7655] text-white" : "border-[#bdbdb4] hover:border-[#171813]"}`}>{addedId === product._id ? "Added" : "Add to cart"}</button></div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-[#deddd6] bg-[#171813] px-5 py-14 text-white lg:py-18">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end"><div><p className="text-[10px] uppercase tracking-[0.18em] text-white/50">Our promise</p><h2 className="mt-4 text-3xl font-medium tracking-[-0.04em] sm:text-5xl">Less noise.<br />Better choices.</h2></div><div className="grid gap-px bg-white/15 sm:grid-cols-3">{[["01", "Browse", "A focused, searchable collection."], ["02", "Choose", "Clear prices and current stock."], ["03", "Checkout", "A short, familiar purchase flow."]].map(([number, title, detail]) => <div key={number} className="bg-[#171813] p-5"><p className="text-xs text-white/35">{number}</p><h3 className="mt-8 font-medium">{title}</h3><p className="mt-2 text-xs leading-5 text-white/55">{detail}</p></div>)}</div></div>
      </section>
    </div>
  );
}
