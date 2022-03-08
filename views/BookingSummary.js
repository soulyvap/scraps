import {
  Avatar,
  Button,
  Heading,
  HStack,
  Icon,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import { useContext, useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import BookingTile from "../components/BookingTile";
import { useComment, useMedia, useTag, useUser } from "../hooks/ApiHooks";
import { colors } from "../utils/colors";
import { avatarTag, uploadsUrl, userFileTag } from "../utils/variables";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { listingStatus } from "../components/PostForm";
import MapView from "react-native-maps";
import { Dimensions, Linking } from "react-native";
import { MainContext } from "../contexts/MainContext";

const BookingSummary = ({ navigation, route }) => {
  const fileId = route.params.fileId;
  const { getCommentsById, postComment } = useComment();
  const { getUserById } = useUser();
  const { getFilesByTag, postTag } = useTag();
  const { getMediaById } = useMedia();

  const [status, setStatus] = useState();
  const [username, setUsername] = useState();
  const [userId, setUserId] = useState();
  const [avatar, setAvatar] = useState();
  const [pickupInfo, setPickupInfo] = useState();
  const [address, setAddress] = useState();
  const [coords, setCoords] = useState();
  const [bookingInfo, setBookingInfo] = useState();
  const { update, setUpdate } = useContext(MainContext);

  const CheckedIcon = () => {
    return (
      <Icon
        mr={2}
        as={<Feather name={"check-circle"} />}
        size={6}
        color={colors.notBlack}
      />
    );
  };

  const PendingIcon = () => {
    return (
      <Icon
        mr={2}
        as={<FontAwesome5 name={"hourglass"} />}
        size={6}
        color={colors.notBlack}
      />
    );
  };

  //updating the status of a booking.
  //a comment is added with a new status
  //if a booking is cancelled a "cancelled" tag is also added to relist the item
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
      if (newStatus === listingStatus.cancelled) {
        await addCancelTag();
      }
      console.log(commentResponse);
      setUpdate(update + 1);
    } catch (error) {
      console.error("confirm", error);
    }
  };
  //adding a cancel tag
  const addCancelTag = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    const tagData = {
      file_id: fileId,
      tag: listingStatus.cancelled,
    };
    try {
      const response = await postTag(tagData, userToken);
      console.log("tag added", response);
    } catch (error) {
      console.error("add tag", error);
    }
  };

  //fetching all the booking's infos (status, pickupinfo, booker's infos)
  const fetchBooking = async () => {
    try {
      const comments = await getCommentsById(fileId);
      const booking = comments.pop();
      const info = JSON.parse(booking.comment);
      setBookingInfo(info);
      setPickupInfo(info.pickupInfo);
      setStatus(info.status);
      const file = await getMediaById(fileId);
      const userIdFetched = file.user_id;
      setUserId(userIdFetched);
      await fetchUsername(userIdFetched);
      await fetchAvatar(userIdFetched);
      if (info.status === listingStatus.confirmed) {
        await fetchUserFile(userIdFetched);
      }
    } catch (error) {
      console.error("fetchBooking", error);
    }
  };

  //fetching the username of the poster
  const fetchUsername = async (userId) => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const user = await getUserById(userId, userToken);
      setUsername(user.full_name || user.username);
    } catch (error) {
      console.error("fetchUsername", error);
    }
  };

  //fetching the userfile of the poster to get their address and coordinates
  const fetchUserFile = async (userId) => {
    try {
      const userFiles = await getFilesByTag(userFileTag + userId);
      const userFile = userFiles[0];
      const moreData = JSON.parse(userFile.description);
      const addressFetched = moreData.address;
      const coordsFetched = moreData.coords;
      setAddress(addressFetched);
      setCoords(coordsFetched);
    } catch (error) {
      console.error("fetchUserFile", error.message);
    }
  };

  //fetching the avatar of the poster
  const fetchAvatar = async (userId) => {
    try {
      const avatarArray = await getFilesByTag(avatarTag + userId);
      const avatarFetched = await avatarArray.pop();
      setAvatar(uploadsUrl + avatarFetched.filename);
    } catch (error) {
      console.error("fetchAvatar", error.message);
    }
  };

  //select the right emoji for the pickup method
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

  const h = Dimensions.get("window").height;
  const w = Dimensions.get("window").width;

  //open a map appliction with the right coordinates
  const openMap = async (lat, lng) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${lat},${lng}`;
    const label = "Custom Label";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };

  return (
    <View flex={1} bgColor="white">
      <BackButton
        left={1}
        top={0}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Heading textAlign={"center"} fontSize={"lg"} py={3}>
        Booking summary
      </Heading>

      <ScrollView>
        <VStack minH={h * 0.9}>
          {fileId && pickupInfo && status && (
            <BookingTile
              active={false}
              fileId={fileId}
              status={status}
              pickupInfo={pickupInfo}
              menuShown={false}
            />
          )}

          <VStack space={3} mt={3}>
            {username && (
              <HStack alignItems={"center"} space={1} mx={"10%"}>
                {status === listingStatus.booked ? (
                  <PendingIcon />
                ) : (
                  <CheckedIcon />
                )}
                <Text>
                  {status === listingStatus.booked
                    ? `Awaiting ${username}'s confirmation`
                    : "Booking confirmed"}
                </Text>
              </HStack>
            )}

            {pickupInfo && username && (
              <VStack mx={"10%"} space={3}>
                <Text fontSize={20}>Booking details</Text>

                <VStack space={2} ml={8}>
                  {pickupInfo.contactless && (
                    <Text fontSize={12}>{`❌  No contact pickup`}</Text>
                  )}
                  <Text fontSize={12}>{`${methodEmoji(
                    pickupInfo.pickupMethod
                  )}  ${pickupInfo.pickupMethod}`}</Text>
                  <Text fontSize={12}>{`🕒  ${pickupInfo.pickupTime}`}</Text>
                  {address && <Text fontSize={12}>{`📍  ${address}`}</Text>}
                </VStack>
              </VStack>
            )}
          </VStack>

          {coords && (
            <View
              h={200}
              mx={"5%"}
              bgColor={"amber.100"}
              my={5}
              borderRadius={10}
            >
              <Button
                bgColor={colors.green}
                shadow="5"
                borderRadius={15}
                position={"absolute"}
                right={2}
                top={2}
                _text={{ fontSize: 9, fontWeight: "bold" }}
                px={2}
                py={1}
                zIndex={1000}
                onPress={async () => {
                  await openMap(coords.latitude, coords.longitude);
                }}
              >
                Open in Maps
              </Button>
              <MapView
                initialRegion={coords}
                style={{ flex: 1 }}
                pitchEnabled={false}
                rotateEnabled={false}
                scrollEnabled={false}
                zoomControlEnabled
              >
                <MapView.Marker
                  coordinate={{
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                  }}
                  title={"Front door"}
                  description={"description"}
                />
              </MapView>
            </View>
          )}

          <VStack alignItems="center" flex={1} justifyContent="center">
            {avatar && username && (
              <HStack mx={"10%"} space={3} alignItems="center">
                <Avatar size={10} source={{ uri: avatar }} />
                <Text
                  flex={0.9}
                  fontSize={12}
                >{`For any additional information, message ${username} directly.`}</Text>
              </HStack>
            )}
            <HStack space={6} my={5}>
              <Button
                bgColor={colors.yellow}
                shadow="5"
                borderRadius={15}
                w={"30%"}
                _text={{ color: colors.notBlack }}
                onPress={() =>
                  navigation.navigate("ChatSingle", { userId2: userId })
                }
              >
                Message
              </Button>
              <Button
                bgColor={colors.red}
                shadow="5"
                borderRadius={15}
                w={"30%"}
                onPress={() => {
                  updateStatus(listingStatus.cancelled);
                  navigation.goBack();
                }}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>
    </View>
  );
};

export default BookingSummary;
