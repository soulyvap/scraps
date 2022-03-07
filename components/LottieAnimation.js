import React from "react";

import LottieView from "lottie-react-native";
import { View } from "native-base";

const LottieAnimation = () => {
  return (
    <View>
      <LottieView
        h={100}
        w={100}
        source={require("../assets/loading.json")}
        autoPlay
        loop
      ></LottieView>
    </View>
  );
};

export default LottieAnimation;
