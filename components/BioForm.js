import {
  Box,
  Button,
  Heading,
  Image,
  Text,
  TextArea,
  View,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { colors } from "../utils/colors";

const BioForm = ({ setBio }) => {
  const [keyboardShowing, setKeyboardShowing] = useState(false);
  const [bioText, setBioText] = useState();
  let bioAdded = false;

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardShowing(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardShowing(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const logoSize = 220;
  const formBoxHeight = 70;
  const picturePosition = 100 - formBoxHeight;

  return (
    <>
      <View
        flex={1}
        bgColor={"#33CA7F"}
        display={"flex"}
        justifyContent={keyboardShowing ? "flex-start" : "flex-end"}
      >
        <Box
          height={keyboardShowing ? "100%" : formBoxHeight + "%"}
          bgColor={"white"}
          bottom={0}
          borderTopLeftRadius={keyboardShowing ? 0 : 90}
          borderTopRightRadius={keyboardShowing ? 0 : 90}
          alignItems="center"
        >
          <View flex={0.8} />
          <VStack w={"100%"} alignItems="center">
            <Heading>And last but not least ...</Heading>
            <Text>Add a bio to your profile.</Text>
            <TextArea
              value={bioText}
              onChangeText={(input) => setBioText(input)}
              bgColor={colors.beige}
              fontSize={"md"}
              mt={5}
              placeholder="Introduce yourself to your neighbours..."
              p={3}
              textAlign={"left"}
              h={"50%"}
            />
          </VStack>
          <Button
            disabled={bioAdded}
            bgColor={colors.green}
            onPress={() => {
              setBio(bioText);
              bioAdded = true;
            }}
          >
            Save
          </Button>
          <View flex={0.2} />
        </Box>
      </View>
      {!keyboardShowing && (
        <Image
          position={"absolute"}
          source={require("../assets/logo-elevated.png")}
          alt={"scraps-logo"}
          size={logoSize}
          top={picturePosition + "%"}
          left={"50%"}
          style={
            ({},
            {
              transform: [
                { translateX: -logoSize / 2 },
                { translateY: -logoSize / 2 },
              ],
            })
          }
        />
      )}
    </>
  );
};

export default BioForm;
