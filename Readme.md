# Full Stack Expo React Native Starter 
 
This project is a full-stack application built with React Native for the frontend and Express.js with MongoDB for the backend. It features user authentication using Firebase and provides a simple API for managing users and products. 
 
## Table of Contents 
 
- [Features](#features) 
- [Technologies Used](#technologies-used) 
- [Getting Started](#getting-started) 
  - [Frontend Setup](#frontend-setup) 
  - [Backend Setup](#backend-setup) 
- [Environment Variables](#environment-variables) 
- [Usage](#usage) 
- [API Endpoints](#api-endpoints) 
  - [User Routes](#user-routes) 
  - [Product Routes](#product-routes) 
- [Contributing](#contributing) 
- [License](#license) 
 
## Features 
 
- User authentication using Firebase 
- User management (add, get, update) 
- Product management (add, get, update, delete) 
- Responsive design with React Native 
 
## Technologies Used 
 
- React Native (Expo) 
- Express.js 
- MongoDB 
- Firebase Authentication 
- dotenv for environment variable management 
- Helmet for security 
- CORS for cross-origin requests 
- Compression for performance optimization 
 
## Getting Started 
 
### Frontend Setup 
 
1. **Clone the repository**: 
   ```bash 
   git clone https://github.com/tejartr7/full-stack-expo-react-native-starter.git 
   cd full-stack-expo-react-native-starter/frontend 
   ``` 
 
2. **Install dependencies**: 
   ```bash 
   npm install 
   ``` 
 
3. **Run the app**: 
   ```bash 
   expo start 
   ``` 
 
### Backend Setup 
 
1. **Navigate to the backend folder**: 
   ```bash 
   cd full-stack-expo-react-native-starter/backend 
   ``` 
 
2. **Install dependencies**: 
   ```bash 
   npm install 
   ``` 
 
3. **Create a `.env` file** in the `backend` folder and add the following environment variables: 
   ```plaintext 
   MONGO_URI=your_mongo_connection_string 
   private_key_id=your_private_key_id 
   client_email=your_client_email 
   client_id=your_client_id 
   auth_uri=your_auth_uri 
   token_uri=your_token_uri 
   universe_domain=your_universe_domain 
   ``` 
 
4. **Run the server**: 
   ```bash 
   npm start 
   ``` 
 
## Environment Variables 
 
The backend requires several environment variables, which can be obtained from the Firebase Console. Here's how to get them: 
 
1. **MONGO_URI**: Your MongoDB connection string. 
2. **Firebase Service Account**: 
   - Go to the Firebase Console. 
   - Navigate to **Project Settings > Service accounts**. 
   - Click on **Generate new private key** to download the JSON file. 
   - Extract the following fields from the downloaded JSON: 
     - `private_key_id` 
     - `client_email` 
     - `client_id` 
     - `auth_uri` 
     - `token_uri` 
     - `universe_domain` 
 
## Usage 
 
- The frontend application is a mobile application built with React Native. Users can register, login, and manage their profiles. 
- The backend API provides endpoints for user and product management, secured with Firebase authentication. 
 
## API Endpoints 
 
### User Routes 
 
- **GET** `/user/getUser` - Get the authenticated user. 
- **POST** `/user/addUser` - Add a new user. 
- **GET** `/user/getAllUsers` - Retrieve all users. 
- **PUT** `/user/updateUser/:id` - Update a user by ID. 
 
### Product Routes 
 
- **GET** `/products` - Get all products. 
- **POST** `/products/addProduct` - Add a new product. 
- **PUT** `/products/updateProduct/:id` - Update a product by ID. 
- **DELETE** `/products/deleteProduct/:id` - Delete a product by ID. 
- **GET** `/products/:id` - Get a product by ID. 
 
## Contributing 
 
Contributions are welcome! If you have suggestions for improvements or features, please create a pull request or open an issue. 
 
## License 
 
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.