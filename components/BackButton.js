import { ArrowBackIcon, IconButton } from "native-base";
import react from "react";

const BackButton = ({ onPress, top, left }) => {
  return (
    <IconButton
      position="absolute"
      top={top}
      left={left}
      zIndex={1000}
      onPress={onPress}
      icon={<ArrowBackIcon size={30} />}
    />
  );
};

export default BackButton;
