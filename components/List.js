import React, { useContext, useState } from "react";
import {
  Avatar,
  Button,
  extendTheme,
  Flex,
  Heading,
  Icon,
  Input,
  Text,
  View,
  VStack,
} from "native-base";
import { useMedia } from "../hooks/ApiHooks";
import ListItem from "./ListItem";
import PropTypes from "prop-types";
import { FlatGrid } from "react-native-super-grid";
import { MaterialIcons } from "@expo/vector-icons";
import { MainContext } from "../contexts/MainContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: tag categories are currently hardcoded
// need to decide on the categories/tags before this can be changed
const tagCategories = [
  {
    key: 1,
    title: "vegan",
    image:
      "https://images.pexels.com/photos/35629/bing-cherries-ripe-red-fruit.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    key: 2,
    title: "vegetarian",
    image:
      "https://images.pexels.com/photos/35629/bing-cherries-ripe-red-fruit.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    key: 3,
    title: "gluten-free",
    image:
      "https://images.pexels.com/photos/35629/bing-cherries-ripe-red-fruit.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    key: 4,
    title: "nut-free",
    image:
      "https://images.pexels.com/photos/35629/bing-cherries-ripe-red-fruit.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    key: 5,
    title: "egg-free",
    image:
      "https://images.pexels.com/photos/35629/bing-cherries-ripe-red-fruit.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    key: 6,
    title: "lactose-free",
    image:
      "https://images.pexels.com/photos/35629/bing-cherries-ripe-red-fruit.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    key: 7,
    title: "dairy-free",
    image:
      "https://images.pexels.com/photos/35629/bing-cherries-ripe-red-fruit.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

const List = ({ navigation }) => {
  const { mediaArray } = useMedia();
  const { user, setIsLoggedIn } = useContext(MainContext);

  const logout = async () => {
    console.log("logout");
    await AsyncStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <View flex={1}>
      <View
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Heading fontSize="xl" p="4" pb="3" color={"#132A15"}>
          Hi, {user.username}!
        </Heading>
        <Button
          bgColor={"#132A15"}
          paddingY={2}
          mr={3}
          shadow={3}
          _text={{ color: "#F9F4F1", fontWeight: "bold" }}
          borderRadius="full"
          onPress={() => logout()}
        >
          Logout
        </Button>
      </View>

      {/* TODO: implement search functionality */}
      <Input
        alignSelf="center"
        placeholder="Search..."
        placeholderTextColor={"#898980"}
        color={"#132A15"}
        w="95%"
        h={9}
        variant="rounded"
        size="md"
        paddingLeft="5"
        bgColor="#F9F4F1"
        InputRightElement={
          <Icon
            as={<MaterialIcons name="search" />}
            size={5}
            mr="3"
            color="#898980"
            onPress={() => console.log("Execute search")}
          />
        }
      ></Input>
      <FlatGrid
        itemDimension={60}
        height={120}
        horizontal={true}
        data={tagCategories}
        renderItem={({ item }) => (
          <VStack alignItems="center">
            <Avatar source={{ uri: item.image }} />
            <Text color={"#132A15"}>{item.title}</Text>
          </VStack>
        )}
      ></FlatGrid>
      <Flex direction="row" justifyContent="space-evenly" mt={2} mb={2}>
        {/* TODO: implement onPress actions */}
        <Button>Uncooked</Button>
        <Button>Cooked</Button>
        <Button>Frozen</Button>
      </Flex>
      <FlatGrid
        itemDimension={140}
        data={mediaArray}
        keyExtractor={(item) => item.file_id.toString()}
        renderItem={({ item }) => (
          <ListItem navigation={navigation} singleMedia={item} />
        )}
      ></FlatGrid>
    </View>
  );
};

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        w: "25%",
        shadow: 3,
        _text: { color: "#F9F4F1", fontWeight: "bold" },
        borderRadius: "full",
      },
      defaultProps: {
        bgColor: "#33CA7F",
      },
    },
  },
});

List.propTypes = {
  navigation: PropTypes.object,
};

export default List;
