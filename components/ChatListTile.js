import {
  Avatar,
  Box,
  ChevronRightIcon,
  Heading,
  HStack,
  Image,
  Text,
  View,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useComment, useMedia, useTag, useUser } from "../hooks/ApiHooks";
import { colors } from "../utils/colors";
import { avatarTag, uploadsUrl } from "../utils/variables";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatListTile = ({ chatData, onPress, update }) => {
  const [avatar, setAvatar] = useState();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const { getFilesByTag } = useTag();
  const { getMediaById } = useMedia();
  const { getUserById } = useUser();
  const { getCommentsById } = useComment();

  useEffect(async () => {
    await fetchAvatar();
    await fetchUsername();
    console.log(chatData.file_id);
    await fetchLastMessage();
  }, []);

  useEffect(async () => {
    await fetchLastMessage();
  }, [update]);

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(avatarTag + chatData.userId2);
      const avatarFetched = await avatarArray.pop();
      const fileId = avatarFetched.file_id;
      const file = await getMediaById(fileId);
      setAvatar(uploadsUrl + file.thumbnails.w160);
    } catch (error) {
      console.error("fetchAvatar", error.message);
    }
  };

  const fetchUsername = async () => {
    const token = await AsyncStorage.getItem("userToken");
    try {
      const user = await getUserById(chatData.userId2, token);
      const displayName = user.full_name || user.username;
      setUsername(displayName);
    } catch (error) {
      console.error("fetchAvatar", error.message);
    }
  };

  const fetchLastMessage = async () => {
    try {
      const comments = await getCommentsById(chatData.file_id);
      const lastMessage = comments.pop();
      lastMessage && setMessage(lastMessage.comment);
    } catch (error) {
      console.error("fetchAvatar", error.message);
    }
  };

  return (
    <TouchableOpacity w={"100%"} onPress={onPress}>
      <Box p={3} borderRadius={10} bgColor={colors.beige}>
        <HStack alignItems={"center"} space={4}>
          <Avatar
            size="md"
            source={{
              uri: avatar,
            }}
          />
          <VStack w="71%">
            <Heading fontSize="md">{username}</Heading>
            <Text numberOfLines={1} overflow={"hidden"}>
              {message}
            </Text>
          </VStack>
          <ChevronRightIcon position="absolute" right={0} size={4} />
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

export default ChatListTile;
