import { Avatar, HStack, Text, VStack } from "native-base";
import { Rating } from "react-native-ratings";
import { colors } from "../utils/colors";

const ReviewTile = ({ review }) => {
  const pic = review.avatar;
  const rating = review.rating;
  const comment = review.comment;
  const username = review.username;
  return (
    <HStack
      bgColor={colors.beige}
      shadow="4"
      mb={2}
      borderRadius={10}
      space={3}
      p={2}
      alignItems="center"
      w={"90%"}
      alignSelf={"center"}
    >
      <Avatar size={"16"} source={{ uri: pic }} shadow="4" />
      <VStack alignItems={"flex-start"} space={1} flex={1}>
        <HStack justifyContent={"space-between"}>
          <Rating
            startingValue={rating}
            imageSize={15}
            readonly={true}
            tintColor={colors.beige}
            type="custom"
            ratingBackgroundColor={colors.grey}
            ratingColor={colors.yellow}
          />
          <Text flex={1} italic textAlign={"right"}>{`~${username}`}</Text>
        </HStack>

        <Text italic flex={1}>
          {comment}
        </Text>
      </VStack>
    </HStack>
  );
};

export default ReviewTile;
