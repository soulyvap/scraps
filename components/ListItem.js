import React from "react";
import {
  Box,
  Heading,
  Avatar,
  AspectRatio,
  Image,
  Text,
  HStack,
  VStack,
  Stack,
  Pressable,
} from "native-base";
import PropTypes from "prop-types";
import { uploadsUrl } from "../utils/variables";

const ListItem = ({ navigation, singleMedia }) => {
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
                uri: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
              }}
            ></Avatar>
            <VStack>
              <Text color="#132A15" fontWeight="bold">
                Ilkka
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
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default ListItem;
