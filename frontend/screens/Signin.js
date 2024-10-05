import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import auth from "@react-native-firebase/auth";
import tw from "twrnc";
import Toast from "react-native-toast-message";

const SignInPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSignIn = async () => {
    if (!email || !password) {
      showToast("error", "Error", "Please enter both email and password.");
      return;
    }
    try {
      await auth().signInWithEmailAndPassword(email, password);
      showToast("success", "Success", "Signed in successfully!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error signing in:", error);
      showToast("error", "Error", "Failed to sign in. Please check your credentials and try again.");
    }
  };

  return (
    <View style={tw`bg-black flex-1 items-center justify-center p-4`}>
      <Text style={tw`text-white text-3xl font-bold mb-8`}>Sign In</Text>
      <View style={tw`bg-black w-full max-w-sm p-4`}>
        <Text style={tw`text-white mb-2`}>Email</Text>
        <TextInput
          placeholder="Please enter your email"
          placeholderTextColor="white"
          value={email}
          onChangeText={setEmail}
          style={tw`border border-gray-300 rounded-lg mb-4 p-2 w-full text-white`}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={tw`text-white mb-2`}>Password</Text>
        <TextInput
          placeholder="Please enter your password"
          placeholderTextColor="white"
          value={password}
          onChangeText={setPassword}
          style={tw`border border-gray-300 rounded-lg mb-4 p-2 w-full text-white`}
          secureTextEntry
        />

        <TouchableOpacity
          style={tw`bg-blue-500 py-2 px-4 rounded-lg mb-4`}
          onPress={handleSignIn}
        >
          <Text style={tw`text-white font-semibold text-center`}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={tw`text-white text-center`}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
};

export default SignInPage;
