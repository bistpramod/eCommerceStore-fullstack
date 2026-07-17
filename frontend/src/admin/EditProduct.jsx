import { useEffect, useState } from "react";

import api from "../api/Axios";

import { useNavigate, useParams } from "react-router-dom";


export default function EditProduct() {

    // Get product id from URL
    // Example: /admin/products/edit/5
    // id will be "5"
    const { id } = useParams();


    // Used to redirect after updating product
    const navigate = useNavigate();


    // Stores product information inside the form
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
    });


    // Only these fields can be edited
    const allowedFields = [
        "title",
        "description",
        "price",
        "category",
        "image",
        "stock",
    ];


    // Loads existing product data when page opens
    const loadProduct = async () => {
        try {

            // Get products from backend
            const response = await api.get("/products");


            // Find the product using URL id
            const product = response.data.find(
                (product) => product.id === Number(id)
            );


            // Put existing product data into form
            if (product) {
                setForm(product);
            }


        } catch (error) {
            console.error("Error loading product:", error);
        }
    };


    // Runs when component loads
    // Also runs if id changes
    useEffect(() => {
        loadProduct();
    }, [id]);



    // Handles input changes
    const handleChange = (e) => {

        setForm({
            ...form,

            // Dynamic object update
            // Example:
            // name="price" value="500"
            // becomes price: "500"
            [e.target.name]: e.target.value,
        });

    };



    // Sends updated product to backend
    const handleSubmit = async (e) => {

        // Prevent browser refresh
        e.preventDefault();


        try {

            // Update product using its id
            await api.put(`/products/edit/${id}`, form);


            alert("Product updated successfully");


            // Go back to product list page
            navigate("/admin/products");


        } catch (error) {

            console.error("Error updating product:", error);

        }

    };



    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">


                {/* Page heading */}
                <h2 className="mb-2 text-center text-3xl font-bold text-gray-800">
                    Edit Product
                </h2>


                <p className="mb-6 text-center text-sm text-gray-500">
                    Update product details
                </p>



                {/* Product edit form */}
                <form onSubmit={handleSubmit} className="space-y-4">


                    {/* Creates inputs automatically from form object */}
                    {Object.keys(form).map((key) => (

                        // Only render allowed editable fields
                        allowedFields.includes(key) && (

                            <input
                                key={key}
                                name={key}
                                value={form[key]}
                                onChange={handleChange}
                                placeholder={
                                    key.charAt(0).toUpperCase() + key.slice(1)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />

                        )

                    ))}



                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        Update Product
                    </button>


                </form>


            </div>

        </div>
    );
}