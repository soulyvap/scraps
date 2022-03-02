import { Center, Fab, IconButton, Image, Text, View } from "native-base";
import { useMedia, useTag } from "../hooks/ApiHooks";
import ChatList from "../components/ChatList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { chatTag } from "../utils/variables";
import { MainContext } from "../contexts/MainContext";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/colors";
import { useFocusEffect } from "@react-navigation/native";

// const chatData = [
//   {
//     id: 0,
//     avatar:
//       "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
//     name: "Sara",
//     message: "Thanks!",
//     read: false,
//   },
//   {
//     id: 1,
//     avatar:
//       "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
//     name: "Sara",
//     message: "Thanks!",
//     read: true,
//   },
//   {
//     id: 2,
//     avatar:
//       "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
//     name: "Sara",
//     message: "Thanks!",
//     read: true,
//   },
//   {
//     id: 3,
//     avatar:
//       "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
//     name: "Sara",
//     message: "Thanks!",
//     read: false,
//   },
//   {
//     id: 4,
//     avatar:
//       "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
//     name: "Sara",
//     message: "Thanks!",
//     read: false,
//   },
//   {
//     id: 5,
//     avatar:
//       "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
//     name: "Sara",
//     message: "Thanks!",
//     read: false,
//   },
//   {
//     id: 6,
//     avatar:
//       "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
//     name: "Sara",
//     message: "Thanks!",
//     read: false,
//   },
//   {
//     id: 7,
//     avatar:
//       "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
//     name: "Sara",
//     message: "Thanks!",
//     read: false,
//   },
//   {
//     id: 8,
//     avatar:
//       "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
//     name: "Sara",
//     message: "Thanks!",
//     read: false,
//   },
//   {
//     id: 9,
//     avatar:
//       "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
//     name: "Sara",
//     message: "Thanks!",
//     read: false,
//   },
//   {
//     id: 10,
//     avatar:
//       "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
//     name: "Sara",
//     message: "Thanks!",
//     read: false,
//   },
//   {
//     id: 11,
//     avatar:
//       "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
//     name: "Sara",
//     message: "Thanks!",
//     read: false,
//   },
// ];

const ChatAll = ({ navigation }) => {
  const { getFilesByTag } = useTag();
  const [userToken, setUserToken] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const [chatArray, setChatArray] = useState([]);
  const [update, setUpdate] = useState(0);
  const { user } = useContext(MainContext);

  useFocusEffect(
    React.useCallback(() => {
      const interval = setInterval(() => {
        setUpdate(update + 1);
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    })
  );

  useFocusEffect(
    React.useCallback(() => {
      const timeout = setTimeout(() => {
        setUpdate(update + 1);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    })
  );

  useEffect(async () => {
    await setUserInfo();
  }, []);

  useEffect(async () => {
    if (currentUserId) {
      setUpdate(update + 1);
    }
  }, [currentUserId]);

  useEffect(async () => {
    if (currentUserId) {
      getMyChats();
    }
  }, [update]);

  const setUserInfo = async () => {
    setCurrentUserId(user.user_id);
    const token = await AsyncStorage.getItem("userToken");
    setUserToken(token);
  };

  const getMyChats = async () => {
    try {
      const chatFiles = await getFilesByTag(chatTag);
      if (currentUserId) {
        const filesFormatted = await chatFiles.map((file) => {
          return {
            file_id: file.file_id,
            title: file.title,
            userId2: parseInt(
              file.title
                .split("_")
                .find((el) => el !== currentUserId.toString())
            ),
          };
        });
        const userChatFiles = await filesFormatted.filter((file) => {
          return file.title.split("_").includes(currentUserId.toString());
        });
        setChatArray(userChatFiles);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <View flex={1} px={3} bgColor={"white"}>
      <Text>Current user: {currentUserId}</Text>
      <Center h={"22%"}>
        <Image
          source={require("../assets/message.png")}
          alt="message-logo"
          h="45%"
          resizeMode="contain"
        />
      </Center>
      <View flex={1}>
        <ChatList
          chatData={chatArray}
          navigation={navigation}
          update={update}
        />
      </View>
    </View>
  );
};

export default ChatAll;
