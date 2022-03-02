import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../views/Home";
import Upload from "../views/Upload";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Single from "../views/Single";
import Login from "../views/Login";
import Register from "../views/Register";
import Profile from "../views/Profile";
import MyProfile from "../views/MyProfile";
import { MainContext } from "../contexts/MainContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Icon } from "native-base";
import ChatSingle from "../views/ChatSingle";
import ChatAll from "../views/ChatAll";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#33CA7F" },
        tabBarActiveTintColor: "#FED766",
        tabBarInactiveTintColor: "#132A15",
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Upload") {
            iconName = "file-upload";
          } else if (route.name === "MyProfile") {
            iconName = "account-circle";
          }
          if (route.name === "Chat") {
            iconName = "chat";
          }
          return (
            <Icon
              as={<MaterialIcons name={iconName} />}
              size={9}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      ></Tab.Screen>
      <Tab.Screen
        name="Chat"
        component={ChatAll}
        options={{ headerShown: false }}
      ></Tab.Screen>
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{ headerShown: false }}
      ></Tab.Screen>
      <Tab.Screen
        name="MyProfile"
        component={MyProfile}
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
            name="HomeScreen"
            component={TabScreen}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="Single"
            component={Single}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="MyProfile"
            component={TabScreen}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="ChatSingle"
            component={ChatSingle}
            options={{ headerShown: false }}
          ></Stack.Screen>
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