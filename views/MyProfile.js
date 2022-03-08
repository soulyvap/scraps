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
  TextArea,
  View,
  VStack,
} from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { useMedia, useTag } from "../hooks/ApiHooks";
import PropTypes from "prop-types";
import { avatarTag, foodPostTag, uploadsUrl } from "../utils/variables";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatGrid } from "react-native-super-grid";
import { userFileTag } from "../utils/variables";
import LogoutButton from "../components/LogoutButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../utils/colors";
import StarIcon from "../components/StarIcon";
import LottieView from "lottie-react-native";

const Profile = ({ navigation }) => {
  const { user, setIsLoggedIn } = useContext(MainContext);
  const { getFilesByTag, getTagsByFileId } = useTag();
  const [userBio, setUserBio] = useState();
  const [avatar, setAvatar] = useState();
  const [activeListings, setActiveListings] = useState([]);
  const { userMediaArray } = useMedia();

  const filterActive = async () => {
    const activeListings = [];
    const active = await Promise.all(
      userMediaArray.map(async (post) => {
        const fileId = post.file_id;
        const tags = await getTagsByFileId(fileId);
        const lastTag = tags.pop();
        if (lastTag.tag !== "booked") {
          activeListings.push(post);
        }
      })
    );
    setActiveListings(activeListings);
  };

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

  const fetchUserBio = async () => {
    try {
      const userFiles = await getFilesByTag(userFileTag + user.user_id);
      console.log(userFiles);
      const userFile = userFiles.pop();
      const descriptionData = userFile.description;
      const allData = JSON.parse(descriptionData);
      const bio = allData.bio;
      setUserBio(bio);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAvatar(user);
    setAvatar(avatar);
    fetchUserBio(user);
    setUserBio(userBio);
  }, [user]);

  useEffect(() => {
    filterActive(userMediaArray);
    setActiveListings([]);
  }, [userMediaArray]);

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
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
          <StarIcon />
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
          {userBio}
        </Box>
        <Button
          bgColor={"#FED766"}
          w={"40%"}
          alignSelf="center"
          mb={5}
          onPress={() => {
            navigation.navigate("UpdateUser");
          }}
        >
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
        <LogoutButton top={0} right={5}></LogoutButton>
        {/* user's listings */}
        <Text fontSize={20} fontWeight={"bold"} px={5}>
          Active listings ({activeListings.length})
        </Text>
        <Box w={"90%"} alignSelf={"center"}>
          <FlatGrid
            horizontal={true}
            itemDimension={200}
            height={100}
            data={activeListings}
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
            ListEmptyComponent={
              <HStack alignItems={"baseline"} alignSelf={"flex-start"} flex={1}>
                <LottieView
                  autoPlay
                  loop={true}
                  style={{ width: 50, height: 50 }}
                  source={require("../assets/cooking.json")}
                  speed={1}
                />
                <Text
                  color={colors.notBlack}
                  fontSize={17}
                  width={"80%"}
                  ml={2}
                >
                  Better start cooking!
                </Text>
              </HStack>
            }
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
