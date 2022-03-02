import {
  Box,
  Button,
  extendTheme,
  Heading,
  NativeBaseProvider,
  TextArea,
} from "native-base";
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from "prop-types";
import { AirbnbRating } from "react-native-ratings";
import { MainContext } from "../contexts/MainContext";
import { colors } from "../utils/colors";
import { useRating, useTag } from "../hooks/ApiHooks";
import { userFileTag } from "../utils/variables";

let targetFileId;

const Review = ({ route, navigation }) => {
  const { targetId } = route.params;
  const { user } = useContext(MainContext);
  const [rating, setRating] = useState(3);
  const { getFilesByTag } = useTag();
  const { getRatingsByFileId, postRating, deleteRating } = useRating();

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

  useEffect(() => {
    targetFileId = undefined;
  }, []);

  useEffect(() => {
    fetchUserFile();
  }, []);

  const fetchUserFile = async () => {
    try {
      const userFiles = await getFilesByTag(userFileTag + targetId);
      const userFile = userFiles[0];
      targetFileId = userFile.file_id;
    } catch (error) {
      console.error(error.message);
    }
  };

  const onSubmit = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const ratingArray = await getRatingsByFileId(targetFileId);
      ratingArray
        .filter((e) => e.user_id === user.user_id)
        .forEach(async (rating) => {
          await deleteRating(rating.file_id, userToken);
        });
      const response = await postRating(targetFileId, rating, userToken);
      response &&
        Alert.alert("Review saved or something", "Well done, you made it.", [
          {
            text: "Ok",
            onPress: () => {
              navigation.navigate("Home");
            },
          },
        ]);
    } catch (error) {
      console.error(error.message);
    }
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
