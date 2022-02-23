import {
  Avatar,
  Heading,
  HStack,
  IconButton,
  Input,
  View,
  VStack,
} from "native-base";
import { Rating } from "react-native-ratings";
import ChatBubbleList from "../components/ChatBubbleList";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/colors";
import BackButton from "../components/BackButton";
import { useContext, useEffect, useState } from "react";
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
const ChatSingle = ({ userId2, navigation }) => {
  const [avatar, setAvatar] = useState();
  const [username, setUsername] = useState("Sara");
  const [userFileId, setUserFileId] = useState();
  const [rating, setRating] = useState();
  const [chatFileId, setChatFileId] = useState();
  const [messages, setMessages] = useState();
  const [userToken, setUserToken] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const [update, setUpdate] = useState(0);

  const { getUserById } = useUser();
  const { getFilesByTag, postTag } = useTag();
  const { getRatingsById } = useRating();
  const { postMedia } = useMedia();
  const { getCommentsById } = useComment();
  const { user } = useContext(MainContext);

  // //set current user info
  // useEffect(async () => {
  //   const token = await AsyncStorage.getItem("userToken");
  //   setUserToken(token);
  //   setCurrentUserId(user.user_id);
  // }, []);

  // //set other user info
  // useEffect(async () => {
  //   await fetchUsername();
  //   await fetchAvatar();
  //   await fetchUserFile();
  //   await fetchRating();
  // }, []);

  // //fetch chat
  // useEffect(async () => {
  //   await fetchChatFile();
  // }, []);

  // useEffect(async () => {
  //   await fetchMessages();
  // }, [update]);

  const fetchUsername = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const user = await getUserById(userId2, userToken);
      setUsername(user.username);
    } catch (error) {
      console.error("fetchOwner", error);
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(avatarTag + userId2);
      const avatarFetched = await avatarArray.pop();
      setAvatar(uploadsUrl + avatarFetched.filename);
    } catch (error) {
      console.error("fetchAvatar", error.message);
    }
  };

  const fetchUserFile = async () => {
    try {
      const userFiles = await getFilesByTag(userFileTag + userId2);
      const userFile = userFiles[0];
      setUserFileId(userFile.file_id);
    } catch (error) {}
  };

  const fetchRating = async () => {
    try {
      const ratingList = await getRatingsById(userFileId);
      const ratings = ratingList.map((rating) => rating.rating);
      const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      setRating(average);
    } catch (error) {
      console.error("fetchRating", error.message);
    }
  };

  const fetchChatFile = async () => {
    try {
      const chatFiles = await getFilesByTag(chatTag);
      const currentChatFile = chatFiles.find(
        (file) =>
          file.title === `${currentUserId}_${userId2}` ||
          `${userId2}_${currentUserId}`
      );
      if (currentChatFile) {
        setChatFileId(currentChatFile.file_id);
        setUpdate(update + 1);
      } else {
        await createChatFile();
      }
    } catch (error) {}
  };

  const createChatFile = async () => {
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
        setChatFileId(response.file_id);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const addChatTag = async (fileId) => {
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
    } catch (error) {}
  };
  const createMessage = async () => {};

  return (
    <View flex={1} px={3} bgColor="white">
      <BackButton
        top={2}
        left={2}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <HStack h={"25%"} alignItems={"center"} justifyContent="center" space={6}>
        <Avatar
          size="xl"
          shadow="6"
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
          }}
        />
        <VStack>
          <Heading fontSize="2xl">Sara</Heading>
          <Rating readonly={true} startingValue={4} imageSize={15} />
        </VStack>
      </HStack>
      <View flex={1}>
        <ChatBubbleList messages={messages} username={username} />
      </View>
      <View
        w={"100%"}
        flexDirection="row"
        alignSelf="flex-end"
        borderRadius={10}
        p={2}
        bgColor={colors.beige}
      >
        <Input
          flex={1}
          variant="underlined"
          multiline
          borderRadius={10}
          placeholder="New message.."
          borderBottomColor={colors.grey}
          fontSize="sm"
          InputRightElement={
            <IconButton
              onPress={() => console.log("send")}
              bgColor={colors.green}
              size="lg"
              borderRadius={"full"}
              variant={"solid"}
              text
              _icon={{ as: Ionicons, name: "send" }}
            />
          }
        />
      </View>
    </View>
  );
};

export default ChatSingle;
