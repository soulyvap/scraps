import {
  Avatar,
  Box,
  Button,
  FormControl,
  Input,
  Text,
  TextArea,
  View,
} from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import react, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useMedia, useTag } from "../hooks/ApiHooks";

const PostForm = () => {
  const [date, setDate] = useState(new Date());
  // TODO: delete mode states???
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState("");
  const [image, setImage] = useState("https://place-hold.it/50&text=test");
  const [category, setCategory] = useState("uncooked");
  const { postMedia } = useMedia;
  const { postTag } = useTag;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      time: "",
      description: "",
    },
  });

  const onChanged = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    split(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  // Converts original DatePicker value to more pleasant one,
  // for displaying it in the Text component.
  const split = (original) => {
    const modified = original.toString();
    const splitted = modified.split(" ", 4);
    let final = "";

    for (let i = 0; i < splitted.length; i++) {
      i === 0 ? (final = splitted[i]) : (final = final + "/" + splitted[i]);
    }
    setDateText(final);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const onSubmit = async (data) => {
    console.log("onSubmit data: ", data);
    const filename = image.split("/").pop();
    console.log("onSubmit filename: ", filename);
    let fileExtension = filename.split(".").pop();
    fileExtension = fileExtension === "jpg" ? "jpeg" : fileExtension;
    console.log("onSubmit fileExtension: ", fileExtension);
    const test = category;
    console.log("onSubmit category: ", test);
    console.log("onSubmit dateText: ", dateText);

    /* const formData = new FormData();
    formData */
  };

  return (
    <Box marginTop={"4%"}>
      {/* Add title */}
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: "This is required.",
          },
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
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={"Green salad"}
              size="lg"
              value={value}
              variant={"basic"}
            />
            {errors.title && (
              <FormControl.ErrorMessage my={0}>
                {errors.title.message}
              </FormControl.ErrorMessage>
            )}
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
              Select latest pick-up date & when you are available
            </FormControl.Label>
            <View>
              <Text
                alignSelf={"flex-start"}
                marginBottom={"1.5%"}
                marginTop={"1%"}
              >
                {dateText}
              </Text>
              <Input
                alignSelf={"flex-start"}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="e.g. any time between 4PM and 9PM"
                size={"lg"}
                value={value}
                variant={"basic"}
                width={"80%"}
              />
              <Button
                alignSelf={"flex-end"}
                bgColor={"#FED766"}
                borderRadius={"full"}
                onPress={showDatepicker}
                position={"absolute"}
                _text={{
                  color: "black",
                }}
              >
                IC
              </Button>
              {show && (
                <DateTimePicker
                  display="default"
                  mode={mode}
                  onChange={onChanged}
                  testID="dateTimePicker"
                  value={date}
                />
              )}
            </View>
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
              variant={"basic"}
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
              Add a picture
            </FormControl.Label>
            <Box
              bgColor={"#F9F4F1"}
              borderRadius={15}
              flex={1}
              marginBottom={"5%"}
              paddingY={"3%"}
            >
              <View flexDirection={"row"} justifyContent={"flex-start"} px={4}>
                <Button
                  bgColor={"#898980"}
                  borderRadius={15}
                  onPress={pickImage}
                  w={100}
                >
                  Choose File
                </Button>
                <Avatar
                  alt="selected image"
                  marginX={"auto"}
                  size={39}
                  source={{ uri: image }}
                ></Avatar>
              </View>
            </Box>
          </FormControl>
        )}
        name="picture"
      />

      {/* Select category */}
      <Controller
        control={control}
        // rules={{
        //   required: { value: true, message: "This is required." },
        // }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={errors.category}>
            <FormControl.Label
              _text={{
                color: "#132A15",
                fontWeight: "bold",
                fontSize: "lg",
              }}
            >
              Select a category
            </FormControl.Label>
            <Button.Group
              direction="row"
              justifyContent={"space-between"}
              marginBottom={"5%"}
            >
              <Button
                bgColor={"#132A15"}
                borderRadius={15}
                onBlur={onBlur}
                onChange={onChange}
                onPress={setCategory("uncooked")}
                width={"30%"}
                _focus={{
                  bgColor: "#33CA7F",
                }}
              >
                Uncooked
              </Button>
              <Button
                bgColor={"#132A15"}
                borderRadius={15}
                onBlur={onBlur}
                onChange={onChange}
                onPress={setCategory("cooked")}
                width={"30%"}
                _focus={{
                  bgColor: "#33CA7F",
                }}
              >
                Cooked
              </Button>
              <Button
                bgColor={"#132A15"}
                borderRadius={15}
                onBlur={onBlur}
                onChange={onChange}
                onPress={setCategory("frozen")}
                width={"30%"}
                _focus={{
                  bgColor: "#33CA7F",
                }}
              >
                Frozen
              </Button>
            </Button.Group>
            {errors.category && (
              <FormControl.ErrorMessage>
                {errors.category.message}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        )}
        name="category"
      />

      {/* Add tags */}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl isInvalid={errors.tags}>
            <FormControl.Label
              _text={{
                color: "#132A15",
                fontWeight: "bold",
                fontSize: "lg",
              }}
            >
              Add tags
            </FormControl.Label>
            <Box
              bgColor={"#F9F4F1"}
              borderRadius={15}
              flex={1}
              marginBottom={"5%"}
              paddingY={"3%"}
            >
              <View
                flexDirection={"row"}
                flexWrap={"wrap"}
                justifyContent={"space-between"}
                px={4}
              >
                <Button bgColor={"#898980"} borderRadius={20} w={100}>
                  dairy-free
                </Button>
                <Button bgColor={"#898980"} borderRadius={20} w={100}>
                  egg-free
                </Button>
                <Button bgColor={"#898980"} borderRadius={20} w={100}>
                  gluten-free
                </Button>
                <Button bgColor={"#898980"} borderRadius={20} w={100}>
                  lactose-free
                </Button>
                <Button bgColor={"#898980"} borderRadius={20} w={100}>
                  nut-free
                </Button>
                <Button bgColor={"#898980"} borderRadius={20} w={100}>
                  vegan
                </Button>
                <Button bgColor={"#898980"} borderRadius={20} w={100}>
                  vegetarian
                </Button>
              </View>
            </Box>
          </FormControl>
        )}
        name="tags"
      />
      <Button
        alignSelf={"center"}
        bgColor={"#33CA7F"}
        borderRadius={15}
        marginTop={"5%"}
        marginBottom={"5%"}
        onPress={handleSubmit(onSubmit)}
        padding={"3%"}
        width={"40%"}
      >
        Post
      </Button>
    </Box>
  );
};

export default PostForm;
