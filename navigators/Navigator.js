import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../views/Login";
import Register from "../views/Register";
import Upload from "../views/Upload";

const Stack = createNativeStackNavigator();

const StackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="Register"
        component={Register}
		options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="Upload"
        component={Upload}
		options={{ headerShown: false }}
	   ></Stack.Screen>
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
