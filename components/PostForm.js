import {
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

const PostForm = () => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      time: "",
      description: "",
      picture: "",
      category: "",
      tags: "",
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
    console.log("split modified", modified);
    console.log("split splitted", splitted);
    let final = "";
    for (let i = 0; i < splitted.length; i++) {
      i === 0 ? (final = splitted[i]) : (final = final + "/" + splitted[i]);
    }
    console.log("split looped final", final);
    setDateText(final);
  };

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
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={"Green salad"}
              size="lg"
              variant={"basic"}
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
                placeholder="e.g. any time between 4PM and 9PM"
                size={"lg"}
                variant={"basic"}
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
            <Button.Group
              direction="row"
              justifyContent={"space-between"}
              marginBottom={"5%"}
            >
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
                <Button bgColor={"#898980"} borderRadius={15} w={100}>
                  dairy-free
                </Button>
                <Button bgColor={"#898980"} borderRadius={15} w={100}>
                  egg-free
                </Button>
                <Button bgColor={"#898980"} borderRadius={15} w={100}>
                  gluten-free
                </Button>
                <Button bgColor={"#898980"} borderRadius={15} w={100}>
                  lactose-free
                </Button>
                <Button bgColor={"#898980"} borderRadius={15} w={100}>
                  nut-free
                </Button>
                <Button bgColor={"#898980"} borderRadius={15} w={100}>
                  vegan
                </Button>
                <Button bgColor={"#898980"} borderRadius={15} w={100}>
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
        padding={"3%"}
        width={"40%"}
        _text={{
          color: "#F9F4F1",
        }}
      >
        Post
      </Button>
    </Box>
  );
};

export default PostForm;
