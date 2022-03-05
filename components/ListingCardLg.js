import {
  Avatar,
  FlatList,
  Heading,
  HStack,
  Image,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import react, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { Chip } from "react-native-paper";
import { colors } from "../utils/colors";
import { uploadsUrl } from "../utils/variables";

const ListingCardLg = ({ listing }) => {
  const [description, setDescription] = useState();

  useEffect(async () => {
    const listingInfo = JSON.parse(listing.description);
    setDescription(listingInfo.description);
  }, []);

  const h = Dimensions.get("window").height;
  return (
    <HStack borderTopRadius={10} bgColor={colors.beige} h={h * 0.2}>
      <View h={"100%"}>
        <Image
          style={{ aspectRatio: 1, height: "100%", width: undefined }}
          source={{
            uri: uploadsUrl + listing.filename,
          }}
          alt="food-pic"
          borderTopLeftRadius={10}
        />
      </View>
      <VStack flex={1} p={2}>
        <Heading fontSize="md">{listing.title}</Heading>
        <ScrollView
          persistentScrollbar
          showsVerticalScrollIndicator
          nestedScrollEnabled
          my={2}
        >
          <Text fontSize={12}>{description || "No description"}</Text>
        </ScrollView>
      </VStack>
    </HStack>
  );
};

export default ListingCardLg;
