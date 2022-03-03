import React, { useContext, useState } from "react";
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

const Home = ({ navigation }) => {
  const {
    user,
    update,
    setUpdate,
    categorySelected,
    setCategorySelected,
    isCategorySelected,
    setIsCategorySelected,
  } = useContext(MainContext);
  const [tagSelected, setTagSelected] = useState(foodPostTag);

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
              Tags:
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
                    } else {
                      setTagSelected(item.text);
                    }
                    console.log(tagSelected);
                    setUpdate(update + 1);
                  }}
                >
                  <Box mx={1} mt={1} p={1} alignSelf="center" height={10}>
                    <Text
                      color={"#33CA7F"}
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
              Categories:
            </Text>
            <HStack
              w={"90%"}
              alignSelf={"center"}
              justifyContent={"space-evenly"}
              my={3}
            >
              <Button
                onPress={() => {
                  setTagSelected(foodPostTag);
                  setCategorySelected("");
                  setIsCategorySelected(false);
                  setUpdate(update + 1);
                }}
              >
                All
              </Button>
              <Button
                onPress={() => {
                  setCategorySelected("cooked");
                  setIsCategorySelected(true);
                  setUpdate(update + 1);
                }}
              >
                Cooked
              </Button>
              <Button
                onPress={() => {
                  setCategorySelected("uncooked");
                  setIsCategorySelected(true);
                  setUpdate(update + 1);
                }}
              >
                Uncooked
              </Button>
              <Button
                onPress={() => {
                  setCategorySelected("frozen");
                  setIsCategorySelected(true);
                  setUpdate(update + 1);
                }}
              >
                Frozen
              </Button>
            </HStack>
          </Box>
          <List
            navigation={navigation}
            tagSelected={tagSelected}
            isCategorySelected={isCategorySelected}
          />
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
