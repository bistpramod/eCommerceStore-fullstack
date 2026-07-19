import Cart from "../models/cart.model";

//* Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity: 1 }] });
    } else {
      const item = cart.items.find((i) => i.productId.toString() === productId);
    }
    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }
    await cart.save();
    res.status(201).json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

//* remove item form the cart
export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );
    await cart.save();
    res.status(200).json({
      message: "removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

//* update item in cart

export const updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    item.quantity = quantity;
    await cart.save()

    res.json({
        message:'Item quantity updated',
        cart,
    })
  } catch (error) {
    console.error("Something went wrong", error);
  }
};


