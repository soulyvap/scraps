import {
  Box,
  Button,
  extendTheme,
  FormControl,
  Icon,
  IconButton,
  Input,
  NativeBaseProvider,
  TextArea,
  View,
  VStack,
} from "native-base";
import React, { useEffect, useState, useContext } from "react";
import LocationForm from "../components/LocationForm";
import { useLogin, useMedia, useTag, useUser } from "../hooks/ApiHooks";
import { avatarTag, userFileTag } from "../utils/variables";
import userFileImage from "../assets/a.jpg";
import { Alert, BackHandler, Image, Keyboard } from "react-native";
import BackButton from "../components/BackButton";
import BioForm from "../components/BioForm";
import { MainContext } from "../contexts/MainContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Controller, useForm } from "react-hook-form";
import { MaterialIcons } from "@expo/vector-icons";

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

  const { checkUsername } = useUser();

  console.log(user);

  const defVal = {
    email: user.email,
    username: user.username,
    full_name: user.full_name,
    password: "",
    confirmPassword: "",
  };

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

  // useEffect(() => {
  //   if (formData) {
  //     console.log(formData);
  //     setValue("email", formData.email);
  //     setValue("username", formData.username);
  //     setValue("full_name", formData.full_name);
  //     setValue("password", formData.password);
  //     setValue("confirmPassword", formData.confirmPassword);
  //   }
  // }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: defVal,
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      delete data.confirmPassword;
      if (data.password === "") {
        delete data.password;
      }
      const userToken = await AsyncStorage.getItem("userToken");
      const userData = await putUser(data, userToken);
      console.log("edit profile data onSubmit", userData);
      delete data.password;
      setUser(data);
      if (userData) {
        Alert.alert("Success!", userData.message);
        // navigation.navigate("Profile");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   if (success) {
  //     navigation.goBack();
  //   }
  // }, [success]);

  // useEffect(() => {
  //   console.log(currentForm);
  // }, [currentForm]);

  // useEffect(async () => {
  //   console.log(formData);
  //   // console.log(bio);
  //   formData && (await updateUser());
  // }, []);

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

  // const updateUser = async (formData) => {
  //   try {
  //     delete formData.confirmPassword;
  //     if (formData.password === "") {
  //       delete formData.password;
  //     }
  //     const userToken = await AsyncStorage.getItem("userToken");
  //     const userData = await putUser(formData, userToken);
  //     delete formData.password;
  //     setUser(formData);
  //     console.log("Account updated successfully");
  //     if (userData) {
  //       Alert.alert("Success!", userData.message);
  //       navigation.navigate("MyProfile");
  //     }
  //   } catch (error) {
  //     throw new Error("update user", error.message);
  //   }
  // };

  //   const updateBio = async () => {
  //       try {

  //       } catch (error) {
  //           throw new Error(error.message);
  //       }
  //   }

  return (
    <NativeBaseProvider theme={theme}>
      <View flex={1}>
        <View
          flex={1}
          bgColor={"#33CA7F"}
          display={"flex"}
          justifyContent={keyboardShowing ? "flex-start" : "flex-end"}
        >
          <Box position={"absolute"} top={5} left={5} w={10} h={10}>
            <IconButton
              icon={<Icon as={MaterialIcons} name="arrow-back" />}
              size={7}
              color="#132A15"
              onPress={() => {
                navigation.goBack();
              }}
            />
          </Box>
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
            <VStack space={1}>
              {/* <View flexDirection={"row"} justifyContent={"center"} mb={2}>
        <Avatar mr={5} source={{ uri: pic }} alt="profile-pic" size={100} />
        <Button bgColor={"#898980"} w={100} onPress={pickImage}>
          Choose File
        </Button>
      </View> */}
              <Controller
                control={control}
                rules={{
                  required: true,
                  pattern:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl isRequired isInvalid={errors.email}>
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={"email"}
                      autoCapitalize="none"
                    />
                    {errors.email && (
                      <FormControl.ErrorMessage my={0}>
                        Please enter a valid email address
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>
                )}
                name="email"
              />

              <Controller
                control={control}
                rules={{
                  required: { value: true, message: "Username is required." },
                  minLength: {
                    value: 3,
                    message: "Username should be at least 3 characters",
                  },
                  validate: async (value) => {
                    const usernameInfo = await checkUsername(value);
                    if (usernameInfo.available || user.username === value) {
                      return true;
                    } else {
                      return `${usernameInfo.username} is already taken`;
                    }
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl isRequired isInvalid={errors.username}>
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={"username"}
                      autoCapitalize="none"
                    />
                    {errors.username && (
                      <FormControl.ErrorMessage my={0}>
                        {errors.username.message}
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>
                )}
                name="username"
              />

              <Controller
                control={control}
                rules={{
                  required: { value: true, message: "Full name is required." },
                  minLength: {
                    value: 3,
                    message: "Full name should be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z]+ [a-zA-Z]+$/,
                    message: "Invalid format (firstname lastname)",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl isRequired isInvalid={errors.full_name}>
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={"full name"}
                      autoCapitalize="words"
                    />
                    {errors.full_name && (
                      <FormControl.ErrorMessage my={0}>
                        {errors.full_name.message}
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>
                )}
                name="full_name"
              />

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl isRequired isInvalid={errors.password}>
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={"new password"}
                      autoCapitalize="none"
                      secureTextEntry={true}
                    />
                    {errors.password ? (
                      <FormControl.ErrorMessage my={0}>
                        Password is required
                      </FormControl.ErrorMessage>
                    ) : (
                      <></>
                    )}
                  </FormControl>
                )}
                name="password"
              />

              <Controller
                control={control}
                rules={{
                  validate: (value) => {
                    const { password } = getValues();
                    if (password === value) {
                      return true;
                    } else {
                      return "Passwords must match";
                    }
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormControl isRequired isInvalid={errors.confirmPassword}>
                    <Input
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={"confirm password"}
                      autoCapitalize="none"
                      secureTextEntry={true}
                    />
                    {errors.confirmPassword ? (
                      <FormControl.ErrorMessage my={0}>
                        {errors.confirmPassword.message}
                      </FormControl.ErrorMessage>
                    ) : (
                      <></>
                    )}
                  </FormControl>
                )}
                name="confirmPassword"
              />

              <Button
                mt={2}
                bgColor={"#33CA7F"}
                onPress={handleSubmit(onSubmit)}
              >
                Submit
              </Button>
            </VStack>
            <View flex={0.3}></View>
          </Box>
        </View>
      </View>
    </NativeBaseProvider>
  );
};

export default UpdateUser;
