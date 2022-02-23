import React, { useEffect, useState } from "react";
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
import { uploadsUrl } from "../utils/variables";
import { useTag, useUser } from "../hooks/ApiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: currently just the entire card is pressable and takes you to single item.
// needs to be changed so that by clicking on avatar, it would take you to profile page
const ListItem = ({ navigation, singleMedia }) => {
  const { getUserById } = useUser();
  const { getFilesByTag } = useTag();
  const [owner, setOwner] = useState({ username: "fetching..." });
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
  );

  const fetchOwner = async () => {
    try {
      // TODO: change token when login ready
      const token = await AsyncStorage.getItem("userToken");
      const userData = await getUserById(singleMedia.user_id, token);
      setOwner(userData);
    } catch (error) {
      console.error("fetch owner error", error);
      setOwner({ username: "[not available]" });
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag("avatar_" + singleMedia.user_id);
      if (avatarArray.length === 0) {
        return;
      }
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchOwner();
    fetchAvatar();
  }, []);

  return (
    <Pressable
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
          <AspectRatio w="100%" ratio={1 / 1}>
            <Image
              source={{ uri: uploadsUrl + singleMedia.thumbnails?.w160 }}
              alt="image"
            />
          </AspectRatio>
          <Box
            position="absolute"
            top="0"
            px="3"
            py="1.5"
            backgroundColor="#F9f4f1"
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
            <Avatar
              marginRight="2"
              size="sm"
              source={{
                uri: avatar,
              }}
            ></Avatar>
            <VStack>
              <Text color="#132A15" fontWeight="bold">
                {owner.username}
              </Text>
              <Text color="#132A15" fontWeight="400">
                5 stars
              </Text>
            </VStack>
          </HStack>
        </Box>
        <Box w="150" h="50" alignItems="center" justifyContent="center">
          <Heading size="md" color="#132A15" textAlign="center">
            {singleMedia.title}
          </Heading>
        </Box>
      </Box>
    </Pressable>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default ListItem;
