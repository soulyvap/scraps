import { View } from "native-base";
import { useState } from "react";
import BackButton from "../components/BackButton";
import ChatAll from "../components/ChatAll";
import ChatSingle from "../components/ChatSingle";

const Chat = () => {
  const [single, setSingle] = useState(true);
  return (
    <View flex={1} px={3}>
      {single && (
        <BackButton left={"5%"} top={"2%"} onPress={() => setSingle(false)} />
      )}
      {single ? <ChatSingle /> : <ChatAll />}
    </View>
  );
};

export default Chat;
