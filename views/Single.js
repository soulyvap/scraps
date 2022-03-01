import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { uploadsUrl, defaultAvatar, avatarTag } from "../utils/variables";
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
  const { getFilesByTag } = useTag();
  const [owner, setOwner] = useState({ username: "fetching..." });
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [showModal, setShowModal] = useState(false);
  const { update, setUpdate } = useContext(MainContext);

  const tags = [
    "vegan",
    "vegetarian",
    "nut-free",
    "soy-free",
    "gluten-free",
    "dessert",
    "dairy-free",
    "egg-free",
  ];

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
        <Text fontSize={25} color="#132A15" fontWeight={"bold"} mt={2}>
          {file.title}
        </Text>
        <HStack w={"90%"} h={"13%"} mt={5}>
          <Pressable
            onPress={() => {
              navigation.navigate("Profile", {
                file: file,
              });
            }}
            // >
            //   <Box
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
                <Text color="#132A15" fontSize={16}>
                  {owner.username} didn't list any allergens
                </Text>
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </HStack>
        <Box
          bgColor={"#F9F4F1"}
          w={"90%"}
          h={"40%"}
          borderTopRightRadius="10"
          borderBottomLeftRadius="10"
          borderBottomRightRadius="10"
          shadow={9}
        >
          <ScrollView showsVerticalScrollIndicator>
            <Text m={2} fontSize={"16"} color={"#132A15"}>
              {file.description}
            </Text>
          </ScrollView>
        </Box>
        <FlatGrid
          horizontal={true}
          data={tags}
          renderItem={({ item }) => (
            <Box bgColor={"#F9F4F1"} borderRadius="10" px={2} pt={1} h={8}>
              <Text textAlign="center" color={"#898980"}>
                {item}
              </Text>
            </Box>
          )}
        ></FlatGrid>
        <Button mt={9} borderRadius={"full"} bgColor={"#33CA7F"}>
          <Text color="#F9F4F1" fontWeight={"bold"}>
            Book now
          </Text>
        </Button>
      </VStack>
    </Center>
  );
};

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
