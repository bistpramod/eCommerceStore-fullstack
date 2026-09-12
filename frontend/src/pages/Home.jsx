import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/Axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/products?search=${search}&category=${category}`
      );

      setProducts(response.data.data || []);
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  // Small delay so the backend is not called on every key press
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please log in to add items to your cart");
      return;
    }

    try {
      const response = await api.post("/cart/add", {
        userId,
        productId,
      });

      const count = response.data.cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      localStorage.setItem("cartCount", count);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">

      <div className="mx-auto mb-10 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Explore Products
          </h1>

          <p className="mt-2 text-gray-500">
            Find something you like and add it to your cart.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
          >
            <option value="">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="electronics">Electronics</option>
            <option value="smartphones">Smartphones</option>
            <option value="laptops">Laptops</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="h-56 animate-pulse bg-gray-200" />
              <div className="space-y-3 p-5">
                <div className="h-5 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
                <div className="h-10 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            No products found
          </h2>
          <p className="mt-2 text-gray-500">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Link to={`/product/${product._id}`}>
                <div className="overflow-hidden bg-gray-100">
                  <img
                    src={product.image || "https://via.placeholder.com/500"}
                    alt={product.title}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <h2 className="truncate text-lg font-semibold text-gray-800">
                    {product.title}
                  </h2>

                  <p className="mt-2 text-xl font-bold text-green-600">
                    ${product.price}
                  </p>
                </div>
              </Link>

              <div className="px-5 pb-5">
                <button
                  onClick={() => addToCart(product._id)}
                  disabled={product.stock <= 0}
                  className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
