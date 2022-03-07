import { Icon, IconButton } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../utils/colors";

const LogoutButton = ({ onPress, top, right }) => {
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
      onPress={onPress}
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
