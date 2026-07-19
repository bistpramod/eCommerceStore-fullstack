import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/Axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const loadProducts = async () => {
    try {
      const response = await api.get(
        `/products?search=${search}&category=${category}`
      );

      setProducts(response.data.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    loadProducts();
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

      const count = response.data.data.cart.items.reduce(
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
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Search and Category Filter */}
      <div className="mx-auto mb-8 flex max-w-5xl flex-col gap-4 md:flex-row">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm outline-none focus:border-blue-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm outline-none focus:border-blue-500"
        >
          <option value="">All Categories</option>
          <option value="fruits">Fruits</option>
          <option value="electronics">Electronics</option>
          <option value="smartphones">Smartphones</option>
          <option value="laptops">Laptops</option>
        </select>

      </div>

      {/* Product Grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {products.map((product) => (
          <div
            key={product._id}
            className="overflow-hidden rounded-xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >

            <Link to={`/product/${product._id}`}>

              <img
                src={product.image}
                alt={product.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-4">

                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                  {product.title}
                </h2>

                <p className="text-xl font-bold text-green-600">
                  ${product.price}
                </p>

              </div>

            </Link>

            <button
              onClick={() => addToCart(product._id)}
              className="mx-4 mb-4 w-[calc(100%-2rem)] rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Add to Cart
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}