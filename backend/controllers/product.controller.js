import Product from "../models/product.model.js";

//* create product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req, body);
    res.json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// get all products by id

export const getProducts = async (req, res) => {
  // fucntion returns multiple products
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // sorting in ascending order

    res.status(200).json({
      message: "All products fetched",
      status: "success",
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error); // helps with debugging
    return res.status(500).json({
      message: "Server error",
    });
  }
};

//* update a product

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({
      message: "product updated successfully",
      updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};

//* delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(500).json({
        message: "product doesnt exist",
        success: 404,
      });
    }
    res.status(200).json({
        message:"product deleted successfully",
        sucess:true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};
