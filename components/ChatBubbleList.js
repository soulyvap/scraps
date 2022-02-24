import { Center, FlatList, Text, View } from "native-base";
import react from "react";
import { colors } from "../utils/colors";
import ChatBubble from "./ChatBubble";
import { Ionicons } from "@expo/vector-icons";

const ChatBubbleList = ({ messages, username }) => {
  const renderItem = ({ item }) => {
    return (
      <View>
        <ChatBubble
          myMessage={item.myMessage}
          content={item.content}
          username={username}
        />
        <View h={3} />
      </View>
    );
  };
  return (
    <View>
      {messages ? (
        <FlatList
          keyExtractor={(item) => item.key}
          data={[...messages].reverse()}
          renderItem={renderItem}
          inverted
        />
      ) : (
        <Center flex={1}>
          <Center size={100} borderRadius="full">
            <Ionicons
              name="chatbubble-ellipses"
              size={70}
              color={colors.grey}
            />
          </Center>
          <Text
            textAlign={"center"}
          >{`No messages yet.\nStart chatting with ${username}.`}</Text>
        </Center>
      )}
    </View>
  );
};

export default ChatBubbleList;
