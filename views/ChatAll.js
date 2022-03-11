import { Center, Image, View } from "native-base";
import { useTag } from "../hooks/ApiHooks";
import ChatList from "../components/ChatList";
import React, { useContext, useEffect, useState } from "react";
import { chatTag } from "../utils/variables";
import { MainContext } from "../contexts/MainContext";
import { useFocusEffect } from "@react-navigation/native";

const ChatAll = ({ navigation }) => {
  const { getFilesByTag } = useTag();
  const [chatArray, setChatArray] = useState([]);
  const [update, setUpdate] = useState(0);
  const { user } = useContext(MainContext);

  const currentUserId = user.user_id;

  //refreshing chat list every 5 seconds this view is focused
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

  //refreshing after 1 second of focus
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

  //fetching all chats on update
  useEffect(async () => {
    if (currentUserId) {
      getMyChats();
    }
  }, [update]);

  //fetching all chatFiles that contain the current user's id in their title
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
        //checking that the two user ids in the chatfile title are not identical
        const secondFilter = userChatFiles.filter((file) => {
          const ids = file.title.split("_");
          return ids[0] !== ids[1];
        });
        const thirdFilter = userChatFiles.filter((file) => {
          const ids = file.title.split("_");
          return !ids.includes("undefined");
        });
        setChatArray(thirdFilter);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <View flex={1} px={3} bgColor={"white"}>
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
