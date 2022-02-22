import react, { useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import mapApiKey from "../utils/localVariables";

//This feature requires an ApiKey that I cannot share online.
const LocationInput = ({
  setRegion,
  setCurrentAddress,
  setAddressSelected,
}) => {
  const [padding, setMapPadding] = useState();
  const [align, setAlign] = useState("center");

  const formatLocation = (location) => {
    return {
      latitude: location.lat,
      latitudeDelta: 0.003,
      longitude: location.lng,
      longitudeDelta: 0.003,
    };
  };
  return (
    <GooglePlacesAutocomplete
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
  );
};

export default LocationInput;
