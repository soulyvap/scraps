import { Text, View } from "native-base";
import react from "react";
import { colors } from "../utils/colors";

const ChatBubble = ({ myMessage, content, username }) => {
  return (
    <View
      borderRadius={10}
      maxW={"85%"}
      minW="30%"
      bgColor={myMessage ? colors.beige : colors.green}
      p={2}
      justifyContent="center"
      alignSelf={myMessage ? "flex-end" : "flex-start"}
    >
      <Text
        fontSize={10}
        fontWeight="bold"
        color={myMessage ? colors.green : "white"}
        alignSelf={myMessage ? "flex-end" : "flex-start"}
      >
        {myMessage ? "Me" : username}
      </Text>
      <Text>{content}</Text>
    </View>
  );
};

export default ChatBubble;
