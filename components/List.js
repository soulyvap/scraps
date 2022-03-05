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
  const meters = 10000;

  // // filter only those posts that are within 500 meter radius
  // const filterByDistance = () => {
  //   const newArray = mediaArray.filter((item) => {
  //     const descriptionData = item.description;
  //     const allData = JSON.parse(descriptionData);
  //     const postCoordsLat = 60.170622411146574;
  //     const postCoordsLong = 24.94413216537968;
  //     const postCoords = { latitude: postCoordsLat, longitude: postCoordsLong };
  //     const distance = getDistance(myCoords, postCoords);
  //     // console.log("distance", distance);
  //     if (distance < meters) {
  //       return item;
  //     }
  //   });
  //   setFilteredItems(newArray);
  // };

  // filter items out based on category selected
  const filterItems = (category) => {
    // categorySelected is "" when ALL buttons is clicked
    // in that case the whole array needs to be displayed
    if (!isCategorySelected) {
      // setFilteredItems(mediaArray);
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
        // console.log("distance", distance);
        if (distance < meters) {
          return item;
        }
      });
      setFilteredItems(newArray);
    } else if (isCategorySelected) {
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
        // console.log("distance", distance);
        if (allData.category === category && distance < meters) {
          return item;
        }
      });
      setFilteredItems(newArray);
    }
  };

  useEffect(() => {
    setFilteredItems(mediaArray);
  }, [mediaArray, tagSelected]);

  useEffect(() => {
    filterItems(categorySelected);
  }, [isCategorySelected, tagSelected, mediaArray, categorySelected]);

  // useEffect(() => {
  //   filterByDistance();
  // }, [coords, mediaArray]);

  return (
    <FlatList
      width={"90%"}
      alignSelf={"center"}
      // itemDimension={140}
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
  categorySelected: PropTypes.bool,
};

export default List;
