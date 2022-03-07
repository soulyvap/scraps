import { extendTheme, NativeBaseProvider, TextArea, View } from "native-base";
import React, { useEffect, useState, useContext } from "react";
import CreateUserUI from "../components/UpdateAccountUI";
import LocationForm from "../components/LocationForm";
import { useLogin, useMedia, useTag, useUser } from "../hooks/ApiHooks";
import { avatarTag, userFileTag } from "../utils/variables";
import userFileImage from "../assets/a.jpg";
import { Alert, BackHandler, Image } from "react-native";
import BackButton from "../components/BackButton";
import BioForm from "../components/BioForm";
import UpdateAccountUI from "../components/UpdateAccountUI";
import { MainContext } from "../contexts/MainContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const regForms = {
  user: "user",
};

const UpdateUser = ({ navigation }) => {
  const [success, setSuccess] = useState(false);
  const [bio, setBio] = useState();
  const [formData, setFormData] = useState();
  const [currentForm, setCurrentForm] = useState(regForms.user);
  const { user, setUser } = useContext(MainContext);

  const { putUser } = useUser();
  const { getFilesByTag } = useTag();
  const { putMedia } = useMedia();

  useEffect(() => {
    if (success) {
      navigation.goBack();
    }
  }, [success]);

  //   useEffect(() => {
  //     console.log(currentForm);
  //   }, [currentForm]);

  useEffect(async () => {
    console.log(formData);
    console.log(bio);
    formData && (await updateUser());
  }, [bio]);

  const theme = extendTheme({
    components: {
      Input: {
        baseStyle: {
          borderRadius: 10,
          width: "70%",
          textAlign: "center",
          bgColor: "#F9F4F1",
          borderColor: "transparent",
          alignSelf: "center",
        },
      },
      Button: {
        baseStyle: {
          borderRadius: 15,
          width: "35%",
          alignSelf: "center",
        },
      },
      FormControl: {
        baseStyle: {
          display: "flex",
          alignItems: "center",
          marginBottom: 1,
        },
      },
    },
  });

  //   const fetchUserBio = async () => {
  //     try {
  //       const userFiles = await getFilesByTag(userFileTag + user.user_id);
  //       const userFile = userFiles[0];
  //       const descriptionData = userFile.description;
  //       const allData = JSON.parse(descriptionData);
  //       const bio = allData.bio;
  //       setBio(bio);
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchUserBio();
  //   }, []);

  const updateUser = async () => {
    try {
      delete formData.confirmPassword;
      if (formData.password === "") {
        delete formData.password;
      }
      const userToken = await AsyncStorage.getItem("userToken");
      const userData = await putUser(formData, userToken);
      delete formData.password;
      setUser(formData);
      console.log("Account updated successfully");
      if (userData) {
        Alert.alert("Success!", userData.message);
        navigation.navigate("MyProfile");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  //   const updateBio = async () => {
  //       try {

  //       } catch (error) {
  //           throw new Error(error.message);
  //       }
  //   }

  return (
    <NativeBaseProvider theme={theme}>
      <View flex={1}>
        <BackButton
          top={currentForm === regForms.map ? 0 : "2%"}
          left={currentForm === regForms.map ? 0 : "5%"}
          //   onPress={handleBack}
        />
        <UpdateAccountUI
          setFormData={setFormData}
          // setUserImage={setUserImage}
          setCurrentForm={setCurrentForm}
          formData={formData}
          // userImage={userImage}
          bio={bio}
        />
      </View>
    </NativeBaseProvider>
  );
};

export default UpdateUser;
