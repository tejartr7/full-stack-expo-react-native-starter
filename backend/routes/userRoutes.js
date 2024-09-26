import express from 'express';
import admin from '../firebase-admin.js';
import User from '../schemas/User.js';

const userRouter = express.Router();

const verifyToken = async (token, res) => {
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return null;
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
        return null;
    }
};

userRouter.get('/getUser', async (req, res) => {
    const { email,token } = req.query; 
    const verifiedUser = await verifyToken(token, res);
    if (!verifiedUser) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(409).json({ message: 'User does not exist' });
        }
        return res.status(200).json({ message: 'User details fetched successfully', user: existingUser });
    } catch (error) {
        console.error('Error finding user:', error);
        return res.status(500).json({ message: 'Error finding user', error });
    }
});

userRouter.post('/addUser', async (req, res) => {
    const { email, name, role, token } = req.body;

    const verifiedUser = await verifyToken(token, res);
    if (!verifiedUser) return;

    if (!email || !name) {
        return res.status(400).json({ message: 'Email and name are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const newUser = new User({ email, name, role });
        await newUser.save();
        return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Error creating user', error });
    }
});


export default userRouter;
