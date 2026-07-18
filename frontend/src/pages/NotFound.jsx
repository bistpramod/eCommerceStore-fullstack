import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

      <div className="text-center">

        <h1 className="text-8xl font-bold text-gray-800">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-semibold text-gray-700">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-500">
          Sorry, the page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Browse Other Products
        </Link>

      </div>

    </div>
  );
}