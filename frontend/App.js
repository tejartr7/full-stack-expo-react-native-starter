import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/Home'
import Auth from './screens/Auth'
import AddProduct from './screens/Addproduct';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="auth" component={Auth} />
        <Stack.Screen name="addProduct" component={AddProduct} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;