import React, { useState, useEffect, useContext } from "react";
import { useMedia } from "../hooks/ApiHooks";
import ListItem from "./ListItem";
import PropTypes from "prop-types";

import { FlatList } from "native-base";
import { MainContext } from "../contexts/MainContext";

const List = ({ navigation, tagSelected, isCategorySelected }) => {
  const { mediaArray } = useMedia(tagSelected, isCategorySelected);
  const { categorySelected } = useContext(MainContext);

  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(mediaArray);
  }, [mediaArray]);

  useEffect(() => {
    filterItems(categorySelected);
  }, [categorySelected]);

  const filterItems = (category) => {
    if (categorySelected === "") {
      setFilteredItems(mediaArray);
      return;
    }
    const newArray = mediaArray.filter((item) => {
      const descriptionData = item.description;
      const allData = JSON.parse(descriptionData);
      if (allData.category === category) {
        return item;
      }
    });
    setFilteredItems(newArray);
  };

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
