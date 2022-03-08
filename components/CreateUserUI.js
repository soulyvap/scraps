import { Box, Image, View } from "native-base";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import CreateUserForm from "./CreateUserForm";

const CreateUserUI = ({
  setFormData,
  setUserImage,
  setCurrentForm,
  formData,
  userImage,
}) => {
  const [keyboardShowing, setKeyboardShowing] = useState(false);

  //listener for on screen keyboard. helps with adapting ui when keyboard is displayed
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

  const logoSize = 170;
  const formBoxHeight = 85;
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
        >
          <View flex={1}></View>
          <CreateUserForm
            setFormData={setFormData}
            setUserImage={setUserImage}
            setCurrentForm={setCurrentForm}
            formData={formData}
            userImage={userImage}
          />
          <View flex={0.3}></View>
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

export default CreateUserUI;
