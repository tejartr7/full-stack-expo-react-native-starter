// routes/productRouter.js
import express from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct, getProductById } from '../controllers/productControllers.js';

const productRouter = express.Router();

// Get all products
productRouter.get('/', getProducts);

// Add a new product
productRouter.post('/addProduct', addProduct);

// Update a product by ID
productRouter.put('/updateProduct/:id', updateProduct);

// Delete a product by ID
productRouter.delete('/deleteProduct/:id', deleteProduct);

// Get a product by ID
productRouter.get('/:id', getProductById);

export default productRouter;
