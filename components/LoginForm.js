import { Box, Button, FormControl, Input, Text } from "native-base";
import react from "react";
import { Controller, useForm } from "react-hook-form";

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data) => console.log(data);

  return (
    <Box>
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
              placeholder={"your email"}
              autoCapitalize="none"
            />
            {errors.email && (
              <FormControl.ErrorMessage>
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

      <Button mt={3} bgColor={"#33CA7F"} onPress={handleSubmit(onSubmit)}>
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
