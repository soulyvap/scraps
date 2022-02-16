import React from "react";
import { SafeAreaView } from "react-native";
import List from "../components/List";
import PropTypes from "prop-types";

const Home = ({ navigation }) => {
  return (
    <>
      <SafeAreaView flex={1}>
        <List flex={1} navigation={navigation} />
      </SafeAreaView>
    </>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
