import React, { useContext } from "react";
import { useMedia } from "../hooks/ApiHooks";
import ListItem from "./ListItem";
import PropTypes from "prop-types";
import { FlatGrid } from "react-native-super-grid";
import { MainContext } from "../contexts/MainContext";

const List = ({ navigation, userFilesOnly = false }) => {
  // const { mediaArray } = useMedia(userFilesOnly);
  const { scrapsMediaArray } = useMedia(userFilesOnly);
  return (
    <FlatGrid
      itemDimension={140}
      data={scrapsMediaArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({ item }) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
};

export default List;
