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

const List = ({ navigation, tagSelected }) => {
  const { mediaArray } = useMedia(foodPostTag);
  const { getFilesByTag, getTagsByFileId } = useTag();
  const { categorySelected, isCategorySelected, coords } =
    useContext(MainContext);
  const [filteredItems, setFilteredItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const myCoords = { latitude: coords.latitude, longitude: coords.longitude };
  const meters = 100000000;

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
          console.log(fileId, lastTag.tag);
          activeListings.push(post);
        }
      })
    );

    // filter items further by distance and category selected
    const newArray = activeListings.filter((item) => {
      const descriptionData = item.description;
      const allData = JSON.parse(descriptionData);
      const postCoordsLat = 60.170622411146574;
      const postCoordsLong = 24.94413216537968;
      const postCoords = {
        latitude: postCoordsLat,
        longitude: postCoordsLong,
      };
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

    setFilteredItems(newArray);
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => {
    setFilteredItems(mediaArray);
  }, [mediaArray]);

  useEffect(() => {
    filterItems(categorySelected);
  }, [mediaArray, isCategorySelected, categorySelected, tagSelected]);

  if (!loading) {
    return (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        ListEmptyComponent={
          <Text
            color={colors.notBlack}
            fontSize={15}
            alignSelf={"center"}
            mt={"60%"}
          >
            There are no posts matching your criteria
          </Text>
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
      <HStack space={2} alignSelf="center" mt={"50%"}>
        <Spinner accessibilityLabel="Loading posts" />
        <Heading color={colors.green} fontSize="xl">
          Loading
        </Heading>
      </HStack>
    );
  }
};

List.propTypes = {
  navigation: PropTypes.object,
  tagSelected: PropTypes.string,
};

export default List;
