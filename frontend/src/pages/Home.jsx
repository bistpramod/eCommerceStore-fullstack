import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedId, setAddedId] = useState("");

  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products", {
        params: { search, category },
      });

      setProducts(response.data.data || []);
    } catch (error) {
      console.error("An error occurred:", error);
      setError("We could not load the products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products", {
          params: { search, category },
        });

        setProducts(response.data.data || []);
      } catch (error) {
        console.error("An error occurred:", error);
        setError("We could not load the products. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart/add", {
        userId,
        productId,
      });

      setAddedId(productId);
      window.dispatchEvent(new Event("cartUpdated"));

      setTimeout(() => {
        setAddedId("");
      }, 1500);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView();
  };

  return (
    <div>
      <section className="px-5 pb-14 pt-8 lg:px-8 lg:pb-20 lg:pt-12">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#dfe5dc] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center px-7 py-14 sm:px-12 lg:px-16 lg:py-20">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#243029]/50">
              The everyday edit
            </p>
            <h1 className="max-w-2xl text-5xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Good things for real life.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#243029]/60 sm:text-lg">
              Useful, thoughtful, and easy to love. Discover products chosen to make your day a little better.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                onClick={scrollToProducts}
                className="rounded-full bg-[#243029] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#a65f46]"
              >
                Shop the collection
              </button>
              <p className="text-sm font-medium text-[#243029]/50">Simple shopping. No noise.</p>
            </div>
          </div>

          <div className="relative min-h-72 overflow-hidden bg-[#c8d2c4] lg:min-h-[520px]">
            <div className="absolute -right-14 top-14 h-64 w-64 rounded-full bg-[#d6bd83] sm:h-80 sm:w-80" />
            <div className="absolute bottom-[-70px] left-[-20px] h-72 w-72 rotate-12 rounded-[4rem] bg-[#a65f46]" />
            <div className="absolute left-[44%] top-[42%] h-52 w-40 -rotate-12 rounded-[5rem_5rem_2rem_2rem] border-[18px] border-[#243029] bg-[#f4f2ed] shadow-2xl" />
            <div className="absolute bottom-8 right-8 rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur">
              Fresh picks
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-24 px-5 pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#a65f46]">Shop all</p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Find your next favorite</h2>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <label className="relative block sm:w-72">
                <svg viewBox="0 0 24 24" fill="none" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#243029]/40" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-[#243029]/10 bg-[#fbfaf7] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#243029]/40"
                />
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-full border border-[#243029]/10 bg-[#fbfaf7] px-5 py-3 text-sm font-medium outline-none transition focus:border-[#243029]/40"
              >
                <option value="">All categories</option>
                <option value="fruits">Fruits</option>
                <option value="electronics">Electronics</option>
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="overflow-hidden rounded-3xl bg-[#fbfaf7]">
                  <div className="aspect-[4/3] animate-pulse bg-[#243029]/10" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 animate-pulse rounded-full bg-[#243029]/10" />
                    <div className="h-5 w-1/3 animate-pulse rounded-full bg-[#243029]/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-[#a65f46]/20 bg-[#f3e7e2] p-10 text-center">
              <p className="font-semibold text-[#8e4b39]">{error}</p>
              <button onClick={loadProducts} className="mt-5 rounded-full bg-[#243029] px-5 py-2.5 text-sm font-semibold text-white">
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-[#243029]/10 bg-[#fbfaf7] p-12 text-center">
              <p className="text-4xl">○</p>
              <h3 className="mt-4 text-xl font-bold">Nothing matched your search</h3>
              <p className="mt-2 text-sm text-[#243029]/50">Try another word or clear the category filter.</p>
              <button
                onClick={() => { setSearch(""); setCategory(""); }}
                className="mt-5 text-sm font-bold underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <article key={product._id} className="group">
                  <Link to={`/product/${product._id}`} className="relative block overflow-hidden rounded-3xl bg-[#e8e8e1]">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-[#e5e5dc] text-5xl font-bold text-[#243029]/15">
                        {product.title?.charAt(0)}
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
                      {product.category || "Everyday"}
                    </span>
                  </Link>

                  <div className="flex items-start justify-between gap-4 px-1 pt-4">
                    <div className="min-w-0">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="truncate text-lg font-bold tracking-tight transition group-hover:text-[#a65f46]">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="mt-1 text-sm text-[#243029]/50">
                        {product.stock > 0 ? `${product.stock} available` : "Currently unavailable"}
                      </p>
                    </div>
                    <p className="shrink-0 text-lg font-bold">${Number(product.price).toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => addToCart(product._id)}
                    disabled={product.stock <= 0}
                    className={`mt-4 w-full rounded-full py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-[#243029]/10 disabled:text-[#243029]/35 ${addedId === product._id ? "bg-[#607861] text-white" : "border border-[#243029]/15 bg-[#fbfaf7] hover:border-[#243029] hover:bg-[#243029] hover:text-white"}`}
                  >
                    {product.stock <= 0 ? "Out of stock" : addedId === product._id ? "Added to cart" : "Add to cart"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#d6bd83] px-5 py-5 text-center text-sm font-bold tracking-wide lg:px-8">
        Careful picks · Clear prices · Easy checkout · Cash on delivery
      </section>
    </div>
  );
}
