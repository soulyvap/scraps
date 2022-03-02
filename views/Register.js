import { extendTheme, NativeBaseProvider, View } from "native-base";
import React, { useEffect, useState } from "react";
import CreateUserUI from "../components/CreateUserUI";
import LocationForm from "../components/LocationForm";
import { useLogin, useMedia, useTag, useUser } from "../hooks/ApiHooks";
import { avatarTag, userFileTag } from "../utils/variables";
import userFileImage from "../assets/a.jpg";
import { Alert, BackHandler, Image } from "react-native";
import BackButton from "../components/BackButton";
import BioForm from "../components/BioForm";

export const regForms = {
  user: "user",
  map: "map",
  bio: "bio",
};

const Register = ({ navigation }) => {
  const [success, setSuccess] = useState(false);
  const [bio, setBio] = useState();
  const [address, setAddress] = useState("");
  const [pinpoint, setPinpoint] = useState();
  const [formData, setFormData] = useState();
  const [userImage, setUserImage] = useState();
  const [currentForm, setCurrentForm] = useState(regForms.user);

  let userToken;
  let userId;

  const { postUser } = useUser();
  const { postLogin } = useLogin();
  const { postTag } = useTag();
  const { postMedia } = useMedia();

  const handleBack = () => {
    switch (currentForm) {
      case regForms.user:
        navigation.goBack();
        break;
      case regForms.map:
        setCurrentForm(regForms.user);
        break;
      case regForms.bio:
        setCurrentForm(regForms.map);
        break;
    }
  };

  useEffect(() => {
    const onBackPress = () => true;

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);

  useEffect(() => {
    if (success) {
      navigation.goBack();
    }
  }, [success]);

  useEffect(() => {
    console.log(currentForm);
  }, [currentForm]);

  useEffect(async () => {
    console.log(formData);
    console.log(address);
    console.log(pinpoint);
    console.log(bio);
    formData && (await createUser());
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

  const createUser = async () => {
    try {
      delete formData.confirmPassword;
      const userData = await postUser(formData);
      console.log("Created successfully with id: ", userData);
      if (userData) {
        await createFilesWithToken();
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const createFilesWithToken = async () => {
    try {
      const userCredentials = {
        username: formData.username,
        password: formData.password,
      };
      const response = await postLogin(userCredentials);
      const id = response.user.user_id;
      const token = response.token;
      userId = id;
      userToken = token;
      await createProfilePic();
      await createUserFile();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const createProfilePic = async () => {
    const formData = new FormData();
    formData.append("title", `profile_${userId}`);
    const filename = userImage.split("/").pop();
    let fileExtension = filename.split(".").pop();
    fileExtension = fileExtension === "jpg" ? "jpeg" : fileExtension;
    formData.append("file", {
      uri: userImage,
      name: filename,
      type: "image/" + fileExtension,
    });
    try {
      const response = await postMedia(formData, userToken);
      const fileId = response.file_id;
      response && console.log("create profile pic", response);
      await addProfilePicTag(fileId);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const addProfilePicTag = async (fileId) => {
    try {
      const tagData = {
        file_id: fileId,
        tag: avatarTag + userId,
      };
      const response = await postTag(tagData, userToken);
      response && console.log("tag added", tagData.tag);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const createUserFile = async () => {
    const formData = new FormData();
    formData.append("title", `userfile_${userId}`);
    const description = JSON.stringify({
      coords: pinpoint,
      address: address,
      bio: bio,
    });
    console.log("userfile desc", description);
    formData.append("description", description);
    const userFileUri = Image.resolveAssetSource(userFileImage).uri;
    formData.append("file", {
      uri: userFileUri,
      name: "a.jpg",
      type: "image/jpg",
    });
    try {
      const response = await postMedia(formData, userToken);
      const fileId = response.file_id;
      response && (await addUserFileTag(fileId));
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const addUserFileTag = async (fileId) => {
    try {
      const tagData = {
        file_id: fileId,
        tag: userFileTag + userId,
      };
      const response = await postTag(tagData, userToken);
      if (response) {
        console.log("tag added", tagData.tag);
        Alert.alert("Success", "User created");
        setSuccess(true);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <NativeBaseProvider theme={theme}>
      <View flex={1}>
        <BackButton
          top={currentForm === regForms.map ? 0 : "2%"}
          left={currentForm === regForms.map ? 0 : "5%"}
          onPress={handleBack}
        />
        {currentForm === regForms.bio ? (
          <BioForm setBio={setBio} />
        ) : currentForm === regForms.map ? (
          <LocationForm
            setAddress={setAddress}
            setPinpoint={setPinpoint}
            address={address}
            pinpoint={pinpoint}
            setCurrentForm={setCurrentForm}
          />
        ) : (
          <CreateUserUI
            setFormData={setFormData}
            setUserImage={setUserImage}
            setCurrentForm={setCurrentForm}
            formData={formData}
            userImage={userImage}
          />
        )}
      </View>
    </NativeBaseProvider>
  );
};

export default Register;
