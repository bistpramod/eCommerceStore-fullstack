import { useState, useEffect } from "react";

import api from "../api/Axios";

export default function Cart() {
    const userId = localStorage.getItem("userId")
    const [cart, setCart] = useState(null)

    //* load the cart data
    const loadCart = async () => {
        if (!userId) {
            return;
        }
        try {
            const response = await api.get(`/cart/${userId}`)
            setcart(response.data)


        }
        catch (error) {
            console.error("An error occured", error)
        }

    }
    useEffect(() => {
        loadCart();
    }, []);

    const removeItems = async (productId) => {
        await api.post(`/cart/remove`, { userId, productId })
    }

    //* update item quantity 

    const updateQuantity = async (productId, quantity) => {
        if (quantity === 0) {
            await removeItems(productId)
            return
        }
        await api.post(`/cart/update`, { userId, productId, quantity });
        loadCart();
        window.dispatchEvent(new Event("Cart Updated"))
    }
    if (!cart) {
        return <div>Loading...</div>
    }
    const total = cart.items.reduct((sum, item) => sum + item.productid.price * item.quantity, 0)

    return (<>
            
    </>)

}