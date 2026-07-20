import Cart from "../models/cart.model.js";

//* Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });

    // FIX: declare item here so it is accessible everywhere
    let item;

    if (!cart) {
      // Create a new cart if the user doesn't have one
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      // Find the item in the existing cart
      item = cart.items.find((i) => i.productId.toString() === productId);

      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({
          productId,
          quantity: 1,
        });
      }
    }

    await cart.save();

    res.status(201).json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

//* Remove item from the cart
export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await cart.save();

    res.status(200).json({
      message: "Removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

//* Update item quantity in cart
export const updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // Optional: prevent negative quantities
    if (quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      message: "Item quantity updated",
      cart,
    });
  } catch (error) {
    console.error("Something went wrong:", error);

    // FIX: send a response to avoid hanging requests
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

//* Get cart by user ID
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    // FIX: no cart yet isn't an error — return an empty cart instead of 404
    if (!cart) {
      return res.status(200).json({
        userId,
        items: [],
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};