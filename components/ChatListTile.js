import {
  Avatar,
  Box,
  ChevronRightIcon,
  Heading,
  HStack,
  Image,
  Text,
  View,
  VStack,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { colors } from "../utils/colors";

const ChatListTile = ({ avatar, name, message, read }) => {
  return (
    <TouchableOpacity w={"100%"}>
      <Box p={3} borderRadius={10} bgColor={colors.beige}>
        <HStack alignItems={"center"} space={4}>
          <Avatar
            size="md"
            source={{
              uri: avatar,
            }}
          />
          <VStack w="71%">
            <Heading fontSize="md">{name}</Heading>
            <Text
              numberOfLines={1}
              overflow={"hidden"}
              fontWeight={read ? undefined : "bold"}
            >
              {message}
            </Text>
          </VStack>
          <ChevronRightIcon position="absolute" right={0} size={4} />
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

export default ChatListTile;
