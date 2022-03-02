import { View } from "native-base";
import react from "react";
import BookingTile from "../components/BookingTile";

const MyListings = () => {
  return (
    <View flex={1}>
      <BookingTile />
    </View>
  );
};

export default MyListings;
