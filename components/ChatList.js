import { View } from "native-base";
import react from "react";
import { FlatList, SafeAreaView } from "react-native";
import ChatListTile from "./ChatListTile";

const ChatList = () => {
  const chatData = [
    {
      id: 0,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      name: "Sara",
      message: "Thanks!",
      read: false,
    },
    {
      id: 1,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      name: "Sara",
      message: "Thanks!",
      read: true,
    },
    {
      id: 2,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      name: "Sara",
      message: "Thanks!",
      read: true,
    },
    {
      id: 3,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      name: "Sara",
      message: "Thanks!",
      read: false,
    },
    {
      id: 4,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      name: "Sara",
      message: "Thanks!",
      read: false,
    },
    {
      id: 5,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      name: "Sara",
      message: "Thanks!",
      read: false,
    },
    {
      id: 6,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      name: "Sara",
      message: "Thanks!",
      read: false,
    },
    {
      id: 7,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      name: "Sara",
      message: "Thanks!",
      read: false,
    },
    {
      id: 8,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      name: "Sara",
      message: "Thanks!",
      read: false,
    },
    {
      id: 9,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      name: "Sara",
      message: "Thanks!",
      read: false,
    },
    {
      id: 10,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      name: "Sara",
      message: "Thanks!",
      read: false,
    },
    {
      id: 11,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      name: "Sara",
      message: "Thanks!",
      read: false,
    },
  ];

  const renderItem = ({ item }) => (
    <View>
      <ChatListTile
        avatar={item.avatar}
        name={item.name}
        message={item.message}
        read={item.read}
      />
      <View h={2} />
    </View>
  );
  return (
    <FlatList
      keyExtractor={(item) => item.id.toString()}
      data={chatData}
      renderItem={renderItem}
    />
  );
};

export default ChatList;
