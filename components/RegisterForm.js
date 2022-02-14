import {
  Avatar,
  Box,
  Button,
  FormControl,
  Image,
  Input,
  Text,
  View,
} from "native-base";
import react, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";

const RegisterForm = () => {
  const [image, setImage] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
  );
  const [type, setType] = useState("image");
  const [imageSelected, setImageSelected] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
      setImageSelected(true);
      setType(result.type);
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
  const onSubmit = async (data) => {};

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
          required: true,
          pattern:
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
                Username is required
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
          <FormControl isRequired isInvalid={errors.password}>
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
        name="confirm-password"
      />

      <Button mt={3} bgColor={"#33CA7F"} onPress={handleSubmit(onSubmit)}>
        Sign up!
      </Button>
    </Box>
  );
};

export default RegisterForm;
