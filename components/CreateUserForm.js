import { Avatar, Button, FormControl, Input, View, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../hooks/ApiHooks";
import { regForms } from "../views/Register";

const RegisterForm = ({
  setFormData,
  setUserImage,
  setCurrentForm,
  formData,
  userImage,
}) => {
  const [pic, setPic] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
  );
  const { checkUsername } = useUser();

  const defVal = {
    email: "",
    username: "",
    full_name: "",
    password: "",
    confirmPassword: "",
  };

  //image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      aspect: [1, 1],
    });
    if (!result.cancelled) {
      setPic(result.uri);
    }
  };

  //prefilling inputs with current values if user happens to come back to this form while still registering.
  useEffect(() => {
    if (typeof userImage !== "undefined") setPic(userImage);
    if (formData) {
      setValue("email", formData.email);
      setValue("username", formData.username);
      setValue("full_name", formData.full_name);
      setValue("password", formData.password);
      setValue("confirmPassword", formData.confirmPassword);
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: defVal,
  });
  const onSubmit = async (data) => {
    setUserImage(pic);
    setFormData(data);
    setCurrentForm(regForms.map);
  };

  return (
    <VStack space={1}>
      <View flexDirection={"row"} justifyContent={"center"} mb={2}>
        <Avatar mr={5} source={{ uri: pic }} alt="profile-pic" size={100} />
        <Button bgColor={"#898980"} w={100} onPress={pickImage}>
          Choose File
        </Button>
      </View>
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
              size={"md"}
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
              size={"md"}
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
              size={"md"}
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
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isRequired isInvalid={errors.password}>
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              size={"md"}
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
              size={"md"}
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

      <Button mt={2} bgColor={"#33CA7F"} onPress={handleSubmit(onSubmit)}>
        Next
      </Button>
    </VStack>
  );
};

export default RegisterForm;
