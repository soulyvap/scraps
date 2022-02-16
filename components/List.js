import React from "react";
import {
  Avatar,
  Button,
  Divider,
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

  return (
    <View>
      <Heading fontSize="xl" p="4" pb="3" color={"#132A15"}>
        {/* TODO: need login ready so I can get username */}
        Hi, Ilkka!
      </Heading>
      <Input
        alignSelf="center"
        placeholder="Search..."
        placeholderTextColor={"#898980"}
        color={"#132A15"}
        w="95%"
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
          />
        }
      ></Input>
      <FlatGrid
        itemDimension={60}
        height={100}
        // fixed={true}
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
        {/* TODO: implement color themes to change button color, onPress actions */}
        <Button
          w="25%"
          bgColor={"#33CA7F"}
          shadow={3}
          _text={{ color: "#F9F4F1", fontWeight: "bold" }}
          borderRadius="full"
        >
          Uncooked
        </Button>
        <Button
          w="25%"
          bgColor={"#33CA7F"}
          shadow={3}
          _text={{ color: "#F9F4F1", fontWeight: "bold" }}
          borderRadius="full"
        >
          Cooked
        </Button>
        <Button
          w="25%"
          bgColor={"#33CA7F"}
          shadow={3}
          _text={{ color: "#F9F4F1", fontWeight: "bold" }}
          borderRadius="full"
        >
          Frozen
        </Button>
      </Flex>
      <Divider mt={2} bg={"#898980"} />
      <FlatGrid
        itemDimension={120}
        data={mediaArray}
        keyExtractor={(item) => item.file_id.toString()}
        renderItem={({ item }) => (
          <ListItem navigation={navigation} singleMedia={item} />
        )}
      ></FlatGrid>
    </View>
  );
};

List.propTypes = {
  navigation: PropTypes.object,
};

export default List;
