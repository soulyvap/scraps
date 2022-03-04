import { FlatList, HStack, SectionList, Text, View } from "native-base";
import react, { useContext, useEffect, useState } from "react";
import { RefreshControl } from "react-native";
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
  const { user, update } = useContext(MainContext);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    setData([]);
    await fetchListings();
  };

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
          } else if (info.status !== listingStatus.deleted) {
            active.push(listing);
          }
        }
      });
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
    } catch (error) {
      console.error("fetchListings", error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [update]);

  const renderItem = (item) => {
    if (!item.lastComment) {
      return (
        <BookingTile
          active={true}
          fileId={item.file_id}
          status={listingStatus.listed}
          navigation={navigation}
          own={true}
          refresh={refresh}
        />
      );
    } else {
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
          own={true}
          refresh={refresh}
        />
      );
    }
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        />
      )}
    </View>
  );
};

export default MyListings;
