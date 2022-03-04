import { Center, Text } from "native-base";
import react from "react";
import { colors } from "../utils/colors";

const Tag = ({ name }) => {
  return (
    <Center
      bgColor={colors.grey}
      borderRadius="15"
      px={2}
      h={5}
      mr={1}
      mb={1}
      shadow="2"
    >
      <Text fontSize={10} textAlign="center" color={"white"}>
        {name}
      </Text>
    </Center>
  );
};

export default Tag;
