import {
  Avatar,
  Box,
  Center,
  HStack,
  Icon,
  NativeBaseProvider,
  Text,
} from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { useTag } from "../hooks/ApiHooks";
import PropTypes from "prop-types";
import { uploadsUrl } from "../utils/variables";
import { MaterialIcons } from "@expo/vector-icons";

const Profile = ({ navigation }) => {
  const { user } = useContext(MainContext);
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
  );
  const { getFilesByTag } = useTag();

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag("avatar_" + user.user_id);
      if (avatarArray.length === 0) {
        return;
      }
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [avatar]);

  return (
    <NativeBaseProvider>
      {/* green background box */}
      <Box
        height={"40%"}
        bgColor={"#33CA7F"}
        borderBottomLeftRadius={90}
        borderBottomRightRadius={90}
        justifyContent={"center"}
      >
        <Center>
          <Text fontSize={30}>{user.username}</Text>
          <HStack>
            <Icon
              as={MaterialIcons}
              name="star-outline"
              size={5}
              color="#FED766"
            ></Icon>
            <Icon
              as={MaterialIcons}
              name="star-outline"
              size={5}
              color="#FED766"
            ></Icon>
            <Icon
              as={MaterialIcons}
              name="star-outline"
              size={5}
              color="#FED766"
            ></Icon>
            <Icon
              as={MaterialIcons}
              name="star-outline"
              size={5}
              color="#FED766"
            ></Icon>
            <Icon
              as={MaterialIcons}
              name="star-outline"
              size={5}
              color="#FED766"
            ></Icon>
          </HStack>
          {/* profile image */}
          <Avatar
            w={230}
            h={230}
            source={{
              uri: avatar,
            }}
          ></Avatar>
        </Center>
      </Box>
    </NativeBaseProvider>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
