import Product from "../models/product.model.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

//* create product
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock } = req.body;

    let image = "";

    // If an image was selected, upload it to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      image = result.secure_url;
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      stock,
      image,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

//* get all products
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      message: "All products fetched",
      status: "success",
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

//* update a product
export const updateProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock } = req.body;

    let updateData = {
      title,
      description,
      price,
      category,
      stock,
    };

    // Only replace image when a new image is selected
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      updateData.image = result.secure_url;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
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
      return res.status(404).json({
        message: "Product doesn't exist",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
      success: false,
    });
  }
};
