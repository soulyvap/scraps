import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { uploadsUrl } from "../utils/variables";
import { useTag, useUser } from "../hooks/ApiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Image,
  Popover,
  ScrollView,
  Text,
  View,
  VStack,
  ZStack,
} from "native-base";

const Single = ({ route }) => {
  const { file } = route.params;
  const { getUserById } = useUser();
  const { getFilesByTag } = useTag();
  const [owner, setOwner] = useState({ username: "fetching..." });
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
  );

  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await getUserById(file.user_id, token);
      setOwner(userData);
    } catch (error) {
      console.error("fetch owner error", error);
      setOwner({ username: "[not available]" });
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag("avatar_" + file.user_id);
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
  }, [owner]);

  return (
    <Center h={"100%"} bgColor={"#33CA7F"}>
      <Box
        h={"80%"}
        w={"100%"}
        bgColor={"white"}
        borderTopLeftRadius={90}
        borderTopRightRadius={90}
        position="absolute"
        bottom="0"
      ></Box>
      <Image
        source={{ uri: uploadsUrl + file.filename }}
        borderRadius={"full"}
        size={180}
        position="absolute"
        top="5%"
        alt="image"
      ></Image>
      <VStack
        w={"100%"}
        h={"60%"}
        position="absolute"
        top={"35%"}
        alignItems={"center"}
      >
        <Heading size="lg">{file.title}</Heading>
        <Box
          bgColor={"#F9F4F1"}
          w={"50%"}
          h={"11%"}
          borderTopRightRadius="10"
          borderTopLeftRadius="10"
          shadow={9}
          alignSelf="flex-start"
          ml={"5%"}
          mt={"5%"}
        >
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
        <Box
          bgColor={"#F9F4F1"}
          w={"90%"}
          h={"50%"}
          borderTopRightRadius="10"
          borderBottomLeftRadius="10"
          borderBottomRightRadius="10"
          shadow={9}
        >
          <ScrollView showsVerticalScrollIndicator>
            <Text m={"4%"} fontSize={"18"}>
              {file.description}
              Etiam commodo efficitur justo vel finibus. Nulla laoreet sem vel
              eros egestas, id malesuada orci fringilla. Maecenas tincidunt
              tellus ipsum, quis tincidunt sem vehicula a. Fusce bibendum a quam
              et pellentesque. Pellentesque in pulvinar tortor, a convallis
              sapien. Cras ut ipsum viverra nisi dictum fermentum in at lectus.
              Integer id finibus libero. Class aptent taciti sociosqu ad litora
              torquent per conubia nostra, per inceptos himenaeos. Curabitur
              maximus felis id dui tempor sodales. Donec eu facilisis metus.
            </Text>
          </ScrollView>
        </Box>
        <Button mt={"10%"} borderRadius={"full"} bgColor={"#33CA7F"}>
          Book now
        </Button>
      </VStack>
    </Center>
  );
};

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
