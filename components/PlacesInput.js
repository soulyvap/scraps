import React from "react";
import { StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const PlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      styles={{
        textInputContainer: {
          backgroundColor: "#F9F4F1",
          borderRadius: 10,
        },
        textInput: {
          textAlign: "center",
        },
      }}
      placeholder="your street address"
      fetchDetails={true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: apiKeyMaps,
        language: "en",
        components: "country:fi",
      }}
    />
  );
};

export default PlacesInput;
