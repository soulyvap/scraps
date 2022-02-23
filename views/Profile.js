import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  NativeBaseProvider,
  Pressable,
  ScrollView,
  Stagger,
  Text,
  useDisclose,
  View,
  VStack,
} from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { useMedia, useTag } from "../hooks/ApiHooks";
import PropTypes from "prop-types";
import { uploadsUrl } from "../utils/variables";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatGrid } from "react-native-super-grid";

const Profile = ({ navigation }) => {
  const { user } = useContext(MainContext);
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
  );
  const { getFilesByTag } = useTag();
  const { userMediaArray } = useMedia();
  const { isOpen, onToggle } = useDisclose();

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag("avatar_" + user.user_id);
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
    fetchAvatar();
  }, []);

  return (
    <Box flex="1">
      <VStack bgColor={"#33CA7F"} alignItems={"center"} mb={5}>
        <Text fontSize={30} fontWeight={"bold"}>
          {user.username}
        </Text>
        {/* rating stars */}
        <HStack marginBottom={5}>
          <Icon
            as={MaterialIcons}
            name="star-outline"
            size={5}
            color="#FED766"
          ></Icon>
          <Icon
            as={MaterialIcons}
            name="star-outline"
            size={5}
            color="#FED766"
          ></Icon>
          <Icon
            as={MaterialIcons}
            name="star-outline"
            size={5}
            color="#FED766"
          ></Icon>
          <Icon
            as={MaterialIcons}
            name="star-outline"
            size={5}
            color="#FED766"
          ></Icon>
          <Icon
            as={MaterialIcons}
            name="star-outline"
            size={5}
            color="#FED766"
          ></Icon>
        </HStack>
      </VStack>
      <ScrollView>
        {/* profile image */}
        <Avatar
          alignSelf={"center"}
          size={180}
          source={{
            uri: avatar,
          }}
          marginBottom={5}
        ></Avatar>
        {/* user's bio */}
        <Box
          alignSelf={"center"}
          backgroundColor={"#F9F4F1"}
          w={"90%"}
          borderRadius={10}
          shadow={2}
          mb={5}
          _text={{
            m: 3,
            fontSize: 18,
            fontWeight: "medium",
            color: "#132A15",
          }}
        >
          This is my bio. I am so awesome. I make great food. Please eat my
          food.
        </Box>
        <Button bgColor={"#FED766"} w={"40%"} alignSelf="center" mb={5}>
          <HStack>
            <Icon
              as={MaterialIcons}
              name="settings"
              size={5}
              color="#132A15"
            ></Icon>
            <Text color={"#132A15"} fontWeight={"bold"} ml={1}>
              Edit profile
            </Text>
          </HStack>
        </Button>
        {/* user's listings */}
        <Text fontSize={20} fontWeight={"bold"} px={5}>
          Active listings ({userMediaArray.length})
        </Text>
        <Box w={"90%"} alignSelf={"center"}>
          <FlatGrid
            horizontal={true}
            itemDimension={200}
            height={100}
            data={userMediaArray}
            keyExtractor={(item) => item.file_id.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  navigation.navigate("Single", { file: item });
                }}
              >
                <Avatar
                  source={{ uri: uploadsUrl + item.thumbnails?.w160 }}
                  size={"lg"}
                ></Avatar>
              </Pressable>
            )}
          />
        </Box>
        <Text fontSize={20} fontWeight={"bold"} px={5}>
          Reviews
        </Text>
        <Text fontSize={16} px={5}>
          Reviews will be placed here.
        </Text>
        <Box position={"absolute"} right={6} top={6}>
          {/* <Box alignItems="center">
          <Stagger
            visible={isOpen}
            initial={{
              opacity: 0,
              scale: 0,
              translateY: 34,
            }}
            animate={{
              translateY: 0,
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                mass: 0.8,
                stagger: {
                  offset: 30,
                  reverse: true,
                },
              },
            }}
            exit={{
              translateY: 34,
              scale: 0.5,
              opacity: 0,
              transition: {
                duration: 100,
                stagger: {
                  offset: 30,
                  reverse: true,
                },
              },
            }}
          >
            <IconButton
              mb={4}
              padding={6}
              alignItems="center"
              justifyContent="center"
              variant="solid"
              borderRadius="full"
              background="#FED766"
              _icon={{
                color: "#132A15",
              }}
              icon={<Icon as={MaterialIcons} name="settings" />}
              size={7}
              // onPress={() => navigation.goBack()}
            />
            <IconButton
              mb={4}
              padding={6}
              alignItems="center"
              justifyContent="center"
              variant="solid"
              borderRadius="full"
              background="#FED766"
              _icon={{
                color: "#132A15",
              }}
              icon={<Icon as={MaterialIcons} name="star-outline" />}
              size={7}
              // onPress={() => navigation.goBack()}
            />
            <IconButton
              mb={4}
              padding={6}
              alignItems="center"
              justifyContent="center"
              variant="solid"
              borderRadius="full"
              background="#FED766"
              _icon={{
                color: "#132A15",
              }}
              icon={
                <Icon as={MaterialCommunityIcons} name="message-text-outline" />
              }
              size={7}
              // onPress={() => navigation.goBack()}
            />
          </Stagger>
        </Box>
        <HStack alignItems="center">
          <IconButton
            variant="solid"
            borderRadius="full"
            size="lg"
            onPress={onToggle}
            bg="#132A15"
            _icon={{
              color: "#F9F4F1",
            }}
            icon={
              <Icon
                as={MaterialCommunityIcons}
                size="6"
                name="dots-horizontal"
              />
            }
          />
        </HStack> */}
        </Box>
      </ScrollView>
    </Box>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
