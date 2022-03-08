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
  useDisclose,
  View,
  VStack,
} from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { useMedia, useTag, useUser } from "../hooks/ApiHooks";
import PropTypes from "prop-types";
import {
  avatarTag,
  uploadsUrl,
  defaultAvatar,
  userFileTag,
  baseUrl,
  foodPostTag,
} from "../utils/variables";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatGrid } from "react-native-super-grid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainContext } from "../contexts/MainContext";
import StarIcon from "../components/StarIcon";
import { colors } from "../utils/colors";
import ReviewTile from "../components/ReviewTile";

const Profile = ({ navigation, route }) => {
  const { file } = route.params;
  const { getUserById } = useUser();
  const { getFilesByTag, getTagsByFileId } = useTag();
  const [owner, setOwner] = useState({ username: "fetching..." });
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [userMediaArray, setUserMediaArray] = useState([]);
  const [userBio, setUserBio] = useState();

  const fetchUserMedia = async (owner) => {
    try {
      // fetch all posts with app post tag
      let json = await getFilesByTag(foodPostTag);
      // filter only those that match the profile owner's id
      json = json.filter((file) => file.user_id === owner.user_id);
      const media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(baseUrl + "media/" + item.file_id);
          const mediaData = await response.json();
          return mediaData;
        })
      );
      // filter it even more by removing those items that are booked already = not active
      const activeListings = [];
      const active = await Promise.all(
        media.map(async (post) => {
          const fileId = post.file_id;
          const tags = await getTagsByFileId(fileId);
          const lastTag = tags.pop();
          if (lastTag.tag !== "booked") {
            activeListings.push(post);
          }
        })
      );
      setUserMediaArray(activeListings);
    } catch (error) {
      console.error("Problem fetching user files from API", error);
    }
  };

  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await getUserById(file.user_id, token);
      setOwner(userData);
      console.log(owner);
    } catch (error) {
      console.error("fetch owner error", error);
      setOwner({ username: "[not available]" });
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(avatarTag + file.user_id);
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
      const userFiles = await getFilesByTag(userFileTag + file.user_id);
      const userFile = userFiles[0];
      const descriptionData = userFile.description;
      const allData = JSON.parse(descriptionData);
      const bio = allData.bio;
      setUserBio(bio);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchOwner();
    setOwner(owner);
  }, []);

  useEffect(() => {
    fetchAvatar();
    setAvatar(avatar);
    fetchUserBio();
    setUserBio(userBio);
    fetchUserMedia(owner);
    setUserMediaArray(userMediaArray);
  }, [owner]);

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
          {owner.username}
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
        <HStack alignSelf={"center"} w={"90%"} justifyContent={"space-evenly"}>
          <Button
            bgColor={"#FED766"}
            w={"40%"}
            alignSelf="center"
            mb={5}
            mr={5}
          >
            <HStack alignItems={"baseline"}>
              <Icon
                as={MaterialIcons}
                name="message"
                size={5}
                color="#132A15"
              ></Icon>
              <Text color={"#132A15"} fontWeight={"bold"} ml={1}>
                Message
              </Text>
            </HStack>
          </Button>
          <Button
            bgColor={"#FED766"}
            w={"40%"}
            alignSelf="center"
            mb={5}
            onPress={() => {
              navigation.navigate("Review", {
                targetId: file.user_id,
                targetUser: owner.username,
              });
            }}
          >
            <HStack alignItems={"baseline"}>
              <Icon
                as={MaterialIcons}
                name="star"
                size={5}
                color="#132A15"
              ></Icon>
              <Text color={"#132A15"} fontWeight={"bold"} ml={1}>
                Review
              </Text>
            </HStack>
          </Button>
        </HStack>
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
        <ReviewTile />
      </ScrollView>
    </Box>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
  file: PropTypes.object,
};

export default Profile;
