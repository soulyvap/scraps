import {
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  FlatList,
  Heading,
  HStack,
  IconButton,
  Input,
  ScrollView,
  Select,
  Text,
  View,
  VStack,
} from "native-base";
import react, { useContext, useEffect, useState } from "react";
import ListingCardLg from "../components/ListingCardLg";
import {
  useComment,
  useMedia,
  useRating,
  useTag,
  useUser,
} from "../hooks/ApiHooks";
import {
  avatarTag,
  foodPostTag,
  uploadsUrl,
  userFileTag,
} from "../utils/variables";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Chip } from "react-native-paper";
import { Alert, SafeAreaView, TouchableOpacity } from "react-native";
import { FlatGrid } from "react-native-super-grid";
import { colors } from "../utils/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { set } from "react-hook-form";
import BackButton from "../components/BackButton";
import Tag from "../components/Tag";
import { listingStatus } from "../components/PostForm";
import { MainContext } from "../contexts/MainContext";

const Booking = ({ navigation, route }) => {
  const fileId = route.params.fileId;
  const { getMediaById } = useMedia();
  const { getUserById } = useUser();
  const { getFilesByTag, getTagsByFileId, postTag } = useTag();
  const { postComment } = useComment();
  const { getRatingsById } = useRating();
  const { user } = useContext(MainContext);

  const [listing, setListing] = useState();
  const [username, setUsername] = useState();
  const [avatar, setAvatar] = useState();
  const [rating, setRating] = useState();
  const [tags, setTags] = useState();
  const [allergens, setAllergens] = useState();
  const [latestPickup, setLatestPickup] = useState();
  const [timeSlot, setTimeSlot] = useState();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState();
  const [dateSelected, setDateSelected] = useState(false);
  const [pickupMethod, setPickupMethod] = useState();
  const [contactless, setContactless] = useState(false);

  const checkForm = () => {
    if (!dateText) {
      Alert.alert("Please select a pickup time");
      return false;
    }
    if (!pickupMethod) {
      Alert.alert("Please select a pickup method");
      return false;
    }
    return true;
  };

  const submit = async () => {
    const formValid = checkForm();

    if (formValid) {
      const token = await AsyncStorage.getItem("userToken");
      const pickupInfo = {
        pickupTime: dateText,
        pickupMethod: pickupMethod,
        contactless: contactless,
        bookedBy: user.user_id,
      };
      const listingLog = {
        status: listingStatus.booked,
        pickupInfo: pickupInfo,
      };
      const commentData = {
        file_id: fileId,
        comment: JSON.stringify(listingLog),
      };
      const tagData = {
        file_id: fileId,
        tag: listingStatus.booked,
      };

      try {
        const commentResponse = await postComment(commentData, token);
        const tagResponse = await postTag(tagData, token);

        console.log(commentResponse);
        console.log(tagResponse);

        if (commentResponse && tagResponse) {
          Alert.alert(
            "Booking successful",
            `Awaiting ${username}'s confirmation`
          );
          navigation.navigate("BookingsListings");
        }
      } catch (error) {
        console.error("submit confirm booking", error);
      }
    }
  };

  const fetchMedia = async () => {
    try {
      const listingFetched = await getMediaById(fileId);
      const listingInfo = {
        filename: listingFetched.filename,
        title: listingFetched.title,
        description: listingFetched.description,
      };
      setListing(listingInfo);
      const moreDataFetched = JSON.parse(listingInfo.description);
      const allergensFetched = moreDataFetched.allergens;
      setAllergens(allergensFetched);
      setLatestPickup(moreDataFetched.latestPickup);
      setTimeSlot(moreDataFetched.suitableTimeSlot);
      const userId = listingFetched.user_id;
      await fetchAvatar(userId);
      await fetchUsername(userId);
      await fetchUserFile(userId);
    } catch (error) {
      console.error("fetchMedia", error);
    }
  };

  const fetchAvatar = async (userId) => {
    try {
      const avatarArray = await getFilesByTag(avatarTag + userId);
      const avatarLast = await avatarArray.pop();
      setAvatar(uploadsUrl + avatarLast.filename);
    } catch (error) {
      console.error("fetchAvatar", error.message);
    }
  };

  const fetchUsername = async (userId) => {
    const token = await AsyncStorage.getItem("userToken");
    try {
      const user = await getUserById(userId, token);
      const username = user.full_name || user.username;
      setUsername(username);
    } catch (error) {
      console.error("fetchUsername", error.message);
    }
  };

  const fetchUserFile = async (userId) => {
    try {
      const userFiles = await getFilesByTag(userFileTag + userId);
      const userFile = userFiles[0];
      await fetchRating(userFile.file_id);
    } catch (error) {
      console.error("fetchUserFile", error.message);
    }
  };

  const fetchRating = async (userFileId) => {
    try {
      const ratingList = await getRatingsById(userFileId);
      const ratings = ratingList.map((rating) => rating.rating);
      const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      setRating(average);
    } catch (error) {
      console.error("fetchRating", error.message);
    }
  };

  const fetchTags = async () => {
    try {
      const tagArray = await getTagsByFileId(fileId);
      const filteredTags = tagArray.filter((tag) => tag.tag !== foodPostTag);
      setTags(filteredTags);
    } catch (error) {}
  };

  useEffect(() => {
    fetchMedia();
    fetchTags();
  }, []);

  useEffect(() => {
    console.log(show);
  }, [show]);

  const showDatepicker = () => {
    setShow(true);
  };

  const onChanged = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    switch (mode) {
      case "date":
        setDate(currentDate);
        setMode("time");
        break;
      case "time":
        setShow(false);
        setDate(currentDate);
        setMode("date");
        setDateSelected(true);
        setDateText(formatTime(currentDate));
        break;
      default:
        break;
    }
  };

  const formatTime = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    day < 10 && (day = `0${day}`);
    month < 10 && (month = `0${month}`);
    hours < 10 && (hours = `0${hours}`);
    minutes < 10 && (minutes = `0${minutes}`);
    return `${day}/${month}/${year} at ${hours}.${minutes}`;
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
        Book listing
      </Heading>
      <ScrollView nestedScrollEnabled>
        <VStack borderRadius={10} shadow="6" bgColor={"white"} mx={4}>
          {listing && <ListingCardLg listing={listing} />}
          <VStack space={3} p={2}>
            {username && avatar && (
              <HStack w={"100%"}>
                <Text w={"40%"}>Posted by</Text>
                <HStack
                  px={2}
                  py={1}
                  space={3}
                  alignItems="center"
                  borderRadius={10}
                  bgColor={colors.beige}
                  shadow="2"
                >
                  <Avatar
                    size={10}
                    source={{
                      uri: avatar,
                    }}
                  />
                  <VStack>
                    <Text fontSize={12}>{username}</Text>
                    <Text fontSize={12}>⭐ {rating || "no ratings"}</Text>
                  </VStack>
                </HStack>
              </HStack>
            )}
            {tags && (
              <HStack w={"100%"}>
                <Text w={"40%"}>Tags</Text>
                <HStack flex={1} flexWrap="wrap">
                  {tags.map((tag) => (
                    <Tag name={tag.tag} />
                  ))}
                </HStack>
              </HStack>
            )}
            {allergens && (
              <HStack w={"100%"}>
                <Text w={"40%"}>Allergens</Text>
                <HStack flex={1} flexWrap="wrap">
                  {allergens.map((tag) => (
                    <Tag name={tag} />
                  ))}
                </HStack>
              </HStack>
            )}
            {latestPickup && (
              <HStack>
                <Text w={"40%"}>Latest pickup</Text>
                <Text fontSize={12} mt={1}>
                  {latestPickup}
                </Text>
              </HStack>
            )}
            {timeSlot && (
              <HStack>
                <Text w={"40%"}>Pickup timeslot</Text>
                <Text flex={1} fontSize={12} mt={1}>
                  {timeSlot}
                </Text>
              </HStack>
            )}
          </VStack>
        </VStack>

        <View flex={1} my={5} justifyContent={"space-between"} mx={4}>
          <View>
            <View mb={5}>
              <Heading fontSize={"lg"} mb={3}>
                When
              </Heading>
              <HStack w={"100%"} alignItems="center" space={5}>
                <TouchableOpacity onPress={showDatepicker}>
                  <View py={2} px={5} bgColor={colors.beige} borderRadius={15}>
                    <Text fontSize={14}>{dateText || "Select date"}</Text>
                  </View>
                </TouchableOpacity>

                <IconButton
                  shadow="2"
                  bgColor={colors.yellow}
                  borderRadius="full"
                  onPress={showDatepicker}
                  _icon={{ as: MaterialIcons, name: "calendar-today", size: 5 }}
                />
                {show && (
                  <DateTimePicker
                    is24Hour
                    display="default"
                    mode={mode}
                    onChange={onChanged}
                    testID="dateTimePicker"
                    value={date}
                  />
                )}
              </HStack>
            </View>
            <View>
              <Heading fontSize={"lg"} my={3}>
                How
              </Heading>
              <Select
                fontSize={14}
                borderRadius={15}
                bgColor={colors.beige}
                borderColor={colors.beige}
                py={1}
                px={5}
                w={"100%"}
                selectedValue={pickupMethod}
                accessibilityLabel="Choose a pickup method"
                placeholder="Choose a pickup method"
                variant="rounded"
                onValueChange={(value) => {
                  setPickupMethod(value);
                }}
              >
                <Select.Item
                  label="Left at the building door"
                  value="Left at the building door"
                />
                <Select.Item
                  label="Left at the door"
                  value="Left at the door"
                />
                <Select.Item
                  label="Ring the doorbell"
                  value="Ring the doorbell"
                />
                <Select.Item label="Call me" value="Call me" />
              </Select>
            </View>
            <HStack w={"100%"} mt={3}>
              <Checkbox
                _checked={{ bgColor: colors.grey, borderColor: colors.grey }}
                value={contactless}
                onChange={(checked) => setContactless(checked)}
              >
                <Text ml={3}>No contact pickup</Text>
              </Checkbox>
            </HStack>
          </View>

          <Button
            bgColor={colors.green}
            borderRadius={15}
            w={"35%"}
            alignSelf="center"
            mt={10}
            onPress={submit}
          >
            Confirm
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default Booking;
