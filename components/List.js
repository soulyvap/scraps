import React, { useState, useEffect, useContext } from "react";
import { useMedia } from "../hooks/ApiHooks";
import ListItem from "./ListItem";
import PropTypes from "prop-types";
import { FlatList } from "native-base";
import { MainContext } from "../contexts/MainContext";
import { getDistance } from "geolib";

const List = ({ navigation, tagSelected }) => {
  const { mediaArray } = useMedia(tagSelected);
  const { categorySelected, isCategorySelected, coords } =
    useContext(MainContext);
  const [filteredItems, setFilteredItems] = useState([]);

  const myCoords = { latitude: coords.latitude, longitude: coords.longitude };
  const meters = 100000000;

  // filter items based on category and distance
  const filterItems = (category) => {
    const newArray = mediaArray.filter((item) => {
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
  }, [isCategorySelected, mediaArray, categorySelected]);

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
