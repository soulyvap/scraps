import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import List from "../components/List";
import PropTypes from "prop-types";
import { MaterialIcons } from "@expo/vector-icons";
import { MainContext } from "../contexts/MainContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Box,
  Button,
  extendTheme,
  FlatList,
  Heading,
  HStack,
  NativeBaseProvider,
  Pressable,
  Text,
  View,
} from "native-base";
import { foodPostTag, defaultTags } from "../utils/variables";
import { colors } from "../utils/colors";

const Home = ({ navigation }) => {
  const {
    user,
    update,
    coords,
    setUpdate,
    setIsLoggedIn,
    categorySelected,
    setCategorySelected,
    isCategorySelected,
    setIsCategorySelected,
  } = useContext(MainContext);
  const [tagSelected, setTagSelected] = useState(foodPostTag);
  const [tag, setTag] = useState("all");

  const logout = async () => {
    console.log("logout");
    await AsyncStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <>
      <SafeAreaView flex={1}>
        <NativeBaseProvider theme={theme}>
          <Box>
            <View
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Heading fontSize="xl" p="4" pb="3" color={"#132A15"} ml={1}>
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
            <Text
              ml={"5%"}
              fontSize={17}
              fontWeight={"bold"}
              mt={1}
              color={"#132A15"}
            >
              Search by tags
            </Text>
            <FlatList
              horizontal
              w={"90%"}
              alignSelf={"center"}
              data={defaultTags}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    if (item.text === "all") {
                      setTagSelected(foodPostTag);
                      setTag("all");
                    } else {
                      setTagSelected(item.text);
                      setTag(item.text);
                    }
                    setUpdate(update + 1);
                  }}
                >
                  <Box mx={1} mt={1} p={1} alignSelf="center" height={10}>
                    <Text
                      color={tag === item.text ? colors.notBlack : colors.green}
                      textAlign={"center"}
                      fontWeight={"bold"}
                      fontSize={16}
                    >
                      {item.text}
                    </Text>
                  </Box>
                </Pressable>
              )}
            ></FlatList>
            <Text ml={"5%"} fontSize={17} fontWeight={"bold"} color={"#132A15"}>
              Select a category
            </Text>
            <HStack
              w={"90%"}
              alignSelf={"center"}
              justifyContent={"space-evenly"}
              my={3}
            >
              <Button
                bgColor={
                  categorySelected === "" ? colors.notBlack : colors.green
                }
                onPress={() => {
                  setCategorySelected("");
                  setIsCategorySelected(false);
                }}
              >
                All
              </Button>
              <Button
                bgColor={
                  categorySelected === "cooked" ? colors.notBlack : colors.green
                }
                onPress={() => {
                  setCategorySelected("cooked");
                  setIsCategorySelected(true);
                }}
              >
                Cooked
              </Button>
              <Button
                bgColor={
                  categorySelected === "uncooked"
                    ? colors.notBlack
                    : colors.green
                }
                onPress={() => {
                  setCategorySelected("uncooked");
                  setIsCategorySelected(true);
                }}
              >
                Uncooked
              </Button>
              <Button
                bgColor={
                  categorySelected === "frozen" ? colors.notBlack : colors.green
                }
                onPress={() => {
                  setCategorySelected("frozen");
                  setIsCategorySelected(true);
                }}
              >
                Frozen
              </Button>
            </HStack>
          </Box>
          <List navigation={navigation} tagSelected={tagSelected} />
        </NativeBaseProvider>
      </SafeAreaView>
    </>
  );
};

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
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

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
