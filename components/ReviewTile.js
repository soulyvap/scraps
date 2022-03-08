import { Avatar, HStack, Text, VStack } from "native-base";
import { Rating } from "react-native-ratings";
import { colors } from "../utils/colors";

const ReviewTile = () => {
  const pic = "";
  const rating = 4.0;
  const comment = "Very nice food. Even better person!";
  return (
    <HStack
      bgColor={colors.beige}
      shadow="4"
      mb={2}
      borderRadius={10}
      space={3}
      p={2}
    >
      <Avatar size={"md"} source={{ uri: pic }} shadow="4" />
      <VStack alignItems={"flex-start"} space={1}>
        <Rating
          minValue={rating}
          imageSize={15}
          readonly={true}
          tintColor={colors.beige}
        />
        <Text>{comment}</Text>
      </VStack>
    </HStack>
  );
};

export default ReviewTile;
