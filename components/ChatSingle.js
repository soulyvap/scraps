import {
  Avatar,
  Button,
  Heading,
  HStack,
  IconButton,
  Input,
  TextArea,
  View,
  VStack,
} from "native-base";
import react from "react";
import { Rating } from "react-native-ratings";
import ChatBubble from "./ChatBubble";
import ChatBubbleList from "./ChatBubbleList";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/colors";

const messages = [
  {
    key: "chat1",
    myMessage: true,
    content: "Hi! Thank you for meal. It was delicious!",
  },
  {
    key: "chat2",
    myMessage: false,
    content: "Hey! No problem. It was going to waste otherwise.",
  },
  {
    key: "chat3",
    myMessage: true,
    content:
      "Would it be possible to get the recipe for it or is it some well kept family secret?",
  },
  {
    key: "chat4",
    myMessage: false,
    content:
      "Of course! Basically, take 2 eggs, whisk them together, add salt and pepper, then cook the mixture on a pan until you are satisfied. Its called an omelette by the way 😂",
  },
  {
    key: "chat5",
    myMessage: true,
    content: "Oh, never heard of it. I will try some day!",
  },
  {
    key: "chat6",
    myMessage: false,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat7",
    myMessage: true,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat8",
    myMessage: false,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat9",
    myMessage: true,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat10",
    myMessage: false,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat11",
    myMessage: true,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat12",
    myMessage: false,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat13",
    myMessage: true,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat14",
    myMessage: false,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat15",
    myMessage: true,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
  {
    key: "chat16",
    myMessage: false,
    content: "Hi! Thank you for the casserole. It was delicious!",
  },
];
const ChatSingle = ({ avatar }) => {
  return (
    <View flex={1}>
      <HStack h={"25%"} alignItems={"center"} justifyContent="center" space={6}>
        <Avatar
          size="xl"
          shadow="6"
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
          }}
        />
        <VStack>
          <Heading fontSize="2xl">Sara</Heading>
          <Rating readonly={true} startingValue={4} imageSize={15} />
        </VStack>
      </HStack>
      <View flex={1}>
        <ChatBubbleList messages={messages} />
      </View>
      <View
        w={"100%"}
        flexDirection="row"
        alignSelf="flex-end"
        borderRadius={10}
        p={2}
        bgColor={colors.beige}
      >
        <Input
          flex={1}
          variant="underlined"
          multiline
          borderRadius={10}
          placeholder="New message.."
          borderBottomColor={colors.grey}
          fontSize="sm"
          InputRightElement={
            <IconButton
              onPress={() => console.log("send")}
              bgColor={colors.green}
              size="lg"
              borderRadius={"full"}
              variant={"solid"}
              icon={<Ionicons name="send" />}
            />
          }
        />
      </View>
    </View>
  );
};

export default ChatSingle;
