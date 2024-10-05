import admin from '../firebase-admin.js';
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
export default verifyToken;