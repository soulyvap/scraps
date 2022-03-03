import React from "react";
import { useMedia } from "../hooks/ApiHooks";
import ListItem from "./ListItem";
import PropTypes from "prop-types";

import { FlatList } from "native-base";

const List = ({ navigation, tagSelected, isCategorySelected }) => {
  const { mediaArray } = useMedia(tagSelected, isCategorySelected);

  return (
    <FlatList
      width={"90%"}
      alignSelf={"center"}
      // itemDimension={140}
      numColumns={2}
      data={mediaArray}
      columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 20 }}
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
