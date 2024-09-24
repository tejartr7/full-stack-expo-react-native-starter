import express from 'express';
import admin from 'firebase-admin'; // Ensure you have firebase-admin set up
import User from '../schemas/User.js';
import serviceCredentials from '../privatekey.js';
admin.initializeApp({
    credential: admin.credential.cert(serviceCredentials),
});

const userRouter = express.Router();

// Middleware to verify Firebase token
// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
    const {email,name,token} = req.body;
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Save the user info for later use
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};


// Route to add a user
userRouter.post('/addUser', verifyToken, async (req, res) => {
    const {email,name,token}= req.body;
    // Regex to extract the email from the query
    if (!email || !name) {
        return res.status(400).json({ message: 'Email and name are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({ email, name });
        await newUser.save();
        return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Error creating user', error });
    }
});

userRouter.post('/getUser', verifyToken, async (req, res) => {
    console.log("get user")
    const {productName,price,email,token}= req.body;
    // Regex to extract the email from the query
    if (!email || !productName) {
        return res.status(400).json({ message: 'Email and name are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(409).json({ message: 'User does not exists' });
        }
        return res.status(200).json({ message: 'User created successfully', user: existingUser });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Error creating user', error });
    }
});

export default userRouter;
