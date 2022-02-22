import {
  Avatar,
  Box,
  Center,
  HStack,
  Icon,
  IconButton,
  Image,
  NativeBaseProvider,
  Stagger,
  Text,
  useDisclose,
  VStack,
} from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { useMedia, useTag } from "../hooks/ApiHooks";
import PropTypes from "prop-types";
import { uploadsUrl } from "../utils/variables";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import List from "../components/List";

const Profile = ({ navigation }) => {
  const { user } = useContext(MainContext);
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
  );
  const { getFilesByTag } = useTag();
  const { mediaArray } = useMedia();
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
  }, [avatar]);

  return (
    <NativeBaseProvider>
      {/* green background box */}
      <Box
        height={"40%"}
        bgColor={"#33CA7F"}
        borderBottomLeftRadius={90}
        borderBottomRightRadius={90}
        justifyContent={"center"}
      >
        <Center>
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
          {/* profile image */}
          <Avatar
            size={160}
            source={{
              uri: avatar,
            }}
          ></Avatar>
        </Center>
      </Box>
      <Box w={"90%"} alignSelf={"center"} my={5}>
        <Box
          backgroundColor={"#F9F4F1"}
          w={"100%"}
          h={"30%"}
          borderRadius={10}
          shadow={2}
          mb={5}
        ></Box>
        <Text fontSize={20} fontWeight={"bold"}>
          Active listings
        </Text>
        <Box>
          <List
            navigation={navigation}
            mediaArray={mediaArray}
            userFilesOnly={true}
          ></List>
        </Box>

        <Text fontSize={20} fontWeight={"bold"}>
          Reviews
        </Text>
      </Box>
      <Box position={"absolute"} right={6} bottom={6}>
        <Box alignItems="center">
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
        </HStack>
      </Box>
    </NativeBaseProvider>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
