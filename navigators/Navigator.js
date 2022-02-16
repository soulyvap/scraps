import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../views/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Single from "../views/Single";

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
  return (
    <Stack.Navigator>
      <Stack.Screen
        flex={1}
        name="HomeScreen"
        component={TabScreen}
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen name="Single" component={Single}></Stack.Screen>
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
