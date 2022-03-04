import { FlatList, HStack, SectionList, Text, View } from "native-base";
import react, { useContext, useEffect, useState } from "react";
import BookingTile from "../components/BookingTile";
import { listingStatus } from "../components/PostForm";
import { MainContext } from "../contexts/MainContext";
import { useComment, useTag } from "../hooks/ApiHooks";
import { colors } from "../utils/colors";
import { foodPostTag } from "../utils/variables";

const MyBookings = ({ navigation }) => {
  const { getFilesByTag } = useTag();
  const { getCommentsById } = useComment();
  const { user, update } = useContext(MainContext);

  const [data, setData] = useState([]);

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
      });
    } catch (error) {
      console.error("fetchBookings", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [update]);

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
      />
    );
  };

  const SectionHeader = ({ section }) => {
    return (
      <HStack alignItems={"center"} space={2} mx={"5%"} my={5}>
        <Text>{`${section.title}(${section.data.length})`}</Text>
        <View h={0.4} bgColor={colors.grey} flex={1} />
      </HStack>
    );
  };

  return (
    <View flex={1}>
      {data && (
        <SectionList
          sections={data}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => renderItem(item)}
          renderSectionHeader={({ section }) => (
            <SectionHeader section={section} />
          )}
        />
      )}
    </View>
  );
};

export default MyBookings;
