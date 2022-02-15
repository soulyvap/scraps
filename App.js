import { Box, NativeBaseProvider } from "native-base";
import react from "react";
import Navigator from "./navigators/Navigator";

const App = () => {
  return (
    <NativeBaseProvider>
      <Box flex={1} safeArea bgColor={"white"}>
        <Navigator />
      </Box>
    </NativeBaseProvider>
  );
};

export default App;
