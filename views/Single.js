import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  uploadsUrl,
  defaultAvatar,
  avatarTag,
  appId,
} from "../utils/variables";
import { useTag, useUser } from "../hooks/ApiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  Icon,
  IconButton,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { FlatGrid } from "react-native-super-grid";
import { MaterialIcons } from "@expo/vector-icons";
import { MainContext } from "../contexts/MainContext";

const Single = ({ route, navigation }) => {
  const { file } = route.params;
  const { getUserById } = useUser();
  const { getFilesByTag, getTagsByFileId } = useTag();
  const [owner, setOwner] = useState({ username: "fetching..." });
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [showModal, setShowModal] = useState(false);
  const [tags, setTags] = useState();
  const { update, setUpdate, user } = useContext(MainContext);

  const descriptionData = file.description;
  const allData = JSON.parse(descriptionData);
  const description = allData.description;
  const latestPickup = allData.latestPickup;
  const suitableTimeSlot = allData.suitableTimeSlot;
  const allergens = allData.allergens;

  useEffect(() => {
    console.log(descriptionData);
  }, []);

  const AllergenDisplay = () => {
    if (allergens.length === 0) {
      return (
        <Text color="#132A15" fontSize={16}>
          {owner.username} didn't list any allergens
        </Text>
      );
    } else {
      return (
        <Text color="#132A15" fontSize={16}>
          {allergens.join(", ")}
        </Text>
      );
    }
  };

  const fetchTags = async () => {
    try {
      const fileTags = await getTagsByFileId(file.file_id);
      for (let i = 0; i < fileTags.length; i++) {
        if (
          fileTags[i].tag === `${appId}_post` ||
          fileTags[i].tag === "booked" ||
          fileTags[i].tag === "cancelled"
        ) {
          fileTags.splice(i, 1);
          i--;
        }
      }
      setTags(fileTags);
    } catch (error) {
      console.error("fetch tags error", error);
      setOwner({ tags: "[not available]" });
    }
  };

  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await getUserById(file.user_id, token);
      setOwner(userData);
    } catch (error) {
      console.error("fetch owner error", error);
      setOwner({ username: "[not available]" });
    }
  };

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(avatarTag + file.user_id);
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
    fetchOwner();
    fetchAvatar();
    fetchTags();
  }, []);

  return (
    <Center h={"100%"} bgColor={"#33CA7F"}>
      <Box position={"absolute"} top={5} left={5} w={10} h={10}>
        <IconButton
          icon={<Icon as={MaterialIcons} name="arrow-back" />}
          size={7}
          color="#132A15"
          onPress={() => {
            setUpdate(update + 1);
            navigation.goBack();
          }}
        />
      </Box>
      <Box
        h={"80%"}
        w={"100%"}
        bgColor={"white"}
        borderTopLeftRadius={90}
        borderTopRightRadius={90}
        position="absolute"
        bottom="0"
      ></Box>
      <Image
        source={{ uri: uploadsUrl + file.filename }}
        borderRadius={"full"}
        size={220}
        position="absolute"
        top="5%"
        alt="image"
      ></Image>
      <VStack
        w={"100%"}
        h={"60%"}
        position="absolute"
        top={"35%"}
        alignItems={"center"}
      >
        <Text
          fontSize={25}
          color="#132A15"
          fontWeight={"bold"}
          mt={2}
          px={5}
          textAlign={"center"}
        >
          {file.title}
        </Text>
        <HStack w={"90%"} h={"13%"} mt={5}>
          <Pressable
            onPress={() => {
              navigation.navigate("Profile", {
                file: file,
              });
            }}
            bgColor={"#F9F4F1"}
            w={"50%"}
            h={"100%"}
            borderTopRightRadius="10"
            borderTopLeftRadius="10"
            borderBottomWidth={1}
            borderBottomColor={"#898980"}
            shadow={9}
          >
            <HStack
              alignItems="center"
              position="absolute"
              top="0"
              ml={3}
              mt={1}
              width="100%"
            >
              <Avatar
                marginRight="2"
                size="sm"
                source={{
                  uri: avatar,
                }}
              ></Avatar>
              <VStack>
                <Text color="#132A15" fontWeight="bold">
                  {owner.username}
                </Text>
                <Text color="#132A15" fontWeight="400">
                  5 stars
                </Text>
              </VStack>
            </HStack>
          </Pressable>
          <Box alignSelf={"center"} width={"50%"}>
            <Button
              borderRadius={"full"}
              bgColor={"#FED766"}
              w={140}
              alignSelf="center"
              onPress={() => setShowModal(true)}
            >
              <Text color="#132A15" fontWeight={"bold"}>
                Check allergens
              </Text>
            </Button>
          </Box>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            closeOnOverlayClick
          >
            <Modal.Content maxWidth="400px" bgColor={"#F9F4F1"}>
              <Modal.CloseButton />
              <Modal.Header>Allergens</Modal.Header>
              <Modal.Body>
                <AllergenDisplay />
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </HStack>
        <ScrollView
          bgColor={"#F9F4F1"}
          w={"90%"}
          minH={"15%"}
          maxH={"25%"}
          borderTopRightRadius="10"
          shadow={9}
        >
          <Text m={3} fontSize={16} color={"#132A15"}>
            {description}
          </Text>
        </ScrollView>
        <Box
          bgColor={"#F9F4F1"}
          shadow={9}
          w={"90%"}
          alignSelf={"flex-start"}
          ml={"5%"}
          borderTopWidth={1}
          borderTopColor={"#898980"}
        >
          <Text m={3} fontSize={13} color={"#132A15"}>
            Latest pickup date: {latestPickup}.
          </Text>
        </Box>
        <Box
          bgColor={"#F9F4F1"}
          w={"90%"}
          shadow={9}
          alignSelf={"flex-start"}
          ml={"5%"}
          borderBottomLeftRadius="10"
          borderBottomRightRadius="10"
        >
          <Text m={3} fontSize={13} color={"#132A15"}>
            Suitable timeslots: {suitableTimeSlot}.
          </Text>
        </Box>

        <FlatGrid
          width={"90%"}
          horizontal={true}
          data={tags}
          renderItem={({ item }) => (
            <Box bgColor={"#F9F4F1"} borderRadius="10" px={2} pt={1} h={8}>
              <Text textAlign="center" color={"#898980"}>
                {item.tag}
              </Text>
            </Box>
          )}
        ></FlatGrid>
        {user.user_id !== owner.user_id ? (
          <Button
            mt={9}
            borderRadius={"full"}
            bgColor={"#33CA7F"}
            onPress={() =>
              navigation.navigate("Booking", { fileId: file.file_id })
            }
          >
            <Text color="#F9F4F1" fontWeight={"bold"}>
              Book now
            </Text>
          </Button>
        ) : (
          <Box size={10}></Box>
        )}
      </VStack>
    </Center>
  );
};

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
