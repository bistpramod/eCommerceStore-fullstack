import React, { useEffect, useState } from 'react' // FIXED: imported useState and useEffect
import api from "../api/Axios"
import { useParams } from 'react-router-dom'

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const loadProduct = async () => {
    try {
      const response = await api.get('/products/');

      // FIXED: backend sends products inside response.data.data
      const productItem = response.data.data.find((item) => item._id === id);

      setProduct(productItem);

    } catch (error) {
      console.error("An error occured", error); // FIXED: added error handling
    }
  }

  useEffect(() => {
    loadProduct();

  }, []);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl font-semibold">
        Loading ...
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">

        <div className="mx-auto grid max-w-5xl gap-8 rounded-xl bg-white p-6 shadow-lg md:grid-cols-2">

          <img
            src={product.image}
            alt={product.title}
            className="h-96 w-full rounded-lg object-cover"
          />

          <div className="flex flex-col justify-center">

            <h1 className="mb-4 text-3xl font-bold text-gray-800">
              {product.title}
            </h1>

            <p className="mb-4 text-gray-600">
              {product.description}
            </p>

            <p className="mb-6 text-2xl font-bold text-green-600">
              ${product.price}
            </p>

            <button
              onClick={() => addToCart(product._id)}
              className="mx-4 mb-4 w-[calc(100%-2rem)] rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Add to Cart
            </button>

          </div>

        </div>

      </div>
    </>
  )
}