import { View, Text, TouchableOpacity, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import tw from "twrnc";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Home({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    navigation.navigate("SignIn");
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      setUser(null);
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  const openGitHubLink = () => {
    Linking.openURL(
      "https://github.com/tejartr7/full-stack-expo-react-native-starter"
    );
  };

  return (
    <View style={tw`bg-black flex-1 justify-center items-center p-4`}>
      {user ? (
        <>
          <Text
            style={tw`text-white font-[Poppins-Regular] text-lg text-center mb-4`}
          >
            Welcome, {user.email}!
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 m-4 rounded-lg`}
            onPress={() => navigation.navigate("AddProduct")}
          >
            <Text style={tw`font-[Poppins-Regular] text-white text-base`}>
              Add Product
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 m-4 rounded-lg`}
            onPress={() => navigation.navigate("Products")}
          >
            <Text style={tw`font-[Poppins-Regular] text-white text-base`}>
              View All Products
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 m-4 rounded-lg`}
            onPress={() => navigation.navigate("ShowUsers")}
          >
            <Text style={tw`font-[Poppins-Regular] text-white text-base`}>
              Show All Users
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 m-4 rounded-lg`}
            onPress={() => navigation.navigate("Notification")}
          >
            <Text style={tw`font-[Poppins-Regular] text-white text-base`}>
              Notification
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-red-500 py-2 px-4 rounded-lg`}
            onPress={handleSignOut}
          >
            <Text style={tw`font-[Poppins-Regular] text-white text-base`}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text
            style={tw`text-white font-[Poppins-Regular] text-lg text-center mb-4`}
          >
            Please sign in to continue
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 rounded-lg mb-4`}
            onPress={handleSignIn}
          >
            <Text style={tw`font-[Poppins-Regular] text-white text-base`}>
              Sign In
            </Text>
          </TouchableOpacity>
        </>
      )}
      <Text
        style={tw`text-white font-[Poppins-Regular] text-base text-center mt-6`}
      >
        Want to get the starter for this project?
      </Text>
      <TouchableOpacity
        style={tw`text-black flex-row items-center py-2 px-4 mt-2 rounded-lg bg-white`}
        onPress={openGitHubLink}
      >
        <Icon name="github" size={20} color="black" style={tw`mr-2`} />
        <Text style={tw`font-[Poppins-Regular] text-black text-base`}>
          GitHub Repository
        </Text>
      </TouchableOpacity>
    </View>
  );
}
