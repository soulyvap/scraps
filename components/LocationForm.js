import { Button, Heading, Icon, Image, Text, View } from "native-base";
import { useEffect, useRef, useState } from "react";
import CustomMapView from "./CustomMapView";
import { MaterialIcons } from "@expo/vector-icons";
import { Keyboard } from "react-native";
import { regForms } from "../views/Register";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import mapApiKey from "../utils/localVariables";

let pointer;

const LocationForm = ({
  setAddress,
  setPinpoint,
  setCurrentForm,
  address,
  pinpoint,
}) => {
  const [region, setRegion] = useState({
    latitude: 60.1666,
    latitudeDelta: 5,
    longitude: 24.9622,
    longitudeDelta: 5,
  });

  const [addressSelected, setAddressSelected] = useState();
  const [currentAddress, setCurrentAddress] = useState();

  const [padding, setMapPadding] = useState();
  const [align, setAlign] = useState("center");
  const ref = useRef();

  const formatLocation = (location) => {
    return {
      latitude: location.lat,
      latitudeDelta: 0.003,
      longitude: location.lng,
      longitudeDelta: 0.003,
    };
  };

  const setPointer = (coords) => {
    pointer = coords;
  };

  useEffect(() => {
    setPointer(region);
  }, [region]);

  useEffect(() => {
    if (pinpoint && address) {
      setCurrentAddress(address);
      setRegion(pinpoint);
      setAddressSelected(true);
    } else {
      setAddressSelected(false);
    }
    console.log(currentAddress, region, addressSelected);
  }, []);

  useEffect(() => {
    console.log(currentAddress);
    currentAddress && ref.current?.setAddressText(currentAddress);
  }, [currentAddress]);

  const [keyboardShowing, setKeyboardShowing] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardShowing(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardShowing(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const logoSize = 220;
  const formBoxHeight = 75;
  const picturePosition = 100 - formBoxHeight;

  return (
    <View flex={1} bgColor={"#33CA7F"}>
      {!keyboardShowing && !addressSelected && (
        <Image
          source={require("../assets/logo-elevated.png")}
          alt={"scraps-logo"}
          size={logoSize}
          top={picturePosition + "%"}
          left={"50%"}
          style={
            ({},
            {
              transform: [
                { translateX: -logoSize / 2 },
                { translateY: -logoSize / 2 },
              ],
            })
          }
          zIndex={200}
        />
      )}
      <View
        position={"absolute"}
        zIndex={100}
        width={"100%"}
        height={
          addressSelected
            ? undefined
            : keyboardShowing
            ? "100%"
            : `${formBoxHeight}%`
        }
        top={addressSelected ? 0 : keyboardShowing ? 0 : undefined}
        bottom={addressSelected ? undefined : 0}
        bgColor={"white"}
        borderTopRadius={keyboardShowing ? 0 : 90}
        px={addressSelected ? 0 : 10}
        pt={addressSelected ? 0 : keyboardShowing ? 10 : logoSize / 2 + 10}
        justifyContent={keyboardShowing ? "flex-start" : "center"}
      >
        <View flex={1} zIndex={150}>
          {!addressSelected && (
            <View>
              <Heading mb={5}>Setting up your address</Heading>
              <Text mb={5} textAlign={"justify"}>
                {`Scraps will only use your address to connect you to your neighbours within a 500m radius.\nIt will not be visible unless you decide to share it for food pickup.\nYou can of course always arrange another pickup location with your neighbour.`}
              </Text>
            </View>
          )}
          <GooglePlacesAutocomplete
            ref={ref}
            placeholder="Street address"
            minLength={3}
            autoFocus={true}
            fetchDetails={true}
            onPress={(data, details = null) => {
              setRegion(formatLocation(details.geometry.location));
              setCurrentAddress(data.description);
              setAddressSelected(true);
              setMapPadding(45);
              setAlign("left");
            }}
            query={{
              key: mapApiKey,
              language: "en",
              components: "country:fi",
            }}
            styles={{
              textInput: {
                backgroundColor: "#F9F4F1",
                textAlign: align,
                paddingStart: padding,
              },
            }}
          />
          {addressSelected && (
            <View bgColor={"#33CA7F"} py={2}>
              <Heading fontSize="17" textAlign={"center"} color={"white"}>
                Pinpoint your front door on the map and save
              </Heading>
            </View>
          )}
        </View>
      </View>
      {addressSelected && (
        <View flex={1}>
          {region && <CustomMapView region={region} setPointer={setPointer} />}
          <View
            position={"absolute"}
            top={"45%"}
            left={"45%"}
            bottom={"45%"}
            right={"45%"}
            justifyContent={"center"}
            zIndex={50}
          >
            <Icon
              as={<MaterialIcons name={"location-on"} />}
              size={10}
              color={"#132A15"}
            />
          </View>
          <View
            position={"absolute"}
            zIndex={100}
            width={"100%"}
            bottom={10}
            alignItems={"center"}
          >
            <Button
              width={"35%"}
              borderRadius={15}
              bgColor={"#33CA7F"}
              disabled={!addressSelected}
              onPress={() => {
                setPinpoint(pointer);
                console.log(currentAddress);
                console.log(pointer);
                setAddress(currentAddress);
                setCurrentForm(regForms.bio);
              }}
            >
              Next
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default LocationForm;
