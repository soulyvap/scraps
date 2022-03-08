import {
  Avatar,
  Heading,
  HStack,
  IconButton,
  Input,
  Text,
  View,
  VStack,
} from "native-base";
import { Rating } from "react-native-ratings";
import ChatBubbleList from "../components/ChatBubbleList";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/colors";
import BackButton from "../components/BackButton";
import React, { useContext, useEffect, useState } from "react";
import {
  useComment,
  useMedia,
  useRating,
  useTag,
  useUser,
} from "../hooks/ApiHooks";
import {
  avatarTag,
  chatTag,
  uploadsUrl,
  userFileTag,
} from "../utils/variables";
import userFileImage from "../assets/a.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainContext } from "../contexts/MainContext";
import { Image, Keyboard } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const ChatSingle = ({ route, navigation }) => {
  const userId2 = route.params.userId2;

  const [messages, setMessages] = useState();

  const [update, setUpdate] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [userFileId, setUserFileId] = useState();
  const [chatFileId, setChatFileId] = useState();
  const [username, setUsername] = useState();
  const [rating, setRating] = useState();
  const [avatar, setAvatar] = useState();

  const { getUserById } = useUser();
  const { getFilesByTag, postTag } = useTag();
  const { getRatingsById } = useRating();
  const { postMedia } = useMedia();
  const { getCommentsById, postComment } = useComment();
  const { user } = useContext(MainContext);

  //updating chat messages every 7 seconds this view is focused
  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(() => {
        chatFileId && setUpdate(update + 1);
      }, 7000);

      return () => {
        clearInterval(interval);
      };
    })
  );

  useEffect(() => {
    fetchUsername();
    fetchAvatar();
    fetchUserFile();
    fetchChatFile();
  }, []);

  useEffect(() => {
    if (update > 0) {
      chatFileId && fetchMessages(chatFileId);
    }
  }, [update]);

  //fetch the username of the other user
  const fetchUsername = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const user = await getUserById(userId2, userToken);
      setUsername(user.full_name || user.username);
    } catch (error) {
      console.error("fetchUsername", error);
    }
  };

  //fetch the avatar of the other user
  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(avatarTag + userId2);
      const avatarFetched = await avatarArray.pop();
      setAvatar(uploadsUrl + avatarFetched.filename);
    } catch (error) {
      console.error("fetchAvatar", error.message);
    }
  };

  //fetch the other user's userfile to get their rating
  const fetchUserFile = async () => {
    try {
      const userFiles = await getFilesByTag(userFileTag + userId2);
      const userFile = userFiles[0];
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

  //finding the right chatfile among all the chatfiles that contain the current user's id in their title.
  const findChatFile = (array) => {
    const currentUserId = user.user_id;
    return array.find(
      (file) =>
        file.title === `${currentUserId}_${userId2}` ||
        file.title === `${userId2}_${currentUserId}`
    );
  };

  //fetching the relevant chatfile if it exists (the users have already chatted in the past).
  //a chatfile is just a file that represents a conversation between two users.
  //the two users can comment on that file to chat with each other.
  const fetchChatFile = async () => {
    try {
      const chatFiles = await getFilesByTag(chatTag);
      const currentChatFile = findChatFile(chatFiles);
      if (currentChatFile) {
        const currentChatFileId = currentChatFile.file_id;
        setChatFileId(currentChatFileId);
        await fetchMessages(currentChatFileId);
      } else {
        console.log("need to create chat file");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  //creates a new chat file containing both user ids in its title.
  const createChatFile = async () => {
    const currentUserId = user.user_id;
    const userToken = await AsyncStorage.getItem("userToken");
    const formData = new FormData();
    formData.append("title", `${currentUserId}_${userId2}`);
    const userFileUri = Image.resolveAssetSource(userFileImage).uri;
    formData.append("file", {
      uri: userFileUri,
      name: "a.jpg",
      type: "image/jpg",
    });
    try {
      const response = await postMedia(formData, userToken);
      if (response) {
        await addChatTag(response.file_id);
        console.log("create", response.file_id);
        setChatFileId(response.file_id);
        await sendMessage(inputValue, response.file_id);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  //posting a tag that identifies all the chatfiles of Scraps
  const addChatTag = async (fileId) => {
    const userToken = await AsyncStorage.getItem("userToken");
    try {
      const tagData = {
        file_id: fileId,
        tag: chatTag,
      };
      const response = await postTag(tagData, userToken);
      response && console.log("tag added", tagData.tag);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  //fetching all the comments related to a chatfile. they are used to represent chat messages.
  const fetchMessages = async (chatFileId) => {
    const currentUserId = user.user_id;
    try {
      const fetchedComments = await getCommentsById(chatFileId);
      if (fetchedComments.length > 0) {
        const formattedMessages = fetchedComments.map((comment) => {
          return {
            key: comment.comment_id,
            myMessage: comment.user_id === currentUserId,
            content: comment.comment,
          };
        });
        setMessages([...formattedMessages]);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  //on send, checks if a chatfile is already set. if not, a new file is created and the message is sent.
  const handleSend = async () => {
    if (chatFileId) {
      await sendMessage(inputValue, chatFileId);
    } else {
      console.log("create");
      await createChatFile();
    }
  };

  //adds a comment to the current chatfile. these are used to represent chat messages
  const sendMessage = async (text, fileId) => {
    const userToken = await AsyncStorage.getItem("userToken");
    console.log(fileId);
    try {
      if (text.length > 0) {
        const commentData = {
          file_id: fileId,
          comment: text,
        };
        await postComment(commentData, userToken);
        await fetchMessages(fileId);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  //handling UI changes when on-screen keyboard is showing
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardShowing(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardShowing(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View flex={1} px={3} bgColor="white">
      {!keyboardShowing && (
        <BackButton
          top={2}
          left={2}
          onPress={() => {
            navigation.goBack();
          }}
        />
      )}
      {!keyboardShowing && (
        <HStack
          h={"25%"}
          alignItems={"center"}
          justifyContent="center"
          space={6}
        >
          {avatar && (
            <Avatar
              size="xl"
              shadow="6"
              source={{
                uri: avatar,
              }}
            />
          )}
          <VStack>
            {username && <Heading fontSize="2xl">{username}</Heading>}
            {rating ? (
              <Rating readonly={true} startingValue={rating} imageSize={15} />
            ) : (
              <Text>No ratings yet</Text>
            )}
          </VStack>
        </HStack>
      )}
      {keyboardShowing && (
        <Heading fontSize={"xl"} w={"100%"} textAlign="center">
          {username}
        </Heading>
      )}
      <View flex={0.9} mt={3}>
        {messages && username && chatFileId && (
          <ChatBubbleList messages={messages} username={username} />
        )}
      </View>

      <View
        w={"100%"}
        flexDirection="row"
        alignSelf="center"
        borderRadius={10}
        p={1}
        bgColor={colors.beige}
        position="absolute"
        bottom={0}
        zIndex={1000}
      >
        <Input
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          flex={1}
          variant="underlined"
          multiline
          borderRadius={10}
          placeholder="New message.."
          borderBottomColor={colors.grey}
          fontSize="sm"
          InputRightElement={
            <IconButton
              onPress={async () => {
                await handleSend();
                setInputValue("");
              }}
              bgColor={colors.green}
              size="lg"
              borderRadius={"full"}
              variant={"solid"}
              text
              _icon={{ as: Ionicons, name: "send", size: 3 }}
            />
          }
        />
      </View>
    </View>
  );
};

export default ChatSingle;
