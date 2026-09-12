import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js"; // FIX: was missing, used below

export const createOrder = async (req, res) => {
  try {
    const { userId, address } = req.body;

    //* get cart
   
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
     
      return res.status(404).json({
        message: "Cart is empty",
      });
    }

    // Prepare Order Items
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    // Calculate Total Amount
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    // Deduct stock from Products
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
     
        $inc: { stock: -item.quantity },
      });
    }

    // Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      address,
     
      totalAmount,
      paymentMethod: "Cash On Delivery",
    });

    // Clear Cart
   
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Order creation failed:", error); // FIX: log the real error for debugging
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};