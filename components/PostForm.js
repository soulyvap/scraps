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
import react, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useMedia, useTag } from "../hooks/ApiHooks";
import Tags from "react-native-tags";
import { Chip } from "react-native-paper";

const PostForm = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState("");
  const [allergens, setAllergens] = useState([]);
  const [image, setImage] = useState("https://place-hold.it/50&text=test");
  const [category, setCategory] = useState("uncooked");
  const [tagSomething, setTagSomething] = useState([
    { text: "dairy-free", active: false },
    { text: "egg-free", active: false },
    { text: "gluten-free", active: false },
    { text: "keto", active: false },
    { text: "nut-free", active: false },
    { text: "vegan", active: false },
    { text: "vegetarian", active: false },
  ]);
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

  const showDatepicker = () => {
    setShow(true);
  };

  const onChanged = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    split(currentDate);
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

  // When clickin a tag
  const toggleTag = (tag) => {
    console.log("toggleTag: ", tag);
    let copyOfTagSomething = JSON.parse(JSON.stringify(tagSomething));
    let index = tagSomething.indexOf(tag);
    copyOfTagSomething[index].active = !copyOfTagSomething[index].active;
    setTagSomething(copyOfTagSomething);
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
    const testTagsSelected = tagSomething
      .filter((tag) => tag.active)
      .map((tag) => tag.text);
    console.log("onSubmit selected tags: ", testTagsSelected);
    console.log("onSumbit allergens: ", allergens);

    /* const formData = new FormData();
    formData */
  };

  useEffect(() => {
    pickImage();
  }, [image]);

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

      {/* Add allergens */}
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
              Add allergens
            </FormControl.Label>
            <Box
              bgColor={"#F9F4F1"}
              borderRadius={15}
              flex={1}
              marginBottom={"5%"}
              paddingY={"3%"}
            >
              <Tags
                onChangeTags={(tags) => {
                  setAllergens(tags);
                }}
                textInputProps={{
                  placeholderTextColor: "#000000",
                  placeholder: "Any type of animal",
                }}
              />
            </Box>
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
                {tagSomething.map((tag) => {
                  return (
                    <Chip
                      mode={"flat"}
                      onPress={() => {
                        toggleTag(tag);
                      }}
                      selected={tag.active}
                    >
                      {tag.text}
                    </Chip>
                  );
                })}
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
