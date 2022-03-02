import {
  Box,
  Button,
  extendTheme,
  Heading,
  NativeBaseProvider,
  TextArea,
} from "native-base";
import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { AirbnbRating } from "react-native-ratings";
import { MainContext } from "../contexts/MainContext";
import { colors } from "../utils/colors";
import { useTag } from "../hooks/ApiHooks";
import { userFileTag } from "../utils/variables";

const Review = ({ route, navigation }) => {
  //const { file } = route.params;
  const { user } = useContext(MainContext);
  const [rating, setRating] = useState(3);
  const [userRating, setUserRating] = useState(false);
  const { getFilesByTag } = useTag();

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

  //TODO: implement into profile view. button should not lead to review page if user already has rated person
  //TODO: fetch information of the userfile we're rating
  const fetchUserFile = async () => {
    try {
      const userFiles = await getFilesByTag(userFileTag);
    } catch (error) {
      console.error(error.message);
    }
  };

  const onSubmit = (data) => {
    console.log("rating onSubmit: ", rating);
  };

  return (
    <NativeBaseProvider theme={theme}>
      <Box alignItems={"center"} bgColor={"white"} flex="1" safeArea>
        <Box
          alignItems={"center"}
          bgColor={colors.beige}
          borderRadius={15}
          marginTop={"30%"}
          width={"90%"}
        >
          <Heading color={colors.notBlack} marginY={"5%"} px={4}>
            Give a review for
          </Heading>
          <AirbnbRating
            showRating={false}
            onFinishRating={(value) => {
              setRating(value);
            }}
            selectedColor={colors.yellow}
          />
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
            onPress={onSubmit}
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

Review.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Review;
