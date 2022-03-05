import { Box, NativeBaseProvider } from "native-base";
import React from "react";
import { MainProvider } from "./contexts/MainContext";
import Navigator from "./navigators/Navigator";
import BookingSummary from "./views/BookingSummary";
import ChatAll from "./views/ChatAll";
import ChatSingle from "./views/ChatSingle";
import ConfirmBooking from "./views/ConfirmBooking";
import { MenuProvider } from "react-native-popup-menu";

const App = () => {
  return (
    <MenuProvider backHandler={true}>
      <MainProvider>
        <NativeBaseProvider>
          <Box flex={1} safeArea bgColor={"white"}>
            <Navigator />
          </Box>
        </NativeBaseProvider>
      </MainProvider>
    </MenuProvider>
  );
};

export default App;
