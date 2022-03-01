import {
  Box,
  Button,
  extendTheme,
  Heading,
  HStack,
  NativeBaseProvider,
  ScrollView,
  Text,
  TextArea,
} from "native-base";
import { AirbnbRating, Rating } from "react-native-ratings";
import PostForm from "../components/PostForm";
import { colors } from "../utils/colors";
import { userFileTag } from "../utils/variables";

const Review = ({ navigation }) => {
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
      <Box alignItems={"center"} bgColor={"white"} flex="1" safeArea>
        <Box
          alignItems={"center"}
          bgColor={colors.beige}
          borderRadius={15}
          marginTop={"30%"}
          width={"95%"}
        >
          <Heading color={colors.notBlack} marginY={"5%"} px={4}>
            Give a review for
          </Heading>
          <AirbnbRating showRating={false} selectedColor={colors.yellow} />
          <TextArea
            bgColor={"white"}
            borderWidth={0}
            marginY={"5%"}
            p={3}
            width={"90%"}
          />
          <Button
            alignSelf={"flex-end"}
            bgColor={colors.red}
            borderRadius={15}
            marginBottom={"5%"}
            marginRight={"5%"}
            padding={"3%"}
            width={"40%"}
          >
            Send review
          </Button>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default Review;
