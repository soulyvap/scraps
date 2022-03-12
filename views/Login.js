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
import { useTag, useUser } from "../hooks/ApiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainContext } from "../contexts/MainContext";
import { userFileTag } from "../utils/variables";
import { colors } from "../utils/colors";

const Login = ({ navigation }) => {
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const { getUserByToken } = useUser();
  const { setUser, setIsLoggedIn, setCoords, update } = useContext(MainContext);
  const { getFilesByTag } = useTag();

  //getting current user address coordinates from userFile then setting them in MainContext
  const fetchCoordinates = async (userId) => {
    try {
      const userFiles = await getFilesByTag(userFileTag + userId);
      const userFile = userFiles.pop();
      const description = JSON.parse(userFile.description);
      const coords = description.coords;
      setCoords(coords);
      console.log(coords);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  //checking if userToken is stored in AsyncStorage.
  //if yes, user is logged in and some info is stored in MainContext.
  const checkToken = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    console.log("Token in storage", userToken);
    if (userToken) {
      try {
        const userData = await getUserByToken(userToken);
        console.log("check token", userData);
        await fetchCoordinates(userData.user_id);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  };

  useEffect(() => {
    checkToken();
  }, [update]);

  //listener for on-screen keyboard. helps with adapting the UI when keyboard shows
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

  //theming for some components
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
          _focus: { borderColor: colors.green },
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
