import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import List from "../components/List";
import PropTypes from "prop-types";
import { MainContext } from "../contexts/MainContext";
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
} from "native-base";
import { foodPostTag, defaultTags } from "../utils/variables";
import { colors } from "../utils/colors";
import LogoutButton from "../components/LogoutButton";

const Home = ({ navigation }) => {
  const {
    user,
    update,
    setUpdate,
    categorySelected,
    setCategorySelected,
    setIsCategorySelected,
  } = useContext(MainContext);
  const [tagSelected, setTagSelected] = useState(foodPostTag);
  const [tag, setTag] = useState("all");

  return (
    <>
      <SafeAreaView flex={1}>
        <NativeBaseProvider theme={theme}>
          <Box w={"90%"} alignSelf={"center"} mt={5}>
            <HStack justifyContent={"space-between"} alignItems={"center"}>
              <Heading fontSize="xl" pb="3" color={colors.notBlack}>
                Hi, {user.username}!
              </Heading>
              <LogoutButton top={0} right={3}></LogoutButton>
            </HStack>
            <Text fontSize={17} fontWeight={"bold"} mt={1} color={"#132A15"}>
              Search by tags
            </Text>
            <FlatList
              horizontal
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
                  <Box mt={2} mr={4} p={1} alignSelf="center" height={10}>
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
            <Text fontSize={17} fontWeight={"bold"} color={"#132A15"}>
              Select a category
            </Text>
            <HStack
              w={"100%"}
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
