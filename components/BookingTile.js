import {
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  View,
  VStack,
} from "native-base";
import react, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { colors } from "../utils/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMedia } from "../hooks/ApiHooks";
import { uploadsUrl } from "../utils/variables";
import { listingStatus } from "./PostForm";

const BookingTile = ({
  fileId,
  status,
  active,
  pickupInfo,
  messageAlign = "left",
  onPressTile,
  onPressDots,
  menuShown = true,
}) => {
  const { getMediaById } = useMedia();
  const [pic, setPic] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [message, setMessage] = useState();

  const getMessage = (status) => {
    let requiredMessage;
    switch (status) {
      case listingStatus.booked:
        requiredMessage = "Awaiting confirmation";
        break;
      case listingStatus.confirmed:
        requiredMessage = `Pickup confirmed for ${pickupInfo.pickupTime}`;
        break;
      case listingStatus.pickedUp:
        requiredMessage = "Picked up";
      case listingStatus.listed:
        requiredMessage = "Listed";
      default:
        break;
    }
    return requiredMessage;
  };

  const fetchMedia = async () => {
    try {
      const listing = await getMediaById(fileId);
      setPic(uploadsUrl + listing.thumbnails.w320);
      setTitle(listing.title);
      const descriptionFetched = JSON.parse(listing.description).description;
      setDescription(descriptionFetched);
    } catch (error) {
      console.error(`fetchMedia ${fileId}`, error);
    }
  };

  useEffect(() => {
    fetchMedia();
    setMessage(getMessage(status));
  }, []);

  return (
    <TouchableOpacity onPress={onPressTile}>
      <HStack
        my={2}
        w={"92%"}
        alignSelf="center"
        bgColor={active ? "white" : colors.beige}
        shadow={active ? "6" : "0"}
        borderRadius={10}
        p={3}
        space={2}
      >
        {pic && (
          <Image
            style={{ aspectRatio: 1, height: 100, width: undefined }}
            source={{ uri: pic }}
            borderWidth={0.1}
            borderColor={colors.grey}
            alt="food-image"
          />
        )}
        <VStack flex={1} space={1} justifyContent={"space-between"}>
          <HStack space={2} alignItems="center">
            {title && (
              <Heading flex={0.99} fontSize={14} numberOfLines={1}>
                {title}
              </Heading>
            )}

            {menuShown && (
              <IconButton
                onPress={onPressDots}
                size={5}
                _icon={{
                  as: MaterialCommunityIcons,
                  name: "dots-horizontal",
                  size: 5,
                }}
              />
            )}
          </HStack>

          <View
            flex={0.6}
            bgColor={active ? colors.beige : "white"}
            borderRadius={5}
            p={1.5}
          >
            <Text fontSize={10} numberOfLines={3}>
              {description}
            </Text>
          </View>

          {message && (
            <Text fontSize={11} textAlign={messageAlign}>
              {message}
            </Text>
          )}
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
};

export default BookingTile;
