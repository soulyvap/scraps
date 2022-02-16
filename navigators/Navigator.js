import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../views/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Single from "../views/Single";
import Login from "../views/Login";
import Register from "../views/Register";
import { MainContext } from "../contexts/MainContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#33CA7F" },
        tabBarActiveTintColor: "#FED766",
        tabBarInactiveTintColor: "#132A15",
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const { isLoggedIn } = useContext(MainContext);

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            flex={1}
            name="HomeScreen"
            component={TabScreen}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen name="Single" component={Single}></Stack.Screen>
        </>
      ) : (
        <>
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
        </>
      )}
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
