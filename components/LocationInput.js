import react from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import mapApiKey from "../utils/localVariables";

const LocationInput = ({
  setRegion,
  setCurrentAddress,
  setAddressSelected,
}) => {
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
      }}
      query={{
        key: mapApiKey,
        language: "en",
        components: "country:fi",
      }}
      styles={{
        textInput: {
          backgroundColor: "#F9F4F1",
          textAlign: "center",
        },
      }}
    />
  );
};

export default LocationInput;
