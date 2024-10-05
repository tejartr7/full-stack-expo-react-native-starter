import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import axios from "axios";
import tw from "twrnc";
import Toast from "react-native-toast-message";
import { useNavigation } from '@react-navigation/native';

const AddProduct = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on unmount
  }, []);

  const onAuthStateChanged = async (user) => {
    setUser(user);
    if (user) {
      try {
        const token = await user.getIdToken();
        const response = await axios.get(
          ":8000/user/getUser",
          {
            params: { email: user.email, token: token },
          }
        );

        if (response.data.user.role === "admin" || response.data.user.role === "super_admin") {
          setIsAdmin(true);
        } else {
          showToast("error", "Error", "Only admins can add products.");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        showToast("error", "Error", "Failed to verify user role.");
      }
    }
  };

  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: "bottom",
      visibilityTime: 3000, // Show toast for 3 seconds
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };

  const handleAddProduct = async () => {
    if (!productName || !productPrice) {
      showToast("error", "Error", "Please fill in all fields.");
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await axios.post(
        ":8000/products/addProduct",
        {
          name: productName,
          price: productPrice,
          email: user.email,
          token: token,
        }
      );

      if (response.status === 200) {
        showToast("success", "Success", "Product added successfully.");
        setProductName("");
        setProductPrice("");

        // Redirect after showing the toast
        setTimeout(() => {
          navigation.navigate("Home"); // Replace "Home" with your actual home screen name
        }, 3000);
      } else {
        showToast("error", "Error", "Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      showToast("error", "Error", "Failed to add product.");
    }
  };

  if (!user) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-black`}>
        <Text style={tw`text-xl text-red-500 font-[Poppins-Regular]`}>
          Please sign in to add products.
        </Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-black`}>
        <Text style={tw`text-xl text-red-500 font-[Poppins-Regular]`}>
          You are not authorized to add products.
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-black justify-center items-center p-4`}>
      <Text style={tw`text-2xl font-bold text-white font-[Poppins-Regular] mb-4`}>
        Add Product
      </Text>
      <TextInput
        placeholder="Product Name"
        placeholderTextColor="gray"
        value={productName}
        onChangeText={setProductName}
        style={tw`border border-gray-300 text-white font-[Poppins-Regular] rounded-lg p-2 mb-4 w-full`}
      />
      <TextInput
        placeholder="Product Price"
        placeholderTextColor="gray"
        value={productPrice}
        onChangeText={setProductPrice}
        style={tw`border border-gray-300 text-white font-[Poppins-Regular] rounded-lg p-2 mb-4 w-full`}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={tw`bg-blue-500 py-2 px-4 rounded-lg w-full`}
        onPress={handleAddProduct}
      >
        <Text style={tw`text-white font-bold text-center font-[Poppins-Regular]`}>
          Add Product
        </Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

export default AddProduct;
