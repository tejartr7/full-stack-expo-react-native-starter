import React, { useState } from "react";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import auth from "@react-native-firebase/auth";
import tw from "twrnc";
import Toast from "react-native-toast-message";
import axios from "axios";

const SignUpPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user"); // Default role set to "User"

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

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      showToast("error", "Error", "Please fill in all fields.");
      return;
    }
  
    try {
      // Create user in Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      // Optionally, send user details to your backend
      const response = await axios.post(
        "https://react-native-backend-5nw6.onrender.com/user/addUser",
        {
          email: email,
          name: name,
          role: role,
          token: token,
        }
      );
  
      if (response.data.errors) {
        showToast("error", "Error", "Failed to create account. Please try again.");
        console.error(response.data.errors);
      } else {
        showToast("success", "Success", "Account created successfully!");
        // Redirect to Home screen instead of SignIn
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      showToast("error", "Error", "Failed to create account. Please try again.");
    }
  };
  

  return (
    <View style={tw`bg-black flex-1 items-center justify-center p-4`}>
      <Text style={tw`text-white text-3xl font-bold mb-8`}>Sign Up</Text>
      <View style={tw`bg-black w-full max-w-sm p-4`}>
        <Text style={tw`text-white mb-2`}>Name</Text>
        <TextInput
          placeholder="Please enter your name"
          placeholderTextColor="white"
          value={name}
          onChangeText={setName}
          style={tw`border border-gray-300 rounded-lg mb-4 p-2 w-full text-white`}
        />

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

        <Text style={tw`text-white mb-2`}>Role</Text>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={tw`bg-white mb-4 rounded-lg p-2`}
        >
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>

        <TouchableOpacity
          style={tw`bg-green-500 py-2 px-4 rounded-lg mb-4`}
          onPress={handleSignUp}
        >
          <Text style={tw`text-white font-semibold text-center`}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={tw`text-white text-center`}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
};

export default SignUpPage;
