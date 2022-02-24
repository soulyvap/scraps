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

const messages = [
  {
    key: "chat1",
    myMessage: true,
    content: "Hi! Thank you for meal. It was delicious!",
  },
  {
    key: "chat2",
    myMessage: false,
    content: "Hey! No problem. It was going to waste otherwise.",
  },
  {
    key: "chat3",
    myMessage: true,
    content:
      "Would it be possible to get the recipe for it or is it some well kept family secret?",
  },
  {
    key: "chat4",
    myMessage: false,
    content:
      "Of course! Basically, take 2 eggs, whisk them together, add salt and pepper, then cook the mixture on a pan until you are satisfied. Its called an omelette by the way 😂",
  },
  {
    key: "chat5",
    myMessage: true,
    content: "Oh, never heard of it. I will try some day!",
  },
  {
    key: "chat6",
    myMessage: false,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat7",
    myMessage: true,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat8",
    myMessage: false,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat9",
    myMessage: true,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat10",
    myMessage: false,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat11",
    myMessage: true,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat12",
    myMessage: false,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat13",
    myMessage: true,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat14",
    myMessage: false,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat15",
    myMessage: true,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat16",
    myMessage: false,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
];

let userFileId;
let chatFileId;
let username;
let rating;
let avatar;

const ChatSingle = ({ route, navigation }) => {
  const userId2 = route.params.userId2;
  // const [userToken, setUserToken] = useState();
  // const [userFileId, setUserFileId] = useState();
  // const [chatFileId, setChatFileId] = useState();
  // const [currentUserId, setCurrentUserId] = useState();
  // const [avatar, setAvatar] = useState();
  // const [username, setUsername] = useState("");
  // const [rating, setRating] = useState();

  const [messages, setMessages] = useState();

  const [update, setUpdate] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [keyboardShowing, setKeyboardShowing] = useState(false);

  const { getUserById } = useUser();
  const { getFilesByTag, postTag } = useTag();
  const { getRatingsById } = useRating();
  const { postMedia } = useMedia();
  const { getCommentsById, postComment } = useComment();
  const { user } = useContext(MainContext);

  //set current user info
  useEffect(() => {
    userFileId = undefined;
    chatFileId = undefined;
    username = undefined;
    rating = undefined;
    avatar = undefined;
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(() => {
        setUpdate(update + 1);
      }, 7000);

      return () => {
        clearInterval(interval);
      };
    })
  );

  useEffect(async () => {
    fetchUsername();
    fetchAvatar();
    fetchUserFile();
    fetchRating();
    await fetchChatFile();
    await fetchMessages();
  }, []);

  useEffect(async () => {
    console.log(username, avatar, userFileId, rating, chatFileId);
  });

  //set other user info

  useEffect(async () => {
    console.log("update", update);
    if (update > 0) {
      chatFileId && (await fetchMessages());
    }
  }, [update]);

  // useEffect(() => {
  //   console.log(username, avatar, userFileId, rating, chatFileId);
  //   fetchMessages();
  // }, [chatFileId]);

  const fetchUsername = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const user = await getUserById(userId2, userToken);
      username = user.full_name || user.username;
      // setUsername(user.full_name || user.username);
    } catch (error) {
      console.error("fetchUsername", error);
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(avatarTag + userId2);
      const avatarFetched = await avatarArray.pop();
      avatar = uploadsUrl + avatarFetched.filename;
      // setAvatar(uploadsUrl + avatarFetched.filename);
    } catch (error) {
      console.error("fetchAvatar", error.message);
    }
  };

  const fetchUserFile = async () => {
    try {
      const userFiles = await getFilesByTag(userFileTag + userId2);
      const userFile = userFiles[0];
      // setUserFileId(userFile.file_id);
      userFileId = userFile.file_id;
    } catch (error) {
      console.error("fetchUserFile", error.message);
    }
  };

  const fetchRating = async () => {
    try {
      const ratingList = await getRatingsById(userFileId);
      const ratings = ratingList.map((rating) => rating.rating);
      const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      rating = average;
      // setRating(average);
    } catch (error) {
      console.error("fetchRating", error.message);
    }
  };

  const findChatFile = (array) => {
    const currentUserId = user.user_id;
    return array.find(
      (file) =>
        file.title === `${currentUserId}_${userId2}` ||
        file.title === `${userId2}_${currentUserId}`
    );
  };

  const fetchChatFile = async () => {
    try {
      const chatFiles = await getFilesByTag(chatTag);
      const currentChatFile = findChatFile(chatFiles);
      const currentChatFileId = currentChatFile.file_id;
      if (currentChatFile) {
        // setChatFileId(currentChatFileId);
        chatFileId = currentChatFileId;
        setUpdate(update + 1);
      } else {
        console.log("need to create chat file");
      }
    } catch (error) {}
  };

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
        addChatTag(response.file_id);
        chatFileId = response.file_id;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

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

  const fetchMessages = async () => {
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
        setMessages(formattedMessages);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleSend = async () => {
    if (chatFileId) {
      await sendMessage();
    } else {
      await createChatFile();
      await sendMessage();
    }
  };

  const sendMessage = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    try {
      if (inputValue.length > 0) {
        const commentData = {
          file_id: chatFileId,
          comment: inputValue,
        };
        const response = await postComment(commentData, userToken);
        response && setUpdate(update + 1);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

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
          <Avatar
            size="xl"
            shadow="6"
            source={{
              uri: avatar,
            }}
          />
          <VStack>
            <Heading fontSize="2xl">{username}</Heading>
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
        <ChatBubbleList messages={messages} username={username} />
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
