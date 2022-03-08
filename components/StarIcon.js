import { Icon } from "native-base";
import { colors } from "../utils/colors";
import { MaterialIcons } from "@expo/vector-icons";

const StarIcon = () => {
  return (
    <Icon
      as={MaterialIcons}
      name="star-outline"
      size={5}
      color={colors.yellow}
    ></Icon>
  );
};

export default StarIcon;
