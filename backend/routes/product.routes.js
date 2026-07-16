import express from "express"

import { getProducts, updateProduct, deleteProduct,createProduct } from "../controllers/product.controller.js"

const router = express.Router()

router.post('/add', createProduct);

router.get('/',getProducts)

router.put('/update/:id',updateProduct)

router.delete('/delete/:id',deleteProduct)

export default router;