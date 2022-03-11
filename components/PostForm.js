import {
  Avatar,
  Box,
  Button,
  FormControl,
  Heading,
  HStack,
  IconButton,
  Input,
  ScrollView,
  Text,
  TextArea,
  View,
  VStack,
} from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { useMedia, useTag } from "../hooks/ApiHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Chip } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { colors } from "../utils/colors";
import { foodPostTag } from "../utils/variables";
import { MainContext } from "../contexts/MainContext";
import * as ImageManipulator from "expo-image-manipulator";

export const listingStatus = {
  listed: "listed",
  booked: "booked",
  confirmed: "confirmed",
  pickedUp: "picked-up",
  cancelled: "cancelled",
  deleted: "deleted",
};

const PostForm = ({ navigation }) => {
  const defaultAllergens = [
    { text: "peanut", active: false },
    { text: "tree nuts", active: false },
    { text: "sesame", active: false },
    { text: "soy", active: false },
    { text: "fish", active: false },
    { text: "shellfish", active: false },
    { text: "sulphites", active: false },
  ];
  const defaultTags = [
    { text: "dairy-free", active: false },
    { text: "egg-free", active: false },
    { text: "gluten-free", active: false },
    { text: "keto", active: false },
    { text: "nut-free", active: false },
    { text: "vegan", active: false },
    { text: "vegetarian", active: false },
  ];

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState("");
  const [image, setImage] = useState();
  const [imageSelected, setImageSelected] = useState(false);
  const [cameraPermission, setCameraPermission] = useState();
  const [type, setType] = useState("image");
  const [category, setCategory] = useState();
  const [allergenChips, setAllergenChips] = useState(defaultAllergens);
  const [tags, setTags] = useState(defaultTags);
  const { postMedia } = useMedia();
  const { postTag } = useTag();
  const { update, setUpdate, coords } = useContext(MainContext);
  const scrollRef = useRef();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
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

  //when a date is selected on the datepicker, the latter is hidden, the date is set and the date text is generated
  const onChanged = (event, selectedDate) => {
    setShow(false);
    setDate(selectedDate);
    split(selectedDate);
  };

  // Converts original DatePicker value to more pleasant one,
  // for displaying it in the Text component.
  const split = (original) => {
    const modified = original.toString();
    const [weekday, month, day, year] = modified.split(" ", 4);
    const final = `${weekday}, ${day} ${month} ${year}`;
    setDateText(final);
  };

  //checks for permissions to use the phones cameras
  const permisionFunction = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();

    setCameraPermission(cameraPermission.status === "granted");

    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    console.log(imagePermission.status);

    if (
      imagePermission.status !== "granted" &&
      cameraPermission.status !== "granted"
    ) {
      alert("Permission for media access needed.");
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  //handles taking a picture with the phone's cameras
  const takePicture = async () => {
    if (cameraPermission) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.1,
        aspect: [1, 1],
      });

      const uri = result.uri;

      //resizes the image to make sure it isn't too large for the backend
      const resized = await ImageManipulator.manipulateAsync(uri, [
        { resize: { width: 800, height: 800 } },
      ]);

      console.log(resized);

      if (!result.cancelled) {
        setImage(resized.uri);
        setImageSelected(true);
      }
    }
  };

  //handles picking an image from the gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      aspect: [1, 1],
    });

    const uri = result.uri;

    //resizes the image to make sure it isn't too large for the backend
    const resized = await ImageManipulator.manipulateAsync(uri, [
      { resize: { width: 800, height: 800 } },
    ]);

    if (!result.cancelled) {
      setImage(resized.uri);
      setImageSelected(true);
    }
  };

  //handles the selection of allergens. they can be active or inactive
  const toggleAllergenChip = (chip) => {
    console.log("toggleAllergens: ", chip);
    let copy = [...allergenChips];
    let index = copy.indexOf(chip);
    copy[index].active = !copy[index].active;
    setAllergenChips(copy);
    console.log(chip);
  };

  //handles the selection of tags. they can be active or inactive
  const toggleTag = (tag) => {
    console.log("toggleTag: ", tag);
    let copyOftags = [...tags];
    let index = tags.indexOf(tag);
    copyOftags[index].active = !copyOftags[index].active;
    setTags(copyOftags);
  };

  //resetting the form after it is submitted
  const resetForm = () => {
    setImage(null);
    setImageSelected(false);
    setValue("title", "");
    setValue("description", "");
    setValue("time", "");
    setDate(null);
    setDateText(null);
    setAllergenChips(defaultAllergens);
    setTags(defaultTags);
    setCategory(null);
    scrollRef.current.scrollTo({ y: 0, animation: true });
  };

  //mapping tags into an array of strings
  const tagsToArray = (tags) =>
    tags.filter((tag) => tag.active).map((tag) => tag.text);

  //adding all the tags selected to the food post file.
  const addFoodTags = async (tags, fileId, token) => {
    tags.forEach(async (tag) => {
      const tagData = {
        file_id: fileId,
        tag: tag,
      };
      try {
        const response = await postTag(tagData, token);
        console.log("tag added", response);
      } catch (error) {
        console.error("add tag", error);
      }
    });
    return true;
  };

  //input validation
  const checkForm = () => {
    const { title } = getValues();
    if (!imageSelected) {
      Alert.alert("Please set an image");
      return false;
    } else if (title.length < 1) {
      Alert.alert("Please set a title");
      return false;
    } else if (!dateText) {
      Alert.alert("Please set a latest pickup date");
      return false;
    } else if (!category) {
      Alert.alert("Please select a category");
      return false;
    } else {
      return true;
    }
  };

  //when adding a post, a file is created with the food picture.
  //all the other info is attached to its description.
  //tags are added.
  const onSubmit = async (data) => {
    const formValid = checkForm();

    if (formValid) {
      //picture
      const filename = image.split("/").pop();
      let fileExtension = filename.split(".").pop();
      fileExtension = fileExtension === "jpg" ? "jpeg" : fileExtension;
      //allergens and tags
      const selectedAllergens = tagsToArray(allergenChips);
      const selectedTags = tagsToArray(tags);

      const moreData = {
        description: data.description,
        latestPickup: dateText,
        suitableTimeSlot: data.time,
        allergens: selectedAllergens,
        category: category,
        active: true,
        coords: coords,
      };

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", JSON.stringify(moreData));
      formData.append("file", {
        uri: image,
        name: filename,
        type: type + "/" + fileExtension,
      });

      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await postMedia(formData, token);
        console.log("postMedia response: ", response);
        const tagsAdded = await addFoodTags(
          selectedTags,
          response.file_id,
          token
        );
        const appTagData = {
          file_id: response.file_id,
          tag: foodPostTag,
        };
        const appTagResponse = await postTag(appTagData, token);
        if (tagsAdded && appTagResponse) {
          Alert.alert("File added successfully");
          resetForm();
          navigation.navigate("Home");
          setUpdate(update + 1);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <ScrollView ref={scrollRef}>
      <VStack flex={1} px={4} py={5} space={10}>
        {/* Add picture */}

        <View>
          <Heading>
            <Heading
              mb={3}
              color={colors.notBlack}
              fontSize="lg"
              fontWeight={"bold"}
            >
              Add an image
            </Heading>
            <Text alignSelf={"flex-start"} color={colors.red} fontSize="lg">
              *
            </Text>
          </Heading>

          <VStack
            space={3}
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Avatar
              source={{ uri: image }}
              alt="food-image"
              size={200}
              resizeMode="contain"
            />
            <HStack space={2}>
              <Button bgColor={colors.grey} onPress={() => pickImage()}>
                Choose File
              </Button>
              <Button bgColor={colors.grey} onPress={() => takePicture()}>
                Take a Picture
              </Button>
            </HStack>
          </VStack>
        </View>

        {/* Add title */}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={errors.title}>
              <Heading mb={3}>
                <Heading
                  color={colors.notBlack}
                  fontSize="lg"
                  fontWeight={"bold"}
                >
                  Add a title
                </Heading>
                <Text alignSelf={"flex-start"} color={colors.red} fontSize="lg">
                  *
                </Text>
              </Heading>
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
        <View>
          <Heading mb={3}>
            <Heading color={colors.notBlack} fontSize="lg" fontWeight={"bold"}>
              Set a latest pickup date
            </Heading>
            <Text alignSelf={"flex-start"} color={colors.red} fontSize="lg">
              *
            </Text>
          </Heading>
          <HStack w={"100%"} alignItems="center">
            <Text w="100%" textAlign={"center"}>
              {dateText || "Press the calendar button to choose"}
            </Text>
            <IconButton
              shadow="2"
              bgColor={colors.yellow}
              borderRadius="full"
              position={"absolute"}
              onPress={showDatepicker}
              right={1}
              _icon={{ as: MaterialIcons, name: "calendar-today", size: 5 }}
            />
            {show && (
              <DateTimePicker
                display="default"
                mode={mode}
                onChange={onChanged}
                testID="dateTimePicker"
                value={date}
              />
            )}
          </HStack>
        </View>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormControl isInvalid={errors.time}>
              <FormControl.Label
                _text={{
                  color: "#132A15",
                  fontWeight: "bold",
                  fontSize: "lg",
                }}
              >
                Set the times you are usually available
              </FormControl.Label>
              <View>
                <Input
                  alignSelf={"flex-start"}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="e.g. any time between 4PM and 9PM"
                  size={"lg"}
                  value={value}
                  variant={"basic"}
                  width={"100%"}
                />
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
                p={3}
                autoCapitalize="none"
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                size="lg"
                variant={"basic"}
                textAlign={"left"}
              />
            </FormControl>
          )}
          name="description"
        />

        {/* Add allergens */}
        <View>
          <Heading
            mb={3}
            color={colors.notBlack}
            fontSize="lg"
            fontWeight={"bold"}
          >
            Add allergens
          </Heading>
          <HStack w={"100%"} justifyContent="space-between">
            <Box bgColor={colors.beige} borderRadius={15} flex={1} p={1}>
              <HStack flexWrap={"wrap"} px={4}>
                {allergenChips.map((chip, i) => {
                  return (
                    <Chip
                      style={{ marginVertical: 3, marginRight: 3 }}
                      key={i}
                      mode={"flat"}
                      onPress={() => {
                        toggleAllergenChip(chip);
                      }}
                      selected={chip.active}
                    >
                      {chip.text}
                    </Chip>
                  );
                })}
              </HStack>
            </Box>
          </HStack>
        </View>

        {/* Select category */}
        <View>
          <Heading mb={3}>
            <Heading color={colors.notBlack} fontSize="lg" fontWeight={"bold"}>
              Select a category
            </Heading>
            <Text alignSelf={"flex-start"} color={colors.red} fontSize="lg">
              *
            </Text>
          </Heading>
          <HStack w={"100%"} justifyContent="space-between">
            <Button
              bgColor={category === "uncooked" ? colors.green : colors.notBlack}
              borderRadius={15}
              onPress={() => {
                setCategory("uncooked");
              }}
              width={"30%"}
            >
              Uncooked
            </Button>
            <Button
              bgColor={category === "cooked" ? colors.green : colors.notBlack}
              borderRadius={15}
              onPress={() => {
                setCategory("cooked");
              }}
              width={"30%"}
            >
              Cooked
            </Button>
            <Button
              bgColor={category === "frozen" ? colors.green : colors.notBlack}
              borderRadius={15}
              onPress={() => {
                setCategory("frozen");
              }}
              width={"30%"}
            >
              Frozen
            </Button>
          </HStack>
        </View>

        {/* Add tags */}

        <View>
          <Heading
            mb={3}
            color={colors.notBlack}
            fontSize="lg"
            fontWeight={"bold"}
          >
            Add tags
          </Heading>
          <HStack w={"100%"} justifyContent="space-between">
            <Box bgColor={colors.beige} borderRadius={15} flex={1} p={1}>
              <HStack flexWrap={"wrap"} px={4}>
                {tags.map((tag, i) => {
                  return (
                    <Chip
                      style={{ marginVertical: 3, marginRight: 3 }}
                      key={i}
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
              </HStack>
            </Box>
          </HStack>
        </View>

        <Button
          alignSelf={"center"}
          bgColor={colors.green}
          borderRadius={15}
          onPress={handleSubmit(onSubmit)}
          padding={"3%"}
          width={"40%"}
        >
          Post
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default PostForm;
