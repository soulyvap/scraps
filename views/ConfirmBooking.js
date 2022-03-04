import {
  Avatar,
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  Text,
  View,
  VStack,
} from "native-base";
import react, { useContext, useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import BookingTile from "../components/BookingTile";
import Tag from "../components/Tag";
import { useComment, useMedia, useTag, useUser } from "../hooks/ApiHooks";
import { colors } from "../utils/colors";
import { avatarTag, uploadsUrl } from "../utils/variables";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { listingStatus } from "../components/PostForm";
import { MainContext } from "../contexts/MainContext";

const ConfirmBooking = ({ navigation, route }) => {
  const fileId = route.params.fileId;
  const { getCommentsById, postComment } = useComment();
  const { getUserById } = useUser();
  const { getFilesByTag } = useTag();

  const [status, setStatus] = useState();
  const [username, setUsername] = useState();
  const [userId, setUserId] = useState();
  const [avatar, setAvatar] = useState();
  const [pickupInfo, setPickupInfo] = useState();
  const [bookingInfo, setBookingInfo] = useState();
  const { update, setUpdate } = useContext(MainContext);

  const updateStatus = async (newStatus) => {
    const userToken = await AsyncStorage.getItem("userToken");
    try {
      let updatedInfo = bookingInfo;
      updatedInfo.status = newStatus;
      const comment = JSON.stringify(updatedInfo);
      const commentData = {
        file_id: fileId,
        comment: comment,
      };
      const commentResponse = await postComment(commentData, userToken);
      console.log(commentResponse);
      setUpdate(update + 1);
    } catch (error) {
      console.error("confirm", error);
    }
  };

  const fetchBooking = async () => {
    try {
      const comments = await getCommentsById(fileId);
      const booking = comments.pop();
      const info = JSON.parse(booking.comment);
      setBookingInfo(info);
      setPickupInfo(info.pickupInfo);
      console.log(info);
      setStatus(info.status);
      const userIdFetched = info.pickupInfo.bookedBy;
      setUserId(userIdFetched);
      await fetchUsername(userIdFetched);
      await fetchAvatar(userIdFetched);
    } catch (error) {
      console.error("fetchBooking", error);
    }
  };

  const fetchUsername = async (userId) => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const user = await getUserById(userId, userToken);
      setUsername(user.full_name || user.username);
    } catch (error) {
      console.error("fetchUsername", error);
    }
  };

  const fetchAvatar = async (userId) => {
    try {
      const avatarArray = await getFilesByTag(avatarTag + userId);
      const avatarFetched = await avatarArray.pop();
      setAvatar(uploadsUrl + avatarFetched.filename);
    } catch (error) {
      console.error("fetchAvatar", error.message);
    }
  };

  const methodEmoji = (method) => {
    if (method.includes("door")) {
      return "🚪";
    }
    if (method.includes("call")) {
      return "📞";
    }
    if (method.includes("bell")) {
      return "🔔";
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  return (
    <View flex={1} bgColor="white">
      <BackButton
        left={1}
        top={0}
        onPress={() => {
          navigation.goBack();
        }}
      />
      {status && (
        <Heading textAlign={"center"} fontSize={"lg"} py={3}>
          {status === listingStatus.booked
            ? "Approve booking"
            : "Booking review"}
        </Heading>
      )}

      {fileId && pickupInfo && status && (
        <BookingTile
          active={false}
          fileId={fileId}
          status={status}
          pickupInfo={pickupInfo}
          menuShown={false}
        />
      )}

      <VStack flex={0.5} space={7} mt={7}>
        {username && avatar && (
          <HStack alignItems={"center"} space={3} mx={"10%"}>
            <Icon
              mr={2}
              as={<Feather name={"check-circle"} />}
              size={9}
              color={colors.notBlack}
            />
            <Text>{`Booked by ${username}`}</Text>
            <Avatar source={{ uri: avatar }} size={"sm"} />
          </HStack>
        )}

        {pickupInfo && username && (
          <VStack mx={"10%"} space={3}>
            <Text fontSize={20}>{`${username} chose:`}</Text>

            <VStack space={2} ml={8}>
              {pickupInfo.contactless && <Text>{`❌ No contact pickup`}</Text>}
              <Text fontSize={12}>{`${methodEmoji(pickupInfo.pickupMethod)}  ${
                pickupInfo.pickupMethod
              }`}</Text>
              <Text fontSize={12}>{`🕒  ${pickupInfo.pickupTime}`}</Text>
            </VStack>
          </VStack>
        )}
      </VStack>

      <Center flex={0.5}>
        {status && (
          <VStack alignItems={"center"} space={6} w="100%">
            <HStack space={6}>
              {status !== listingStatus.pickedUp && (
                <Button
                  bgColor={colors.green}
                  shadow="6"
                  borderRadius={15}
                  w={"30%"}
                  onPress={async () => {
                    if (status === listingStatus.booked) {
                      await updateStatus(listingStatus.confirmed);
                    } else if (status === listingStatus.confirmed) {
                      await updateStatus(listingStatus.pickedUp);
                    }
                  }}
                  _text={{ fontSize: 13 }}
                >
                  {status === listingStatus.confirmed
                    ? "Mark Picked Up"
                    : "Accept"}
                </Button>
              )}
              <Button
                bgColor={colors.yellow}
                shadow="6"
                borderRadius={15}
                w={"30%"}
                _text={{ color: colors.notBlack, fontSize: 13 }}
                onPress={() =>
                  navigation.navigate("ChatSingle", { userId2: userId })
                }
              >
                Message
              </Button>
            </HStack>
            {status !== listingStatus.pickedUp && (
              <Button
                bgColor={colors.red}
                shadow="6"
                borderRadius={15}
                w={"30%"}
                _text={{ fontSize: 13 }}
                onPress={() => updateStatus(listingStatus.cancelled)}
              >
                {status === listingStatus.confirmed ? "Cancel" : "Decline"}
              </Button>
            )}
          </VStack>
        )}
      </Center>
    </View>
  );
};

export default ConfirmBooking;
