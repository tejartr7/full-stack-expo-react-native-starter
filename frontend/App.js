import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Home";
import AddProduct from "./screens/Addproduct";
import Productspage from "./screens/Productspage";
import SignInPage from "./screens/Signin";
import SignUpPage from "./screens/Signup";
import UpdateProduct from "./screens/UpdateProduct";
import ShowAdmins from "./screens/ShowAdmins";
import Notification from "./screens/Notification";
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="Products" component={Productspage} />
        <Stack.Screen name="SignIn" component={SignInPage} />
        <Stack.Screen name="SignUp" component={SignUpPage} />
        <Stack.Screen name="UpdateProduct" component={UpdateProduct} />
        <Stack.Screen name="ShowUsers" component={ShowAdmins} />
        <Stack.Screen name="Notification" component={Notification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
