import React, { useEffect, useState } from 'react'
import api from "../api/Axios"
import { useParams } from 'react-router-dom'

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const loadProduct = async () => {
    try {
      const response = await api.get('/products/');

      // backend sends products inside response.data.data
      const productItem = response.data.data.find((item) => item._id === id);

      setProduct(productItem);

    } catch (error) {
      console.error("An error occured", error);
    }
  }

  useEffect(() => {
    loadProduct();
  }, []);

  // FIX: this function didn't exist before, so the button did nothing
  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("Please log in to add items to your cart.");
      return;
    }

    setAdding(true);
    setError("");

    try {
      await api.post("/cart/add", {
        userId,
        productId,
        quantity,
      });

      setAdded(true);
      // reset the "Added" confirmation after a couple seconds
      setTimeout(() => setAdded(false), 2000);

    } catch (err) {
      console.error("Failed to add item to cart:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold text-gray-500">
        Loading ...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="mx-auto grid max-w-5xl gap-10 rounded-2xl bg-white p-8 shadow-md md:grid-cols-2">

        <div className="overflow-hidden rounded-xl bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="h-96 w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="flex flex-col justify-center">

          <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900">
            {product.title}
          </h1>

          <p className="mb-6 leading-relaxed text-gray-600">
            {product.description}
          </p>

          <p className="mb-6 text-3xl font-bold text-green-600">
            ${product.price}
          </p>

          {/* Quantity selector */}
          <div className="mb-6 flex items-center gap-4">
            <span className="font-medium text-gray-700">Quantity</span>
            <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-lg font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 text-lg font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={() => addToCart(product._id)}
            disabled={adding}
            className={`w-full rounded-lg py-3 font-medium text-white shadow-sm transition
              ${added
                ? "bg-green-600 hover:bg-green-600"
                : "bg-blue-600 hover:bg-blue-700"}
              ${adding ? "cursor-not-allowed opacity-70" : ""}
            `}
          >
            {adding ? "Adding..." : added ? "Added to Cart ✓" : "Add to Cart"}
          </button>

        </div>

      </div>

    </div>
  )
}