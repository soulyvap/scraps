import React from "react";
import { useMedia } from "../hooks/ApiHooks";
import ListItem from "./ListItem";
import PropTypes from "prop-types";
import { FlatGrid } from "react-native-super-grid";

const List = ({ navigation, userFilesOnly = false }) => {
  const { mediaArray } = useMedia(userFilesOnly);
  return (
    <FlatGrid
      itemDimension={140}
      data={mediaArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({ item }) => (
        <ListItem
          navigation={navigation}
          singleMedia={item}
          userFilesOnly={userFilesOnly}
        />
      )}
    />
  );
};

List.propTypes = {
  navigation: PropTypes.object,
  userFilesOnly: PropTypes.bool,
};

export default List;
