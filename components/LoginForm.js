import {
  Button,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Input,
  Text,
  VStack,
} from "native-base";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLogin, useTag } from "../hooks/ApiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainContext } from "../contexts/MainContext";
import { colors } from "../utils/colors";
import { userFileTag } from "../utils/variables";
import { Feather } from "@expo/vector-icons";

const LoginForm = () => {
  const { postLogin } = useLogin();
  const { update, setUpdate } = useContext(MainContext);
  const { getFilesByTag } = useTag();
  const [failed, setFailed] = useState(false);
  const [showPass, setShowPass] = useState(false);

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
      await AsyncStorage.setItem("userToken", token);
      setUpdate(update + 1);
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

      <HStack alignItems={"center"}>
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
                secureTextEntry={!showPass}
                onFocus={() => setFailed(false)}
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
        <IconButton
          onPress={() => setShowPass(!showPass)}
          position={"absolute"}
          right={2}
          icon={
            <Icon
              size={"sm"}
              color={colors.notBlack}
              as={<Feather name={showPass ? "eye-off" : "eye"} />}
            />
          }
        />
      </HStack>

      <Button bgColor={"#33CA7F"} onPress={handleSubmit(onSubmit)}>
        Login
      </Button>
    </VStack>
  );
};

export default LoginForm;
