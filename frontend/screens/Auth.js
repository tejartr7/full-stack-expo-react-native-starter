import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput } from "react-native";
import {Picker} from "@react-native-picker/picker";
import auth from "@react-native-firebase/auth";
import tw from "twrnc";
import Toast from "react-native-toast-message";
import axios from "axios";

function Auth({ navigation }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user"); // Default role set to "User"

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on unmount
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);
  }

  function showToast(type, text1, text2) {
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
  }

  async function handleSignIn() {
    if (!email || !password) {
      showToast("error", "Error", "Please enter both email and password.");
      return;
    }
    try {
      await auth().signInWithEmailAndPassword(email, password);
      showToast("success", "Success", "Signed in successfully!");
    } catch (error) {
      console.error("Error signing in:", error);
      showToast(
        "error",
        "Error",
        "Failed to sign in. Please check your credentials and try again."
      );
    }
  }

  async function handleSignUp() {
    if (!email || !password || !role) {
      showToast("error", "Error", "Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      const response = await axios.post(
        "8000/user/addUser",
        {
          email: email,
          name: name,
          role: role, // Pass the selected role to the backend
          token: token,
        }
      );

      if (response.data.errors) {
        showToast(
          "error",
          "Error",
          "Failed to create account. Please try again."
        );
        console.error(response.data.errors);
      } else {
        showToast("success", "Success", "Account created successfully!");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      showToast(
        "error",
        "Error",
        "Failed to create account. Please try again."
      );
    }
  }

  function handleSignOut() {
    auth().signOut();
    showToast("success", "Success", "Signed out successfully!");
  }

  return (
    <View style={tw`bg-black flex-1 items-center justify-center p-4`}>
      <Text style={tw`text-white text-3xl font-bold mb-8`}>
        Welcome to React Native Auth
      </Text>
      {user ? (
        <View style={tw`bg-black items-center`}>
          <Text style={tw`text-white text-lg mb-4`}>Welcome {user.email}</Text>
          <TouchableOpacity
            style={tw`bg-green-500 py-2 px-4 rounded-lg mb-4`}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={tw`text-white font-semibold text-center`}>
              Go to Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-red-500 py-2 px-4 rounded-lg`}
            onPress={handleSignOut}
          >
            <Text style={tw`text-white font-semibold`}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={tw`bg-black w-full max-w-sm p-4`}>
          <Text style={tw`text-white mb-2`}>Name</Text>
          <TextInput
            placeholder="Please enter your name"
            placeholderTextColor="white"
            value={name}
            onChangeText={setName}
            style={tw`border border-gray-300 rounded-lg mb-4 p-2 w-full text-white`}
            keyboardType="default"
            autoCapitalize="none"
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
            onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
            style={tw`bg-white mb-4 rounded-lg p-2`}
          >
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>

          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 rounded-lg mb-4`}
            onPress={handleSignIn}
          >
            <Text style={tw`text-white font-semibold text-center`}>
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`bg-green-500 py-2 px-4 rounded-lg`}
            onPress={handleSignUp}
          >
            <Text style={tw`text-white font-semibold text-center`}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Toast />
    </View>
  );
}

export default Auth;
