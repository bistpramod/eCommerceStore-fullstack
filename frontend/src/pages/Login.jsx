import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // FIX: changed from 'react-router' and removed unused Navigate import
import api from '../api/Axios.jsx'


// FIX: added component name
export default function Login() {

  // FIX: changed usestate -> useState
  // FIX: changed name -> email because your input uses form.email
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  // FIX: changed usestate -> useState
  const [msg, setMsg] = useState("")

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    // FIX: changed preventDefualt() -> preventDefault()
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', form)

      console.log(response, "data")

      //* save tokens to local storage
      localStorage.setItem("token", response.data.token);

      setMsg("login Successful")

      //* redirect to the landing page only after 1 sec
      setTimeout(() => {
        navigate('/')
      }, 1000)

    } catch (error) {
      setMsg(error.response?.data?.message || "An error occured")
    }
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

          <h2 className="mb-2 text-center text-3xl font-bold text-gray-800">
            Log in
          </h2>

          <p className="mb-6 text-center text-sm text-gray-500">
            Log in to continue
          </p>

          {/* Message this is the alert message from backend that tells to user login succes or already esists */}
          {msg && (
            <div className="mb-4 rounded-md bg-blue-50 p-3 text-center text-sm font-medium text-blue-600">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Log in
            </button>

          </form>
        </div>
      </div>
    </>
  )
}