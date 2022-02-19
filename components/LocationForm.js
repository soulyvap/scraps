import { Button, Heading, Icon, Text, View } from "native-base";
import react, { useEffect, useState } from "react";
import MapView from "react-native-maps";
import CustomMapView from "./CustomMapView";
import LocationInput from "./LocationInput";
import { MaterialIcons } from "@expo/vector-icons";

const LocationForm = ({ setAddress, setPinpoint }) => {
  const [region, setRegion] = useState({
    latitude: 60.1666,
    latitudeDelta: 5,
    longitude: 24.9622,
    longitudeDelta: 5,
  });
  const [pointer, setPointer] = useState();
  const [addressSelected, setAddressSelected] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");

  useEffect(() => {
    setPointer(region);
  }, [region]);

  useEffect(() => {
    console.log(currentAddress);
  }, [currentAddress]);

  return (
    <View flex={1} bgColor={"white"}>
      <View
        position={"absolute"}
        zIndex={100}
        width={"100%"}
        top={addressSelected ? 0 : "45%"}
      >
        {!addressSelected && (
          <Heading mb={4} fontSize="17" textAlign={"center"}>
            Enter your address
          </Heading>
        )}
        <LocationInput
          setRegion={setRegion}
          setCurrentAddress={setCurrentAddress}
          setAddressSelected={setAddressSelected}
        />
        {addressSelected && (
          <View bgColor={"#33CA7F"} py={3}>
            <Heading fontSize="17" textAlign={"center"} color={"white"}>
              Pinpoint your front door on the map and save
            </Heading>
          </View>
        )}
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
            justifyContent={"center"}
            zIndex={100}
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
