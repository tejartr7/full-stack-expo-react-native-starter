import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import tw from 'twrnc';
import Toast from 'react-native-toast-message';

const AddProduct = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on unmount
  }, []);

  const onAuthStateChanged = async (user) => {
    setUser(user);
    if (user) {
      // Call backend to check if the user is admin
      try {
        const token = await user.getIdToken();
        const response = await axios.post(':8000/user/getUser', {
          token: token,
        });

        if (response.data.role === 'admin') {
          setIsAdmin(true);
        } else {
          showToast('error', 'Error', 'Only admins can add products.');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        showToast('error', 'Error', 'Failed to verify user role.');
      }
    }
  };

  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: 'bottom',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };

  const handleAddProduct = async () => {
    if (!productName || !productPrice) {
      showToast('error', 'Error', 'Please fill in all fields.');
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await axios.post('http://localhost:8000/products/addProduct', {
        productName: productName,
        price: productPrice,
        email: user.email, // Pass the user's email to the backend
        token: token,
      });

      if (response.data.success) {
        showToast('success', 'Success', 'Product added successfully.');
        setProductName('');
        setProductPrice('');
      } else {
        showToast('error', 'Error', 'Failed to add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showToast('error', 'Error', 'Failed to add product.');
    }
  };

  if (!user) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-xl text-red-500`}>Please sign in to add products.</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-xl text-red-500`}>You are not authorized to add products.</Text>
      </View>
    );
  }

  return (
    <View style={tw`p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Add Product</Text>
      <TextInput
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
        style={tw`border border-gray-300 rounded-lg p-2 mb-4`}
      />
      <TextInput
        placeholder="Product Price"
        value={productPrice}
        onChangeText={setProductPrice}
        style={tw`border border-gray-300 rounded-lg p-2 mb-4`}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={tw`bg-blue-500 py-2 px-4 rounded-lg`}
        onPress={handleAddProduct}
      >
        <Text style={tw`text-white font-bold text-center`}>Add Product</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

export default AddProduct;
