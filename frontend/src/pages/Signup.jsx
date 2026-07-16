import React from 'react'
import { useState } from 'react'
import api from '../api/Axios'
const Signup = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""

    })
    const [msg, setMsg] = useState("")
    const handleChange = async (e) => {
        setForm(
            {
                ...form,
                [e.target.name]: e.target.value //* its like email:email@gmail.com
            }
        )

    }
    const handleSubmit = async (e) => {
        e.preventDefault() // prevents the site from reloading when submitting
        try {
            const response = await api.post("/auth/signup", form)
            setMsg(response.data.message)
        }
        catch (error) {
            setMsg(error.response?.data?.message || "something went wrong") // ?. is optional chaining without ? js may crash if response is not available
        }
    }
    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
  <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
    <h2 className="mb-2 text-center text-3xl font-bold text-gray-800">
      Create Account
    </h2>

    <p className="mb-6 text-center text-sm text-gray-500">
      Sign up to continue
    </p>

    {/* Message this is the alert message from backend that tells to user login succes or already esists*/} 
    {msg && (
      <div className="mb-4 rounded-md bg-blue-50 p-3 text-center text-sm font-medium text-blue-600">  
        {msg} 
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        value={form.name}
        onChange={handleChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        required
      />

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
        Sign Up
      </button>
    </form>
  </div>
</div>

        </>
    )
}


export default Signup