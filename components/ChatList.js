import { Center, Text, View } from "native-base";
import react from "react";
import { FlatList, SafeAreaView } from "react-native";
import ChatListTile from "./ChatListTile";

const ChatList = ({ chatData, navigation, update }) => {
  const renderItem = ({ item }) => (
    <View>
      <ChatListTile
        chatData={item}
        onPress={() =>
          navigation.navigate("ChatSingle", { userId2: item.userId2 })
        }
        update={update}
      />
      <View h={2} />
    </View>
  );
  return (
    <View flex={1}>
      {chatData.length > 0 ? (
        <FlatList
          keyExtractor={(item) => item.file_id.toString()}
          data={chatData}
          renderItem={renderItem}
        />
      ) : (
        <Center flex={1} px="19%">
          <Text textAlign={"center"}>
            Your conversations will appear here once you start chatting with
            your neighbours!
          </Text>
        </Center>
      )}
    </View>
  );
};

export default ChatList;
