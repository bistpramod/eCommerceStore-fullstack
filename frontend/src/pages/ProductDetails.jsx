import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/Axios";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/products")
      .then((response) => {
        const productItem = response.data.data.find((item) => item._id === id);
        setProduct(productItem || null);
      })
      .catch((error) => {
        console.error("An error occurred", error);
        setError("We could not load this product.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);
      setError("");

      for (let i = 0; i < quantity; i++) {
        await api.post("/cart/add", {
          userId,
          productId: product._id,
        });
      }

      setAdded(true);
      window.dispatchEvent(new Event("cartUpdated"));
      setTimeout(() => setAdded(false), 1800);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto grid min-h-[70vh] max-w-7xl animate-pulse gap-10 px-5 py-12 lg:grid-cols-2 lg:px-8">
        <div className="min-h-96 rounded-[2rem] bg-[#243029]/10" />
        <div className="space-y-5 py-10">
          <div className="h-5 w-24 rounded-full bg-[#243029]/10" />
          <div className="h-14 rounded-full bg-[#243029]/10" />
          <div className="h-24 rounded-3xl bg-[#243029]/10" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5 text-center">
        <div>
          <p className="text-6xl font-bold text-[#243029]/10">?</p>
          <h1 className="mt-4 text-3xl font-bold">Product not found</h1>
          <p className="mt-2 text-[#243029]/50">{error || "This product may no longer be available."}</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-[#243029] px-6 py-3 text-sm font-semibold text-white">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-8 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <Link to="/" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#243029]/55 transition hover:text-[#243029]">
          <span>←</span> Back to shop
        </Link>

        <div className="grid overflow-hidden rounded-[2rem] bg-[#fbfaf7] lg:grid-cols-2">
          <div className="flex min-h-[420px] items-center justify-center bg-[#e8e8e1] lg:min-h-[620px]">
            {product.image ? (
              <img src={product.image} alt={product.title} className="h-full max-h-[620px] w-full object-cover" />
            ) : (
              <p className="text-8xl font-bold text-[#243029]/10">{product.title?.charAt(0)}</p>
            )}
          </div>

          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#dfe5dc] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
                {product.category || "Everyday"}
              </span>
              <span className={`text-xs font-semibold ${product.stock > 0 ? "text-[#607861]" : "text-[#a65f46]"}`}>
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-[-0.05em] sm:text-5xl">
              {product.title}
            </h1>
            <p className="mt-5 text-3xl font-bold">${Number(product.price).toFixed(2)}</p>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#243029]/55">
              {product.description || "A thoughtfully selected product made for everyday use."}
            </p>

            <div className="mt-9 border-y border-[#243029]/10 py-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Quantity</p>
                <div className="flex items-center rounded-full border border-[#243029]/15 bg-[#f4f2ed] p-1">
                  <button
                    onClick={() => setQuantity((number) => Math.max(1, number - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition hover:bg-[#fbfaf7]"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((number) => Math.min(product.stock, number + 1))}
                    disabled={quantity >= product.stock}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition hover:bg-[#fbfaf7] disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p className="mt-5 rounded-2xl bg-[#f3e7e2] px-4 py-3 text-sm font-medium text-[#8e4b39]">{error}</p>
            )}

            <button
              onClick={addToCart}
              disabled={adding || product.stock <= 0}
              className={`mt-7 w-full rounded-full py-4 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:bg-[#243029]/20 ${added ? "bg-[#607861]" : "bg-[#243029] hover:bg-[#a65f46]"}`}
            >
              {adding ? "Adding..." : added ? "Added to cart" : product.stock <= 0 ? "Out of stock" : `Add to cart · $${(product.price * quantity).toFixed(2)}`}
            </button>

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-semibold text-[#243029]/45">
              <p>✓ Secure checkout</p>
              <p>✓ Cash on delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
