import { FlatList, HStack, Text, View } from "native-base";
import react, { useContext, useEffect, useState } from "react";
import BookingTile from "../components/BookingTile";
import { listingStatus } from "../components/PostForm";
import { MainContext } from "../contexts/MainContext";
import { useComment, useMedia, useTag } from "../hooks/ApiHooks";
import { colors } from "../utils/colors";
import { foodPostTag } from "../utils/variables";

const MyListings = ({ navigation }) => {
  const { getFilesByTag } = useTag();
  const { getCommentsById } = useComment();
  const { getMediaById } = useMedia();
  const { user } = useContext(MainContext);

  const [activeListings, setActiveListings] = useState([]);
  const [inactiveListings, setInactiveListings] = useState([]);

  const fetchListings = async () => {
    const active = [];
    const inactive = [];
    try {
      const listings = await getFilesByTag(foodPostTag);
      const userListings = listings.filter(
        (listing) => listing.user_id === user.user_id
      );
      const listingsWithComment = await Promise.all(
        userListings.map(async (item) => {
          const fileId = item.file_id;
          const comments = await getCommentsById(fileId);
          const lastComment = comments.pop();
          return {
            file_id: fileId,
            lastComment: lastComment,
          };
        })
      );
      listingsWithComment.forEach((listing) => {
        const lastComment = listing.lastComment;
        if (!lastComment) {
          active.push(listing);
        } else {
          const info = JSON.parse(lastComment.comment);
          if (info.status === listingStatus.pickedUp) {
            inactive.push(listing);
          } else {
            active.push(listing);
          }
        }
      });
      setActiveListings([...active]);
      setInactiveListings([...inactive]);
    } catch (error) {
      console.error("fetchListings", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <View flex={1}>
      <HStack alignItems={"center"} space={2} mx={"5%"} my={5}>
        <Text>{`Active (${activeListings.length})`}</Text>
        <View h={0.4} bgColor={colors.grey} flex={1} />
      </HStack>
      {activeListings.length > 0 && (
        <FlatList
          data={activeListings}
          keyExtractor={(item) => item.fileId}
          renderItem={({ item }) => {
            if (!item.lastComment) {
              return (
                <BookingTile
                  active={true}
                  fileId={item.file_id}
                  status={listingStatus.listed}
                  own={true}
                  onPressTile={() => {}}
                />
              );
            } else {
              const info = JSON.parse(item.lastComment.comment);
              const status = info.status;
              const pickupInfo = info.pickupInfo;
              return (
                <BookingTile
                  active={true}
                  fileId={item.file_id}
                  status={status}
                  own={true}
                  pickupInfo={pickupInfo}
                  onPressTile={() => {
                    navigation.navigate("ConfirmBooking", {
                      fileId: item.file_id,
                    });
                  }}
                />
              );
            }
          }}
        />
      )}
      <HStack alignItems={"center"} space={2} mx={"5%"} my={5}>
        <Text>{`Archived (${inactiveListings.length})`}</Text>
        <View h={0.4} bgColor={colors.grey} flex={1} />
      </HStack>
      {inactiveListings.length > 0 && (
        <FlatList
          data={inactiveListings}
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

export default MyListings;
