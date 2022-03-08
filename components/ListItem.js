import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Heading,
  Avatar,
  AspectRatio,
  Image,
  Text,
  HStack,
  VStack,
  Pressable,
} from "native-base";
import PropTypes from "prop-types";
import {
  avatarTag,
  uploadsUrl,
  defaultAvatar,
  userFileTag,
} from "../utils/variables";
import { useRating, useTag, useUser } from "../hooks/ApiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainContext } from "../contexts/MainContext";

const ListItem = ({ navigation, singleMedia }) => {
  const { getUserById } = useUser();
  const { getFilesByTag } = useTag();
  const { getRatingsById } = useRating();
  const [owner, setOwner] = useState({ username: "fetching..." });
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [rating, setRating] = useState();
  const { update, setUpdate, user } = useContext(MainContext);

  const fetchOwner = async () => {
    try {
      // TODO: change token when login ready
      const token = await AsyncStorage.getItem("userToken");
      const userData = await getUserById(singleMedia.user_id, token);
      setOwner(userData) && setUpdate(update + 1);
    } catch (error) {
      console.error("fetch owner error", error);
      setOwner({ username: "[not available]" });
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(avatarTag + singleMedia.user_id);
      if (avatarArray.length === 0) {
        return;
      }
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename) && setUpdate(update + 1);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchRating = async () => {
    try {
      const userFiles = await getFilesByTag(userFileTag + singleMedia.user_id);
      const userFile = userFiles[0];
      const ratingList = await getRatingsById(userFile.file_id);
      if (ratingList.length > 0) {
        const ratings = ratingList.map((rating) => rating.rating);
        const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        setRating(average);
      } else {
        setRating(null);
      }
    } catch (error) {
      console.error("fetchUserFile", error.message);
    }
  };

  useEffect(() => {
    fetchOwner();
    fetchAvatar();
    fetchRating();
  }, []);

  return (
    <Box
      alignItems="center"
      onPress={() => {
        navigation.navigate("Single", { file: singleMedia });
      }}
    >
      <Box
        w="150"
        h="200"
        rounded="lg"
        overflow="hidden"
        borderColor={"#898980"}
        shadow={4}
        backgroundColor={"#F9F4F1"}
        borderWidth="1"
      >
        <Box>
          <Pressable
            onPress={() => {
              navigation.navigate("Single", { file: singleMedia });
            }}
          >
            <AspectRatio w="100%" ratio={1 / 1}>
              <Image
                source={{ uri: uploadsUrl + singleMedia.thumbnails?.w160 }}
                alt="image"
              />
            </AspectRatio>
          </Pressable>

          <Box
            position="absolute"
            top="0"
            px="3"
            py="1.5"
            backgroundColor="#F9F4F1"
            width="100%"
            height="12"
            opacity="70"
          ></Box>
          <HStack
            alignItems="center"
            position="absolute"
            top="0"
            px="3"
            py="1.5"
            width="100%"
          >
            <Pressable
              onPress={() => {
                if (user.user_id === owner.user_id) {
                  navigation.navigate("MyProfile");
                } else {
                  navigation.navigate("Profile", {
                    file: singleMedia,
                  });
                }
              }}
            >
              <Avatar
                marginRight="2"
                size="sm"
                source={{
                  uri: avatar,
                }}
              ></Avatar>
            </Pressable>
            <VStack>
              <Text color="#132A15" fontWeight="bold">
                {owner.username}
              </Text>
              <Text color="#132A15" fontWeight="400">
                {rating ? `${rating} stars` : "not rated yet"}
              </Text>
            </VStack>
          </HStack>
        </Box>
        <Box w="150" h="50" alignItems="center" justifyContent="center" px={1}>
          <Heading
            size="sm"
            color="#132A15"
            textAlign="center"
            numberOfLines={1}
          >
            {singleMedia.title}
          </Heading>
        </Box>
      </Box>
    </Box>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default ListItem;
