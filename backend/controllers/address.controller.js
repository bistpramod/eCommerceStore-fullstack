import Address from "../models/address.model";

//* save address
export const saveAddress = async (req, res) => {
  try {
    const address = await Address.create(req.body);
    res.status(201).json({
      message: "Address saved syccessfully",
      address,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error });
  }
};

// Get Addresses by userId -- kind of multiple adddresses at once
export const getAddress = async (req, res) => {
  try {
    const addresses = await Address.find({
      userid: req.params.userId,
    });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
