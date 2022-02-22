import { Box, NativeBaseProvider } from "native-base";
import React from "react";
import { MainProvider } from "./contexts/MainContext";
import Navigator from "./navigators/Navigator";
import ChatAll from "./components/ChatAll";
import Chat from "./views/Chat";

const App = () => {
  return (
    <MainProvider>
      <NativeBaseProvider>
        <Box flex={1} safeArea bgColor={"white"}>
          {/* <Navigator /> */}
          <Chat />
        </Box>
      </NativeBaseProvider>
    </MainProvider>
  );
};

export default App;
