import { Box, extendTheme, NativeBaseProvider } from "native-base";
import React from "react";
import { MainProvider } from "./contexts/MainContext";
import Navigator from "./navigators/Navigator";
import BookingSummary from "./views/BookingSummary";
import ChatAll from "./views/ChatAll";
import ChatSingle from "./views/ChatSingle";
import ConfirmBooking from "./views/ConfirmBooking";
import { MenuProvider } from "react-native-popup-menu";
import { colors } from "./utils/colors";

const App = () => {
  const theme = extendTheme({
    components: {
      Input: {
        baseStyle: {
          _focus: { borderColor: colors.green },
        },
      },
    },
  });

  return (
    <MenuProvider backHandler={true}>
      <MainProvider>
        <NativeBaseProvider theme={theme}>
          <Box flex={1} safeArea bgColor={"white"}>
            <Navigator />
          </Box>
        </NativeBaseProvider>
      </MainProvider>
    </MenuProvider>
  );
};

export default App;
