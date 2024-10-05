import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import auth from "@react-native-firebase/auth";
import tw from "twrnc";
import Toast from "react-native-toast-message";

const UpdateProduct = ({ route, navigation }) => {
  const { product, userDetails } = route.params; // Destructure product and userDetails from route params
  const [productName, setProductName] = useState(product.name);
  const [productPrice, setProductPrice] = useState(String(product.price)); // Ensure this is a string

  const showToast = (type, text1, text2) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: "bottom",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };

  const handleUpdateProduct = async () => {
    if (!productName || !productPrice) {
      showToast("error", "Error", "Please fill in all fields.");
      return;
    }

    try {
      const user = auth().currentUser;
      const token = await user.getIdToken();

      const response = await axios.put(
        `:8000/products/updateProduct/${product._id}`,
        {
          name: productName,
          price: productPrice,
          email: user.email, // Pass the user's email to the backend
          token: token,
        }
      );

      if (response.status === 200) {
        showToast("success", "Success", "Product updated successfully.");
        navigation.navigate("Products", { refresh: true }); // Pass a refresh flag
      } else {
        showToast("error", "Error", "Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      showToast("error", "Error", "Failed to update product.");
    }
  };

  return (
    <View style={tw`flex-1 bg-black justify-center items-center p-4`}>
      <Text style={tw`text-2xl font-bold text-white font-[Poppins-Regular] mb-4`}>
        Update Product
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
        onPress={handleUpdateProduct}
      >
        <Text style={tw`text-white font-bold text-center font-[Poppins-Regular]`}>
          Update Product
        </Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

export default UpdateProduct;
