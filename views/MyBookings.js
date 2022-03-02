import { FlatList, HStack, Text, View } from "native-base";
import react, { useContext, useEffect, useState } from "react";
import BookingTile from "../components/BookingTile";
import { listingStatus } from "../components/PostForm";
import { MainContext } from "../contexts/MainContext";
import { useComment, useTag } from "../hooks/ApiHooks";
import { colors } from "../utils/colors";
import { foodPostTag } from "../utils/variables";

const MyBookings = () => {
  const { getFilesByTag } = useTag();
  const { getCommentsById } = useComment();
  const { user } = useContext(MainContext);

  const [activeBookings, setActiveBookings] = useState([]);
  const [inactiveBookings, setInactiveBookings] = useState([]);

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
        if (lastComment.user_id === user.user_id) {
          active.push(listing);
        } else {
          const info = JSON.parse(lastComment.comment);
          if (info.bookedBy === user.user_id) {
            if (info.status === listingStatus.pickedUp) {
              inactive.push(listing);
            } else {
              active.push(listing);
            }
          }
        }
        console.log("active", active);
        setActiveBookings([...active]);
        setInactiveBookings([...inactive]);
      });
    } catch (error) {
      console.error("fetchBookings", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <View flex={1}>
      <HStack alignItems={"center"} space={2} mx={"5%"} my={5}>
        <Text>{`Active (${activeBookings.length})`}</Text>
        <View h={0.4} bgColor={colors.grey} flex={1} />
      </HStack>
      {activeBookings.length > 0 && (
        <FlatList
          data={activeBookings}
          keyExtractor={(item) => item.fileId}
          renderItem={({ item }) => {
            const info = JSON.parse(item.lastComment.comment);
            const status = info.status;
            const pickupInfo = info.pickupInfo;
            return (
              <BookingTile
                active={true}
                fileId={item.file_id}
                status={status}
                pickupInfo={pickupInfo}
              />
            );
          }}
        />
      )}
      <HStack alignItems={"center"} space={2} mx={"5%"} my={5}>
        <Text>{`Archived (${inactiveBookings.length})`}</Text>
        <View h={0.4} bgColor={colors.grey} flex={1} />
      </HStack>
      {inactiveBookings.length > 0 && (
        <FlatList
          data={inactiveBookings}
          keyExtractor={(item) => item.fileId}
          renderItem={({ item }) => {
            const info = JSON.parse(item.lastComment.comment);
            const status = info.status;
            const pickupInfo = info.pickupInfo;
            <BookingTile
              active={false}
              fileId={item.file_id}
              status={status}
              pickupInfo={pickupInfo}
            />;
          }}
        />
      )}
    </View>
  );
};

export default MyBookings;
