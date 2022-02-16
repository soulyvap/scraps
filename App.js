import { Box, NativeBaseProvider } from "native-base";
import react from "react";
import { MainProvider } from "./contexts/MainContext";
import Navigator from "./navigators/Navigator";

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
