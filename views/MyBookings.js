import { useFocusEffect } from "@react-navigation/native";
import { Center, FlatList, HStack, SectionList, Text, View } from "native-base";
import React from "react";
import react, { useContext, useEffect, useState } from "react";
import { Dimensions, RefreshControl } from "react-native";
import BookingTile from "../components/BookingTile";
import { listingStatus } from "../components/PostForm";
import { MainContext } from "../contexts/MainContext";
import { useComment, useTag } from "../hooks/ApiHooks";
import { colors } from "../utils/colors";
import { foodPostTag } from "../utils/variables";
import LottieView from "lottie-react-native";

const MyBookings = ({ navigation }) => {
  const { getFilesByTag } = useTag();
  const { getCommentsById } = useComment();
  const { user, update, setUpdate } = useContext(MainContext);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  //refreshing the list of bookings
  const refresh = async () => {
    setRefreshing(true);
    setData([]);
    await fetchBookings();
  };

  //fetching all the bookings that have the status "booked", "confirmed" or "picked-up"
  //the bookings are then sorted into active (booked, confirmed) and inactive (picked-up).
  //that sorting is used for the section list to display bookings into "active" or "archived"
  const fetchBookings = async () => {
    const active = [];
    const inactive = [];
    try {
      const listings = await getFilesByTag(foodPostTag);
      const listingsWithComment = await Promise.all(
        listings.map(async (item) => {
          const fileId = item.file_id;
          const comments = await getCommentsById(fileId);
          const lastComment = comments.pop();
          return {
            file_id: fileId,
            lastComment: lastComment,
          };
        })
      );
      const listingsBooked = listingsWithComment.filter(
        (listing) => listing.lastComment
      );
      console.log("booked", listingsBooked);
      listingsBooked.forEach((listing) => {
        const lastComment = listing.lastComment;
        const info = JSON.parse(lastComment.comment);
        if (info.pickupInfo.bookedBy === user.user_id) {
          if (info.status === listingStatus.pickedUp) {
            inactive.push(listing);
          } else if (
            info.status !== listingStatus.cancelled &&
            info.status !== listingStatus.deleted
          ) {
            active.push(listing);
          }
        }

        const data = [
          {
            title: "Active ",
            data: active,
          },
          {
            title: "Archived ",
            data: inactive,
          },
        ];

        setData([...data]);
        setRefreshing(false);
      });
    } catch (error) {
      console.error("fetchBookings", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [update]);

  //rendering the items of the section list
  const renderItem = (item) => {
    const info = JSON.parse(item.lastComment.comment);
    const status = info.status;
    const pickupInfo = info.pickupInfo;
    const active = status !== listingStatus.pickedUp;
    return (
      <BookingTile
        active={active}
        fileId={item.file_id}
        status={status}
        pickupInfo={pickupInfo}
        navigation={navigation}
        own={false}
        refresh={refresh}
      />
    );
  };

  //header component
  const SectionHeader = ({ section }) => {
    return (
      <HStack alignItems={"center"} space={2} mx={"5%"} my={5}>
        <Text>{`${section.title}(${section.data.length})`}</Text>
        <View h={0.4} bgColor={colors.grey} flex={1} />
      </HStack>
    );
  };

  const h = Dimensions.get("window").height;

  return (
    <View flex={1}>
      {data ? (
        <SectionList
          sections={data}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => renderItem(item)}
          renderSectionHeader={({ section }) => (
            <SectionHeader section={section} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          ListEmptyComponent={
            <View alignItems={"center"} justifyContent={"center"} h={h * 0.8}>
              <LottieView
                autoPlay
                loop={false}
                style={{ width: 400, height: 400 }}
                source={require("../assets/loading-2.json")}
                speed={1}
              />
            </View>
          }
        />
      ) : (
        <Center flex={1}>No bookings yet.</Center>
      )}
    </View>
  );
};

export default MyBookings;
