import { Avatar, Box, Button, FormControl, Input, View } from "native-base";
import react, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useLogin, useMedia, useTag, useUser } from "../hooks/ApiHooks";
import userFileImage from "../assets/a.jpg";
import { avatarTag, userFileTag } from "../utils/variables";
import { Alert, Image } from "react-native";

const RegisterForm = () => {
  const [image, setImage] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
  );
  let address = "";
  let userCredentials = {};
  let userToken;
  let userId;
  const { postUser, checkUsername } = useUser();
  const { postLogin } = useLogin();
  const { postTag } = useTag();
  const { postMedia } = useMedia();

  const createUser = async (data) => {
    try {
      delete data.confirmPassword;
      delete data.address;
      const userData = await postUser(data);
      console.log("Created successfully with id: ", userData);
      if (userData) {
        Alert.alert("Success", "User created");
        await createFilesWithToken();
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const createFilesWithToken = async () => {
    try {
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
    const filename = image.split("/").pop();
    let fileExtension = filename.split(".").pop();
    fileExtension = fileExtension === "jpg" ? "jpeg" : fileExtension;
    formData.append("file", {
      uri: image,
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
      response && console.log("tag added" + tagData.tag);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const createUserFile = async () => {
    const formData = new FormData();
    formData.append("title", `userfile_${userId}`);
    const description = JSON.stringify(address);
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
      response && console.log("tag added", tagData.tag);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
      username: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data) => {
    address = data.address;
    userCredentials = { username: data.username, password: data.password };
    await createUser(data);
  };

  return (
    <Box>
      <View flexDirection={"row"} justifyContent={"center"} mb={2}>
        <Avatar mr={5} source={{ uri: image }} alt="profile-pic" size={100} />
        <Button bgColor={"#898980"} w={100} onPress={pickImage}>
          Choose File
        </Button>
      </View>
      <Controller
        control={control}
        rules={{
          required: true,
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
                Email is required
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
          validate: async (value) => {
            const usernameInfo = await checkUsername(value);
            if (usernameInfo.available) {
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
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isRequired isInvalid={errors.address}>
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={"address"}
              autoCapitalize="none"
            />
            {errors.address && (
              <FormControl.ErrorMessage my={0}>
                Address is required
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        )}
        name="address"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isRequired isInvalid={errors.password}>
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={"password"}
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
          required: { value: true, message: "This is required." },
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

      <Button mt={3} bgColor={"#33CA7F"} onPress={handleSubmit(onSubmit)}>
        Sign up!
      </Button>
    </Box>
  );
};

export default RegisterForm;
