import { Box, extendTheme, Image, NativeBaseProvider, View } from "native-base";
import react, { useEffect, useState } from "react";
import { Keyboard, ScrollView, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RegisterForm from "../components/RegisterForm";

const Register = () => {
  const [keyboardShowing, setKeyboardShowing] = useState(false);

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
      Input: {
        baseStyle: {
          borderRadius: 10,
          width: "70%",
          textAlign: "center",
          bgColor: "#F9F4F1",
          borderColor: "transparent",
          alignSelf: "center",
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
          display: "flex",
          alignItems: "center",
          marginBottom: 1,
        },
      },
    },
  });

  const logoSize = 220;
  const formBoxHeight = 85;
  const picturePosition = 100 - formBoxHeight;

  return (
    <NativeBaseProvider theme={theme}>
      <View flex={1}>
        <View
          flex={1}
          bgColor={"#33CA7F"}
          display={"flex"}
          justifyContent={keyboardShowing ? "flex-start" : "flex-end"}
        >
          <Box
            height={keyboardShowing ? "100%" : formBoxHeight + "%"}
            bgColor={"white"}
            bottom={0}
            borderTopLeftRadius={keyboardShowing ? 0 : 90}
            borderTopRightRadius={keyboardShowing ? 0 : 90}
          >
            <View flex={1}></View>
            <RegisterForm />
            <View flex={0.3}></View>
          </Box>
        </View>
        {!keyboardShowing && (
          <Image
            position={"absolute"}
            source={require("../assets/logo-elevated.png")}
            alt={"scraps-logo"}
            size={logoSize}
            top={picturePosition + "%"}
            left={"50%"}
            style={
              ({},
              {
                transform: [
                  { translateX: -logoSize / 2 },
                  { translateY: -logoSize / 2 },
                ],
              })
            }
          />
        )}
      </View>
    </NativeBaseProvider>
  );
};

export default Register;
