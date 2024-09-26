import admin from "firebase-admin";
import serviceCredentials from './privatekey.js';
admin.initializeApp({
    credential: admin.credential.cert(serviceCredentials),
});

export default admin;