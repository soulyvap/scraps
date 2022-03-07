import React, { useState, useEffect, useContext } from "react";
import { useMedia, useTag } from "../hooks/ApiHooks";
import ListItem from "./ListItem";
import PropTypes from "prop-types";
import {
  Center,
  FlatList,
  Heading,
  HStack,
  Skeleton,
  Spinner,
  Text,
  View,
  VStack,
} from "native-base";
import { MainContext } from "../contexts/MainContext";
import { getDistance } from "geolib";
import { foodPostTag } from "../utils/variables";
import { RefreshControl } from "react-native";
import { colors } from "../utils/colors";
import LottieView from "lottie-react-native";

const List = ({ navigation, tagSelected }) => {
  const { mediaArray } = useMedia(foodPostTag);
  const { getFilesByTag, getTagsByFileId } = useTag();
  const { categorySelected, isCategorySelected, coords } =
    useContext(MainContext);
  const [filteredItems, setFilteredItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const myCoords = { latitude: coords.latitude, longitude: coords.longitude };
  const meters = 500;

  const refresh = async () => {
    setRefreshing(true);
    setLoading(true);
    setFilteredItems([]);
    await filterItems();
  };

  const filterItems = async (category) => {
    setLoading(true);
    // posts with tagSelected
    const foodPostsByTag = await getFilesByTag(tagSelected);
    // keep only matches between mediaArray and foodPostsByTag
    // this ensures that only items that have scraps2022 tag are shown
    const tagIntersect = mediaArray.filter(function (o1) {
      return foodPostsByTag.some(function (o2) {
        return o1.file_id === o2.file_id;
      });
    });

    // fetch all tags under each post and only add those
    // that don't have 'booked' tag as last tag
    const activeListings = [];
    const active = await Promise.all(
      tagIntersect.map(async (post) => {
        const fileId = post.file_id;
        const tags = await getTagsByFileId(fileId);
        const lastTag = tags.pop();
        if (lastTag.tag !== "booked") {
          activeListings.push(post);
        }
      })
    );

    // filter items further by distance and category selected
    const newArray = activeListings.filter((item) => {
      const descriptionData = item.description;
      const allData = JSON.parse(descriptionData);
      // get coordinates of the post
      const postCoords = {
        latitude: allData.coords.latitude,
        longitude: allData.coords.longitude,
      };

      // compare distance between user's address and posts location
      const distance = getDistance(myCoords, postCoords);
      if (
        (!isCategorySelected && distance < meters) ||
        (isCategorySelected &&
          allData.category === category &&
          distance < meters)
      ) {
        return item;
      }
    });

    // sort array so that newest items are shown first
    // secondary sorting done by title a to z
    const sortedArray = newArray.sort((a, b) =>
      a.time_added < b.time_added
        ? 1
        : a.time_added === b.time_added
        ? a.title > b.title
          ? 1
          : -1
        : -1
    );

    setFilteredItems(sortedArray);
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    setFilteredItems(mediaArray);
  }, [mediaArray]);

  useEffect(() => {
    filterItems(categorySelected);
  }, [mediaArray, isCategorySelected, categorySelected, refreshing]);

  if (!loading) {
    return (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        ListEmptyComponent={
          <View alignItems={"center"} justifyContent={"center"} flex={1}>
            <LottieView
              autoPlay
              loop={false}
              style={{ width: 200, height: 200 }}
              source={require("../assets/loading-2.json")}
              speed={1}
            />

            <Text color={colors.notBlack} fontSize={15} alignSelf={"center"}>
              There are no posts matching your criteria
            </Text>
          </View>
        }
        width={"90%"}
        alignSelf={"center"}
        numColumns={2}
        data={filteredItems}
        columnWrapperStyle={{
          justifyContent: "space-evenly",
          marginBottom: 20,
        }}
        keyExtractor={(item) => item.file_id.toString()}
        renderItem={({ item }) => (
          <ListItem navigation={navigation} singleMedia={item} />
        )}
      />
    );
  } else {
    return (
      <View alignItems={"center"} justifyContent={"center"} flex={1}>
        <LottieView
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
          source={require("../assets/loading-3.json")}
          speed={2}
        />
      </View>
    );
  }
};

List.propTypes = {
  navigation: PropTypes.object,
  tagSelected: PropTypes.string,
};

export default List;
