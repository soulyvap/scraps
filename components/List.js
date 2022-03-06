import React, { useState, useEffect, useContext } from "react";
import { useMedia, useTag } from "../hooks/ApiHooks";
import ListItem from "./ListItem";
import PropTypes from "prop-types";
import { FlatList } from "native-base";
import { MainContext } from "../contexts/MainContext";
import { getDistance } from "geolib";
import { foodPostTag } from "../utils/variables";

const List = ({ navigation, tagSelected }) => {
  const { mediaArray } = useMedia(foodPostTag);
  const { getFilesByTag, getTagsByFileId } = useTag();
  const { categorySelected, isCategorySelected, coords } =
    useContext(MainContext);
  const [filteredItems, setFilteredItems] = useState([]);

  const myCoords = { latitude: coords.latitude, longitude: coords.longitude };
  const meters = 100000000;

  const filterItems = async (category) => {
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
  };

  useEffect(() => {
    setFilteredItems(mediaArray);
  }, [mediaArray]);

  useEffect(() => {
    filterItems(categorySelected);
  }, [mediaArray, isCategorySelected, categorySelected]);

  return (
    <FlatList
      width={"90%"}
      alignSelf={"center"}
      numColumns={2}
      data={filteredItems}
      columnWrapperStyle={{ justifyContent: "space-evenly", marginBottom: 20 }}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({ item }) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  tagSelected: PropTypes.string,
};

export default List;
