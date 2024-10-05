// controllers/ProductsController.js
import Product from "../schemas/Product.js"; // Import Product model
import User from "../schemas/User.js"; // Import User model
import verifyToken from "../middleware/verifyToken.js"; // Import token verification middleware

// Get all products
export const getProducts = async (req, res) => {
  const { token } = req.query;

  const verifiedUser = await verifyToken(token, res);
  if (!verifiedUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching products", error });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  console.log("call came to add product");
  const { email, name, price, token } = req.body;

  const verifiedUser = await verifyToken(token, res);
  if (!verifiedUser) {
    console.log("token not verified");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(409).json({ message: "User does not exist" });
    }

    if (existingUser.role !== "admin" && existingUser.role !== "super_admin") {
      return res.status(403).json({ message: "Only admins can add products" });
    }

    const newProduct = new Product({ name, price, email });
    await newProduct.save();

    return res
      .status(200)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Error creating product", error });
  }
};

// Update a product by ID (placeholder for now)
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, email, token } = req.body;
  const verifiedUser = await verifyToken(token, res);
  if (!verifiedUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const existingProduct = await Product.findById(id);
  if (!existingProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (existingProduct.email !== email) {
    return res
      .status(403)
      .json({ message: "Only the product creator can update this product" });
  }

  existingProduct.name = name;
  existingProduct.price = price;

  await existingProduct.save();
  console.log("product updated");
  return res.status(200).json({ message: "Product updated successfully" });
  // You can add the update logic here
};

// Delete a product by ID (placeholder for now)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;
  //console.log(token);
  const verifiedUser = await verifyToken(token, res);
  if (!verifiedUser) {
    console.log("token not verified");
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    await Product.findByIdAndDelete(id);
    console.log("successfully deleted the product");
    // You can add the delete logic here
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product", error });
  }
};

// Get a product by ID (placeholder for now)
export const getProductById = async (req, res) => {
  const { id } = req.params;
  // You can add the fetch by ID logic here
};
