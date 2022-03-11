import { Button, FormControl, Input, Text, VStack } from "native-base";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLogin } from "../hooks/ApiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainContext } from "../contexts/MainContext";
import { colors } from "../utils/colors";

const LoginForm = () => {
  const { postLogin } = useLogin();
  const { setUser, setIsLoggedIn } = useContext(MainContext);
  const [failed, setFailed] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  //on submit, form data is used to login.
  //if successful, user is logged in and userData is stored in MainContext
  const onSubmit = async (data) => {
    try {
      const loginData = await postLogin(data);
      const token = loginData.token;
      setIsLoggedIn(true);
      setUser(loginData.user);
      await AsyncStorage.setItem("userToken", token);
    } catch (error) {
      setFailed(true);
      throw new Error(error.message);
    }
  };

  return (
    <VStack space={2}>
      {failed && (
        <Text color={colors.red} fontSize={13} textAlign={"center"}>
          Wrong username or password
        </Text>
      )}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isRequired isInvalid={errors.username}>
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={"username"}
              autoCapitalize="none"
              onFocus={() => setFailed(false)}
              size={"md"}
            />
            {errors.username && (
              <FormControl.ErrorMessage>
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
          <FormControl isRequired isInvalid={errors.password}>
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={"password"}
              autoCapitalize="none"
              secureTextEntry={true}
              onFocus={() => setFailed(false)}
              size={"md"}
            />
            {errors.password ? (
              <FormControl.ErrorMessage>
                Password is required
              </FormControl.ErrorMessage>
            ) : (
              <></>
            )}
          </FormControl>
        )}
        name="password"
      />

      <Button bgColor={"#33CA7F"} onPress={handleSubmit(onSubmit)}>
        Login
      </Button>
    </VStack>
  );
};

export default LoginForm;
