import express from 'express';
import admin from 'firebase-admin';
import User from '../schemas/User.js';
import serviceCredentials from '../privatekey.js';
import Product from '../schemas/Product.js';
const productRouter = express.Router();

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
//get products
productRouter.get('/', (req, res) => {
    
});


//add products
productRouter.post('/addProduct', async(req, res) => {
    const { email, name, price, token } = req.body;
    console.log(req.body);
    const verifiedUser = await verifyToken(token, res);
    if (!verifiedUser) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        if(!email){
            return res.status(400).json({ message: 'Email is required' });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(409).json({ message: 'User does not exist' });
        }
        console.log(existingUser)
        if(existingUser.role !== "admin"){
            console.log("here")
            return res.status(403).json({ message: 'Only admins can add products' });
        }
        console.log("heheere")
        const newProduct = new Product({ name, price,email });
        await newProduct.save();
        console.log("saved")
        return res.status(200).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating user', error });
    }
});

//update product
productRouter.put('/updateProduct/{id}', (req, res) => {});

//delete product
productRouter.delete('/deleteProduct/{id}', (req, res) => {});

//get product by id
productRouter.get('/{id}', (req, res) => {});

export default productRouter;