import { View, Text, Button, FlatList, TouchableOpacity, Alert } from "react-native"; // Ensure Alert is imported
import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import axios from "axios";
import tw from "twrnc";

const Productspage = ({ navigation, route }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth().currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const userResponse = await axios.get(
          "https://react-native-backend-5nw6.onrender.com/user/getUser",
          {
            params: {
              email: user.email,
              token: token,
            },
          }
        );

        setUserDetails(userResponse.data.user);
        fetchProducts(); // Fetch products after getting user details
      } catch (error) {
        console.error("Error fetching user details or products:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      const user = auth().currentUser;
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const productsResponse = await axios.get(
          "https://react-native-backend-5nw6.onrender.com/products/",
          {
            params: {
              token: token,
            },
          }
        );
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchUserDetails();

    if (route.params?.refresh) {
      fetchProducts(); // Fetch products again if refresh flag is true
    }
  }, [route.params?.refresh]); // Add refresh flag to dependencies

  const handleDeleteProduct = (product) => {
    if (!userDetails) {
      return;
    }

    if (
      userDetails.role !== "super_admin" &&
      userDetails.email !== product.email
    ) {
      alert(
        "Only super admins and the product creator can delete this product."
      );
      return;
    }

    // Show confirmation alert before deleting
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete the product: ${product.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth().currentUser;
              const token = await user.getIdToken();

              const response = await axios.delete(
                `https://react-native-backend-5nw6.onrender.com/products/deleteProduct/${product._id}`,
                {
                  params: {
                    token: token,
                  },
                }
              );

              if (response.status === 200) {
                setProducts((prevProducts) =>
                  prevProducts.filter((p) => p._id !== product._id)
                );
              }
            } catch (error) {
              console.error("Error deleting product:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleUpdateProduct = (product) => {
    if (!userDetails) {
      return;
    }

    // Check if user is super admin or product creator
    if (
      userDetails.role !== "super_admin" &&
      userDetails.email !== product.email
    ) {
      alert(
        "Only super admins and the product creator can update this product."
      );
      return;
    }

    navigation.navigate("UpdateProduct", { product, userDetails }); // Pass product and user details
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-black`}>
        <Text style={tw`text-white`}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 p-4 bg-black`}>
      {auth().currentUser ? (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id} // Use _id as key
          renderItem={({ item }) => (
            <View style={tw`bg-gray-800 rounded-lg p-4 mb-4 shadow-md`}>
              <Text style={tw`text-lg text-white font-bold font-poppins`}>
                {item.name}
              </Text>
              <Text style={tw`text-white font-poppins`}>${item.price}</Text>
              <View style={tw`flex-row mt-4 justify-between`}>
                <TouchableOpacity
                  style={tw`bg-[#32CD32] rounded-lg px-4 py-2 mr-2`}
                  onPress={() => handleUpdateProduct(item)}
                >
                  <Text style={tw`text-white`}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`bg-[#FF6347] rounded-lg px-4 py-2`}
                  onPress={() => handleDeleteProduct(item)}
                >
                  <Text style={tw`text-white`}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`mb-4 text-base text-white font-poppins`}>
            Please sign in or sign up to see products.
          </Text>
          <Button title="Sign In" onPress={() => navigation.navigate("Auth")} />
          <Button title="Sign Up" onPress={() => navigation.navigate("Auth")} />
        </View>
      )}
    </View>
  );
};

export default Productspage;
