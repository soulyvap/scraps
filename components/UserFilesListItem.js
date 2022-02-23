import React from "react";
import { Avatar, Pressable } from "native-base";
import PropTypes from "prop-types";
import { uploadsUrl } from "../utils/variables";

// TODO: currently just the entire card is pressable and takes you to single item.
// needs to be changed so that by clicking on avatar, it would take you to profile page
const ListItem = ({ navigation, singleMedia }) => {
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("Single", { file: singleMedia });
      }}
    >
      <Avatar
        source={{ uri: uploadsUrl + singleMedia.thumbnails?.w160 }}
        size={"lg"}
      ></Avatar>
    </Pressable>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object.isRequired,
};

export default ListItem;
