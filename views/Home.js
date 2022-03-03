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
  Flex,
  Heading,
  Icon,
  Input,
  NativeBaseProvider,
  Pressable,
  Text,
  View,
} from "native-base";
import { defaultTags, foodPostTag } from "../utils/variables";

const Home = ({ navigation }) => {
  const { user, update, setUpdate } = useContext(MainContext);
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
                  setTagSelected(item.text);
                  console.log(tagSelected);
                  setUpdate(update + 1);
                }}
              >
                <Box mx={1} my={3} p={1} alignSelf="center" height={10}>
                  <Text
                    color={"#33CA7F"}
                    textAlign={"center"}
                    fontWeight={"bold"}
                  >
                    {item.text}
                  </Text>
                </Box>
              </Pressable>
            )}
          ></FlatList>
          <Text
            ml={"5%"}
            fontSize={17}
            fontWeight={"bold"}
            mb={2}
            color={"#132A15"}
          >
            Categories:
          </Text>
          <Flex direction="row" justifyContent="space-evenly" mb={3}>
            <Button>Uncooked</Button>
            <Button>Cooked</Button>
            <Button>Frozen</Button>
          </Flex>
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

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
