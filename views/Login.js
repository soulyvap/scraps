import {
  Box,
  Button,
  extendTheme,
  Heading,
  Image,
  NativeBaseProvider,
  Text,
  View,
} from "native-base";
import react, { useContext, useEffect, useState } from "react";
import { Keyboard } from "react-native";
import LoginForm from "../components/LoginForm";
import { useUser } from "../hooks/ApiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainContext } from "../contexts/MainContext";

const Login = ({ navigation }) => {
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const { getUserByToken } = useUser();
  const { setUser, setIsLoggedIn } = useContext(MainContext);

  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    console.log("Token in storage", userToken);
    if (userToken) {
      try {
        const userData = await getUserByToken(userToken);
        console.log("check token", userData);
        if (userData) {
          setUser(userData);
          setIsLoggedIn(true);
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardShowing(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardShowing(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const theme = extendTheme({
    components: {
      Box: {
        baseStyle: {
          alignItems: "center",
        },
      },
      Input: {
        baseStyle: {
          borderRadius: 10,
          width: "70%",
          textAlign: "center",
          bgColor: "#F9F4F1",
          borderColor: "transparent",
          marginBottom: 0,
        },
      },
      Button: {
        baseStyle: {
          borderRadius: 15,
          width: "35%",
          alignSelf: "center",
        },
      },
      FormControl: {
        baseStyle: {
          marginBottom: 1,
        },
      },
    },
  });

  const logoSize = 220;

  return (
    <NativeBaseProvider theme={theme}>
      <View flex={1} bgColor={"white"}>
        {!keyboardShowing && (
          <Box
            height={"40%"}
            bgColor={"#33CA7F"}
            borderBottomLeftRadius={90}
            borderBottomRightRadius={90}
            justifyContent={"center"}
          >
            <Image
              source={require("../assets/logo-elevated.png")}
              alt={"scraps-logo"}
              size={logoSize}
            />
          </Box>
        )}
        <View mt={10} display={"flex"} flex={1} flexDirection={"column"}>
          <Box>
            <Heading>Welcome to Scraps!</Heading>
            <Text italic>where neighbours share</Text>
          </Box>
          <View flex={1}></View>
          <LoginForm />
          <Box>
            <Text my={5}>Don't have an account yet?</Text>
            <Button
              bgColor={"#132A15"}
              onPress={() => navigation.navigate("Register")}
            >
              Sign up!
            </Button>
          </Box>
          <View flex={0.8}></View>
        </View>
      </View>
    </NativeBaseProvider>
  );
};

export default Login;
