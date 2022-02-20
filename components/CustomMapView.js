import { Center, Icon, View } from "native-base";
import react from "react";
import MapView from "react-native-maps";

const CustomMapView = ({ region, setPointer }) => {
  return (
    <View flex={1}>
      <MapView
        initialRegion={{
          latitude: 60.1666,
          latitudeDelta: 5,
          longitude: 24.9622,
          longitudeDelta: 5,
        }}
        style={{ flex: 1 }}
        showsUserLocation={true}
        region={region}
        onRegionChange={(reg) => {
          setPointer(reg);
        }}
      ></MapView>
    </View>
  );
};

export default CustomMapView;
