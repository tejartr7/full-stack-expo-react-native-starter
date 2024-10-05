import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import axios from "axios";
import auth from "@react-native-firebase/auth";
import tw from "twrnc";
import { Picker } from '@react-native-picker/picker';

const ShowAdmins = () => {
  const [users, setUsers] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false); // To check super admin
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [modalVisible, setModalVisible] = useState(false); // For popup modal
  const [modalMessage, setModalMessage] = useState("");

  const fetchUsers = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();

      // Fetch all users
      const response = await axios.get(
        "https://react-native-backend-5nw6.onrender.com/user/getAllUsers",
        {
          params: {
            token: token,
          },
        }
      );
      setUsers(response.data);

      // Fetch current user's role based on email to check if they are super admin
      const userResponse = await axios.get(
        "https://react-native-backend-5nw6.onrender.com/user/getUser",
        {
          params: {
            email: currentUser.email, // Using email to get current user's role
            token: token,
          },
        }
      );

      const currentUserRole = userResponse.data.user.role;
      if (currentUserRole === "super_admin") {
        setIsSuperAdmin(true); // Allow role management if user is super admin
      }

    } catch (error) {
      console.error("Error fetching users or user role:", error);
      showModal("Error", "Failed to fetch users or user role.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, role) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: role }));
  };

  const updateUserRole = async (userId) => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const selectedRole = selectedRoles[userId];
    if (!selectedRole) {
      showModal("Error", "No role selected.");
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await axios.put(
        `https://react-native-backend-5nw6.onrender.com/user/updateUser/${userId}`,
        { params: { token: token, role: selectedRole } } // Passing token in params
      );

      if (response.status === 200) {
        showModal("Success", "User role updated.");
        fetchUsers(); // Refresh the user list after updating role
      } else {
        showModal("Error", "Failed to update user role.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      showModal("Error", "Failed to update user role.");
    }
  };

  const showModal = (title, message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-black`}>
        <Text style={tw`text-xl text-white`}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-black`}>
      <Text
        style={tw`text-2xl text-white font-[Poppins-Regular] text-center my-4`}
      >
        User Management
      </Text>

      {users
        .filter((user) => user.role !== "super_admin") // Hiding super admins
        .map((user) => (
          <View key={user._id} style={tw`p-4 bg-gray-800 m-2 rounded-lg`}>
            <Text style={tw`text-white font-[Poppins-Regular]`}>
              Name: {user.name}
            </Text>
            <Text style={tw`text-white font-[Poppins-Regular]`}>
              Email: {user.email}
            </Text>
            <Text style={tw`text-white font-[Poppins-Regular]`}>
              Role: {user.role}
            </Text>

            {/* Show role management UI only if current user is a super admin */}
            {isSuperAdmin && (
              <>
                <Picker
                  selectedValue={selectedRoles[user._id] || user.role}
                  style={tw`bg-gray-700 text-white my-2`}
                  onValueChange={(itemValue) =>
                    handleRoleChange(user._id, itemValue)
                  }
                >
                  <Picker.Item label="User" value="user" />
                  <Picker.Item label="Admin" value="admin" />
                </Picker>
                <TouchableOpacity
                  style={tw`bg-blue-500 py-2 px-4 rounded-lg mt-2`}
                  onPress={() => updateUserRole(user._id)}
                >
                  <Text style={tw`text-white font-[Poppins-Regular] text-center`}>
                    Update Role
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ))}

      {/* Modal for showing success or error */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-5 rounded-lg`}>
            <Text style={tw`text-lg font-bold text-center mb-2`}>{modalMessage}</Text>
            <TouchableOpacity
              style={tw`bg-blue-500 py-2 px-4 rounded-lg mt-2`}
              onPress={() => setModalVisible(false)}
            >
              <Text style={tw`text-white text-center`}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ShowAdmins;
