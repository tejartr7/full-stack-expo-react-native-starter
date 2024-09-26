import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native'; // Import Button from 'react-native'
import auth from '@react-native-firebase/auth';
import tw from 'twrnc';

export default function Home({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    navigation.navigate('auth');
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      setUser(null);  // Set user to null after sign out
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  return (
    <View style={tw`bg-black text-white flex-1 justify-center items-center p-4`}>
      {user ? (
        <>
          <Text style={tw`bg-black text-white font-[Poppins-Regular] text-lg text-center mb-4`}>
            Welcome, {user.email}!
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 m-4 rounded-lg`}
            onPress={() => navigation.navigate("addProduct")}
          >
            <Text style={tw`font-[Poppins-Regular] text-white text-base`}>
              Add Product
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
          <Text style={tw`bg-black text-white font-[Poppins-Regular] text-lg text-center mb-4`}>
            Please sign in to continue
          </Text>
          <TouchableOpacity
            style={tw`bg-blue-500 py-2 px-4 rounded-lg`}
            onPress={handleSignIn}
          >
            <Text style={tw`font-[Poppins-Regular] text-white text-base`}>
              Sign In
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
