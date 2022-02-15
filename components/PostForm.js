import {
  Box,
  Button,
  FormControl,
  Input,
  Text,
  TextArea,
  View,
} from "native-base";
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
      {/* Add title */}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isRequired isInvalid={errors.title}>
            <FormControl.Label
              _text={{
                color: "#132A15",
                fontWeight: "bold",
                fontSize: "lg",
              }}
            >
              Add title
            </FormControl.Label>
            <Input
              autoCapitalize="none"
              placeholder={"Green salad"}
              onBlur={onBlur}
              onChangeText={onChange}
              size="lg"
            />
          </FormControl>
        )}
        name="title"
      />

      {/* Date selection */}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={errors.title}>
            <FormControl.Label
              _text={{
                color: "#132A15",
                fontWeight: "bold",
                fontSize: "lg",
              }}
            >
              Select latest pick-up date
            </FormControl.Label>
          </FormControl>
        )}
        name="time"
      />

      {/* Add description */}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={errors.description}>
            <FormControl.Label
              _text={{
                color: "#132A15",
                fontWeight: "bold",
                fontSize: "lg",
              }}
            >
              Add a description
            </FormControl.Label>
            <TextArea
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              size="lg"
            />
          </FormControl>
        )}
        name="description"
      />

      {/* Add pictures */}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={errors.picture}>
            <FormControl.Label
              _text={{
                color: "#132A15",
                fontWeight: "bold",
                fontSize: "lg",
              }}
            >
              Add pictures
            </FormControl.Label>
            <Box
              bgColor={"#F9F4F1"}
              borderRadius={15}
              flex={1}
              marginBottom={"5%"}
              paddingY={"3%"}
            >
              <View flexDirection={"row"} justifyContent={"flex-start"} px={4}>
                <Button bgColor={"#898980"} borderRadius={15} w={100}>
                  Choose File
                </Button>
                <Text alignSelf={"center"} marginLeft={5}>
                  placeholder.jpg
                </Text>
              </View>
            </Box>
          </FormControl>
        )}
        name="picture"
      />

      {/* Select category */}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isRequired isInvalid={errors.category}>
            <FormControl.Label
              _text={{
                color: "#132A15",
                fontWeight: "bold",
                fontSize: "lg",
              }}
            >
              Select a category
            </FormControl.Label>
            <Button.Group direction="row" justifyContent={"space-between"}>
              <Button borderRadius={15} width={"30%"}>
                Uncooked
              </Button>
              <Button borderRadius={15} width={"30%"}>
                Cooked
              </Button>
              <Button borderRadius={15} width={"30%"}>
                Frozen
              </Button>
            </Button.Group>
          </FormControl>
        )}
        name="category"
      />
    </Box>
  );
};

export default PostForm;
