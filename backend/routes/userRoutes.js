import express from 'express';
import {getUser,addUser,getAllUsers,updateUser} from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter.get('/getUser', getUser); 
userRouter.post('/addUser', addUser);
userRouter.get("/getAllUsers",getAllUsers);
userRouter.put("/updateUser/:id",updateUser);
export default userRouter;
