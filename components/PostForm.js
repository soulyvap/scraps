import { Box, Button, FormControl, Input, Text } from "native-base";
import react from "react";
import { Controller, useForm } from "react-hook-form";

const PostForm = () => {
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

  return (
    <Box>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isRequired isInvalid={errors.title}>
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={"Green salad"}
              autoCapitalize="none"
            />
          </FormControl>
        )}
        name="title"
      />
    </Box>
  );
};

export default PostForm;
