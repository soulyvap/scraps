import { Icon, IconButton } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../utils/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

const LogoutButton = ({ onPress, top, right }) => {
  const { setIsLoggedIn } = useContext(MainContext);

  const logout = async () => {
    console.log("logout");
    await AsyncStorage.clear();
    setIsLoggedIn(false);
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
