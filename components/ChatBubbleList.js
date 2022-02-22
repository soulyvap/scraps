import { FlatList, View } from "native-base";
import react from "react";
import ChatBubble from "./ChatBubble";

const ChatBubbleList = ({ messages }) => {
  const renderItem = ({ item }) => {
    return (
      <View>
        <ChatBubble myMessage={item.myMessage} content={item.content} />
        <View h={3} />
      </View>
    );
  };
  return (
    <FlatList
      keyExtractor={(item) => item.key}
      data={[...messages].reverse()}
      renderItem={renderItem}
      inverted
    />
  );
};

export default ChatBubbleList;
