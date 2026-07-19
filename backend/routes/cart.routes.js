import express from "express"

import { addToCart,removeItem,getCart,updateCart } from "../controllers/cart.controller"

const router = express.Router();

//* add item to cart 
router.post('/add', addToCart)

//* remove item form cart 
router.post('/remove',removeItem)

//* update item quantity in cart
router.post('/update',updateQuantity)


// get user cart
router.get('/:userId',getCart)


export default router