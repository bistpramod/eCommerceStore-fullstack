function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          My App
        </h1>

        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">
            Welcome 👋
          </h2>

          <p className="text-gray-600 mb-6">
            You have successfully logged in.
          </p>

          <div className="space-y-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="font-medium">Name</p>
              <p className="text-gray-500">John Doe</p>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="font-medium">Email</p>
              <p className="text-gray-500">
                johndoe@example.com
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;