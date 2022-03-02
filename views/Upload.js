import { Box, extendTheme, NativeBaseProvider, ScrollView } from "native-base";
import PostForm from "../components/PostForm";
import { colors } from "../utils/colors";

const Upload = ({ navigation }) => {
  const theme = extendTheme({
    components: {
      Input: {
        variants: {
          basic: {
            bgColor: "#F9F4F1",
            borderColor: "transparent",
            borderRadius: 15,
            textAlign: "center",
            shadow: "6",
          },
        },
      },
      Button: {
        baseStyle: {
          borderRadius: 15,
        },
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <Box flex="1" safeArea bgColor={"white"}>
        <ScrollView bgColor={"white"}>
          <PostForm navigation={navigation} />
        </ScrollView>
      </Box>
    </NativeBaseProvider>
  );
};

export default Upload;
