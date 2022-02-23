import { Avatar, Button, Heading, Icon, Image, Text, View } from "native-base";
import react, { useEffect, useState } from "react";
import MapView from "react-native-maps";
import CustomMapView from "./CustomMapView";
import LocationInput from "./LocationInput";
import { MaterialIcons } from "@expo/vector-icons";
import { Keyboard } from "react-native";

let pointer;

const LocationForm = ({ setAddress, setPinpoint }) => {
  const [region, setRegion] = useState({
    latitude: 60.1666,
    latitudeDelta: 5,
    longitude: 24.9622,
    longitudeDelta: 5,
  });

  const [addressSelected, setAddressSelected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");

  const setPointer = (coords) => {
    pointer = coords;
  };

  useEffect(() => {
    setPointer(region);
  }, [region]);

  useEffect(() => {
    console.log(currentAddress);
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
          <LocationInput
            setRegion={setRegion}
            setCurrentAddress={setCurrentAddress}
            setAddressSelected={setAddressSelected}
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
                console.log(pointer);
                setAddress(currentAddress);
              }}
            >
              Save
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default LocationForm;
