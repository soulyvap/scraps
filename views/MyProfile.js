import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
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
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { Rating } from "react-native-ratings";
import { FlatGrid } from "react-native-super-grid";
import LogoutButton from "../components/LogoutButton";
import ReviewList from "../components/ReviewList";
import { MainContext } from "../contexts/MainContext";
import { useMedia, useRating, useTag } from "../hooks/ApiHooks";
import { colors } from "../utils/colors";
import { avatarTag, uploadsUrl, userFileTag } from "../utils/variables";

const Profile = ({ navigation }) => {
  const { user, update } = useContext(MainContext);
  const { getFilesByTag, getTagsByFileId } = useTag();
  const { getRatingsById } = useRating();
  const [userFileId, setUserFileId] = useState();
  const [userBio, setUserBio] = useState();
  const [reviewCount, setReviewCount] = useState(0);
  const [rating, setRating] = useState();
  const [avatar, setAvatar] = useState();
  const [activeListings, setActiveListings] = useState([]);
  const { userMediaArray } = useMedia();

  // filter out booked listings so they wouldn't be displayed
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

  // fetch file that contains additional user details
  // user bio is located in userfile
  const fetchUserFile = async () => {
    try {
      const userFiles = await getFilesByTag(userFileTag + user.user_id);
      const userFile = userFiles[0];
      const descriptionData = userFile.description;
      const allData = JSON.parse(descriptionData);
      const bio = allData.bio;
      setUserBio(bio);
      setUserFileId(userFile.file_id);
      await fetchRating(userFile.file_id);
    } catch (error) {
      console.error("fetchUserFile", error.message);
    }
  };

  const fetchRating = async (userFileId) => {
    try {
      const ratingList = await getRatingsById(userFileId);
      const ratings = ratingList.map((rating) => rating.rating);
      const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      setRating(average);
    } catch (error) {
      console.error("fetchRating", error.message);
    }
  };

  useEffect(() => {
    fetchAvatar(user);
    setAvatar(avatar);
    fetchUserFile();
    setUserBio(userBio);
  }, [user, update]);

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
          {rating ? (
            <Rating
              startingValue={rating}
              imageSize={15}
              readonly={true}
              tintColor={colors.green}
              type="custom"
              ratingBackgroundColor={colors.grey}
              ratingColor={colors.yellow}
            />
          ) : (
            <Text>Not rated yet</Text>
          )}
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
        <Text fontSize={20} fontWeight={"bold"} px={5} mb={2}>
          Reviews ({reviewCount})
        </Text>
        {userFileId && (
          <ReviewList userFileId={userFileId} setReviewCount={setReviewCount} />
        )}
      </ScrollView>
    </Box>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
