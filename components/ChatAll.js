import { Image, View } from "native-base";
import BackButton from "./BackButton";
import ChatList from "./ChatList";

const ChatAll = () => {
  return (
    <View flex={1}>
      <View h={"22%"} justifyContent={"center"} alignItems="center">
        <Image
          source={require("../assets/message.png")}
          alt="message-logo"
          h="45%"
          resizeMode="contain"
        />
      </View>
      <View flex={1}>
        <ChatList />
      </View>
    </View>
  );
};

export default ChatAll;
