import User from "../schemas/User.js"; // Import User model
import verifyToken from "../middleware/verifyToken.js"; // Import token verification middleware

// Controller function to get user details
export const getUser = async (req, res) => {
  const { email, token } = req.query;

  const verifiedUser = await verifyToken(token, res);
  if (!verifiedUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(409).json({ message: "User does not exist" });
    }

    return res.status(200).json({
      message: "User details fetched successfully",
      user: existingUser,
    });
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ message: "Error finding user", error });
  }
};

// Controller function to add a new user
export const addUser = async (req, res) => {
  const { email, name, role, token } = req.body;

  const verifiedUser = await verifyToken(token, res);
  if (!verifiedUser) return;

  if (!email || !name) {
    return res.status(400).json({ message: "Email and name are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({ email, name, role });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Error creating user", error });
  }
};

export const getAllUsers = async (req, res) => {
  const { token } = req.query;
  const verifiedUser = await verifyToken(token, res);
  if (!verifiedUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const users = await User.find();
  if (!users) {
    return res.status(404).json({ message: "No users found" });
  }

  return res.status(200).json(users);
};

export const updateUser = async (req, res) => {
  const {token,role}=req.body.params;
  const {id} = req.params;
  const verifiedUser = await verifyToken(token, res);
  if (!verifiedUser) return res.status(401).json({ message: "Unauthorized" });
  const existingUser = await User.findById(id);
  if (!existingUser) return res.status(404).json({ message: "User not found" });
  existingUser.role = role;
  await existingUser.save();
  return res.status(200).json({ message: "User updated successfully" });
};
