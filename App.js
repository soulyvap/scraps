import { Box, NativeBaseProvider } from "native-base";
import React from "react";
import { MainProvider } from "./contexts/MainContext";
import Navigator from "./navigators/Navigator";
import ChatAll from "./views/ChatAll";
import ChatSingle from "./views/ChatSingle";

const App = () => {
  return (
    <MainProvider>
      <NativeBaseProvider>
        <Box flex={1} safeArea bgColor={"white"}>
          <Navigator />
        </Box>
      </NativeBaseProvider>
    </MainProvider>
  );
};

export default App;
