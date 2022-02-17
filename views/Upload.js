import { Box, extendTheme, NativeBaseProvider, ScrollView } from "native-base";
import { StyleSheet } from "react-native";
import PostForm from "../components/PostForm";

const Upload = () => {
  const theme = extendTheme({
    components: {
      Input: {
        variants: {
          basic: {
            bgColor: "#F9F4F1",
            borderColor: "transparent",
            borderRadius: 15,
            marginBottom: "5%",
            textAlign: "center",
          },
        },
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <Box flex="1" safeAreaTop>
        <ScrollView px="5%" bgColor={"white"}>
          <PostForm />
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
};

export default Upload;
