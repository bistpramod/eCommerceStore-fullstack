import { useEffect, useState } from "react";

import api from "../api/Axios"
import { Link } from "react-router-dom"

export default function Home() {
  const [products, setProducts] = useState([]); // its array destructuring
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")

  const loadProducts = async () => {
    try {
      const response = await api.get(`/products?search=${search}&category=${category}`);

      // FIXED: your backend sends the products inside response.data.data
      setProducts(response.data.data);

    }
    catch (error) {
      console.error("An error occured", error)
    }

  }

  useEffect(() => {
    loadProducts();

  }, [search, category]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">

        {/* search  */}
        <div className="mx-auto mb-8 flex max-w-5xl flex-col gap-4 md:flex-row">

          <input
            placeholder="Search Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm outline-none focus:border-blue-500"
          />

          {/* category filer / */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-sm outline-none focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="electronics">Electronics</option>
            <option value="smartphones">Smartphones</option>
            <option value="Laptops">Laptops</option>
          </select>
        </div>

        {/* product grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="overflow-hidden rounded-xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

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
          ))}
        </div>
      </div>
    </>
  );
}



// export default Home;