import { Box, Image, TextArea, View } from "native-base";
import react, { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import UpdateAccountForm from "./UpdateAccountForm";

const UpdateAccountUI = ({
  setFormData,
  //   setUserImage,
  setCurrentForm,
  formData,
  //   bio,
  //   userImage,
}) => {
  const [keyboardShowing, setKeyboardShowing] = useState(false);

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

  const formBoxHeight = 90;

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
          {/* <TextArea
            value={bio}
            onChangeText={(input) => setBioText(input)}
            //   bgColor={colors.beige}
            fontSize={"md"}
            mt={5}
            placeholder="Introduce yourself to your neighbours..."
            p={3}
            textAlign={"left"}
            h={"20%"}
          /> */}
          <UpdateAccountForm
            setFormData={setFormData}
            // setUserImage={setUserImage}
            setCurrentForm={setCurrentForm}
            formData={formData}
            // userImage={userImage}
          />
          <View flex={0.3}></View>
        </Box>
      </View>
    </>
  );
};

export default UpdateAccountUI;
