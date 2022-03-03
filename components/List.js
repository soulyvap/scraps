import React, { useContext, useEffect, useState } from "react";
import { useMedia, useTag } from "../hooks/ApiHooks";
import ListItem from "./ListItem";
import PropTypes from "prop-types";
import { FlatGrid } from "react-native-super-grid";
import { MainContext } from "../contexts/MainContext";
import { foodPostTag } from "../utils/variables";

const List = ({ navigation, tagSelected }) => {
  const { update, setUpdate } = useContext(MainContext);
  const { mediaArray } = useMedia(tagSelected);

  // useEffect(() => {}, [update, tagSelected]);

  return (
    <FlatGrid
      itemDimension={140}
      data={mediaArray}
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
