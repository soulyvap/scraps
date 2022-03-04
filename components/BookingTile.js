import {
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
  View,
  VStack,
} from "native-base";
import react, { useContext, useEffect, useRef, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { colors } from "../utils/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMedia, useUser } from "../hooks/ApiHooks";
import { uploadsUrl } from "../utils/variables";
import { listingStatus } from "./PostForm";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainContext } from "../contexts/MainContext";

const BookingTile = ({
  fileId,
  status,
  active,
  pickupInfo,
  messageAlign = "left",
  menuShown = true,
  navigation,
  own,
}) => {
  const { getMediaById, deleteMediaById } = useMedia();
  const [pic, setPic] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [latest, setLatest] = useState();
  const [file, setFile] = useState();
  const [user, setUser] = useState();
  const menuRef = useRef();
  const { getUserById } = useUser();
  const { update, setUpdate } = useContext(MainContext);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     return () => menuRef.current.isOpen && menuRef.current.close();
  //   }, [])
  // );

  const handleDelete = () => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Yes", onPress: () => deleteListing() },
      ]
    );
  };

  const deleteListing = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    try {
      const response = await deleteMediaById(fileId, userToken);
      response && console.log(response);
      setUpdate(update + 1);
    } catch (error) {
      console.error(`Delete ${fileId}`, error);
    }
  };

  const getMessage = (status) => {
    let requiredMessage;
    switch (status) {
      case listingStatus.booked:
        requiredMessage = own ? "✔️ Booked" : "⌛ Awaiting confirmation";
        break;
      case listingStatus.confirmed:
        requiredMessage = `✔️ Confirmed: (pickup time: ${pickupInfo.pickupTime})`;
        break;
      case listingStatus.pickedUp:
        requiredMessage = "✔️ Picked up";
        break;
      default:
        requiredMessage = `📃 Listed (latest pickup: ${latest}) `;
        break;
    }
    return requiredMessage;
  };

  const selectView = (status) =>
    !own
      ? "ConfirmBooking"
      : status === listingStatus.confirmed
      ? "BookingSummary"
      : "Single";

  const selectData = (destination) => {
    return destination === "Single" ? { file: file } : { fileId: fileId };
  };

  const getDestination = () => {
    return {
      destination: selectView(status),
      data: selectData(selectView(status)),
    };
  };

  const fetchMedia = async () => {
    try {
      const listing = await getMediaById(fileId);
      setPic(uploadsUrl + listing.thumbnails.w320);
      setTitle(listing.title);
      const moreData = JSON.parse(listing.description);
      const descriptionFetched = moreData.description;
      const latestFetched = moreData.latestPickup;
      setDescription(descriptionFetched);
      setLatest(latestFetched);
      setFile(listing);
      if (pickupInfo) {
        await fetchUser(listing.user_id);
      }
    } catch (error) {
      console.error(`fetchMedia ${fileId}`, error);
    }
  };

  const fetchUser = async (userId) => {
    const id = own ? pickupInfo.bookedBy : userId;
    console.log(id);
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const userFetched = await getUserById(id, userToken);
      setUser(userFetched);
    } catch (error) {
      console.error("fetchUsername", error);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        const navigationData = getDestination(status);
        console.log(navigationData);
        console.log(status);

        navigation.navigate(navigationData.destination, navigationData.data);
      }}
      disabled={!active}
    >
      <HStack
        my={2}
        w={"92%"}
        alignSelf="center"
        bgColor={active ? "white" : colors.beige}
        shadow={active ? "6" : "0"}
        borderRadius={10}
        p={3}
        space={2}
      >
        {pic && (
          <Image
            style={{ aspectRatio: 1, height: 100, width: undefined }}
            source={{ uri: pic }}
            borderWidth={0.1}
            borderColor={colors.grey}
            alt="food-image"
          />
        )}
        <VStack flex={1} space={1} justifyContent={"space-between"}>
          <HStack space={2} alignItems="center">
            {title && (
              <Heading flex={0.99} fontSize={14} numberOfLines={1}>
                {title}
              </Heading>
            )}

            {menuShown && user && (
              <Menu ref={menuRef}>
                <MenuTrigger>
                  <Icon
                    as={<MaterialCommunityIcons name={"dots-horizontal"} />}
                    size={5}
                  />
                </MenuTrigger>
                {own ? (
                  <MenuOptions>
                    <MenuOption text={`Message ${user.username}`} />
                    <MenuOption text="Delete" onSelect={handleDelete} />
                  </MenuOptions>
                ) : (
                  <MenuOptions>
                    <MenuOption text={`Message ${user.username}`} />
                  </MenuOptions>
                )}
              </Menu>
            )}
            {menuShown && !pickupInfo && (
              <Menu ref={menuRef}>
                <MenuTrigger>
                  <Icon
                    as={<MaterialCommunityIcons name={"dots-horizontal"} />}
                    size={5}
                  />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption text="Delete" onSelect={handleDelete} />
                </MenuOptions>
              </Menu>
            )}
          </HStack>

          <View
            flex={1}
            bgColor={active ? colors.beige : "white"}
            borderRadius={5}
            p={1.5}
          >
            <Text fontSize={10} numberOfLines={3}>
              {description}
            </Text>
          </View>

          {status && (
            <Text fontSize={11} textAlign={messageAlign}>
              {getMessage(status)}
            </Text>
          )}
        </VStack>
      </HStack>
    </TouchableOpacity>
  );
};

export default BookingTile;
