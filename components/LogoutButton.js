import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon, IconButton } from "native-base";
import { useContext } from "react";
import { Alert } from "react-native";
import { MainContext } from "../contexts/MainContext";
import { colors } from "../utils/colors";

// logout button displayed in home page and own profile page
const LogoutButton = ({ onPress, top, right }) => {
  const { isLoggedIn, setIsLoggedIn } = useContext(MainContext);

  const logout = async () => {
    console.log("logout");
    await AsyncStorage.clear();
    setIsLoggedIn(false);
    isLoggedIn && Alert.alert("Logged out succesfully");
  };

  return (
    <IconButton
      position={"absolute"}
      bgColor={colors.yellow}
      alignSelf="center"
      top={top}
      right={right}
      size={"md"}
      shadow={3}
      borderRadius="full"
      onPress={() => logout()}
      icon={
        <Icon
          as={MaterialIcons}
          name="logout"
          size={5}
          color={colors.notBlack}
        ></Icon>
      }
    ></IconButton>
  );
};

export default LogoutButton;
