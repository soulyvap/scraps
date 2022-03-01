import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { useMedia, useTag } from "../hooks/ApiHooks";
import PropTypes from "prop-types";
import { avatarTag, foodPostTag, uploadsUrl } from "../utils/variables";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatGrid } from "react-native-super-grid";

const Profile = ({ navigation }) => {
  const { user } = useContext(MainContext);
  const { getFilesByTag } = useTag();
  const { userBio, setUserBio } = useState();
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
  );
  const { userMediaArray } = useMedia(user.user_id);

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(avatarTag + user.user_id);
      if (avatarArray.length === 0) {
        return;
      }
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (error) {
      console.error(error.message);
    }
  };

  // const fetchUserBio = async () => {
  //   try {
  //     const userFile = await getFilesByTag(`userfile_${user.user_id}`);
  //     console.log("userFile", userFile);
  //     const bio = JSON.parse(userFile).bio;
  //     setUserBio(bio);
  //     console.log("bio", userBio);
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  useEffect(() => {
    // fetchUserBio(),
    fetchAvatar();
  }, [avatar]);

  return (
    <Box flex="1">
      <Box position={"absolute"} top={5} left={5} w={10} h={10} zIndex={10}>
        <IconButton
          icon={<Icon as={MaterialIcons} name="arrow-back" />}
          size={7}
          color="#132A15"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </Box>
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
          {/* {userBio} */}
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
        {/* currently shows all, not just active */}
        {/* TODO: show just active listings */}
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
      </ScrollView>
    </Box>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
