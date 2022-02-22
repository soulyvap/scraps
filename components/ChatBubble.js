import { Text, View } from "native-base";
import react from "react";
import { colors } from "../utils/colors";

const ChatBubble = ({ myMessage, content }) => {
  return (
    <View
      borderRadius={10}
      maxW={"85%"}
      bgColor={myMessage ? colors.beige : colors.green}
      p={2}
      justifyContent="center"
      alignSelf={myMessage ? "flex-end" : "flex-start"}
    >
      <Text>{content}</Text>
    </View>
  );
};

export default ChatBubble;
