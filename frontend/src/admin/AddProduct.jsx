import React from "react";
import { useState } from "react";
import api from "../api/Axios";
import { useNavigate } from "react-router-dom";


export function AddProduct() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: ""
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...Form,
            [e.target.name]: e.target.value
        })

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/products/add', form);
            alert("product added successfully ")
            navigate("/admin/products")
        }
        catch (error) {
            console.log("an error occured while adding the product", error)

        }
    }
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

                <h2 className="mb-2 text-center text-3xl font-bold text-gray-800">
                    Add Product
                </h2>

                <p className="mb-6 text-center text-sm text-gray-500">
                    Fill in the product details
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {Object.keys(form).map((key) => (
                        <input
                            key={key}
                            name={key}
                            value={form[key]}
                            onChange={handleChange}
                            placeholder={key}
                            className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-4
                            py-3
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-200
                        "
                        />
                    ))}

                    <button
                        type="submit"
                        className="
                        w-full
                        rounded-lg
                        bg-blue-600
                        py-3
                        font-medium
                        text-white
                        transition
                        hover:bg-blue-700
                    "
                    >
                        Add Product
                    </button>

                </form>
            </div>
        </div>
    );

}