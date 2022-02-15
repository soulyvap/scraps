import {
    Box,
    Container,
    extendTheme,
    Flex,
    Heading,
    Input,
    NativeBaseProvider,
    ScrollView,
    Spacer,
    Text,
    TextArea,
    VStack,
  } from "native-base";
import React from "react";

function Upload() {
    export default function App() {
        const theme = extendTheme({
          components: {
            Input: {
              variants: {
                test: () => {
                  return {
                    bg: "#F9F4F1",
                    borderRadius: 15,
                    borderWidth: 1,
                  };
                },
              },
            },
          },
        });
    }
        
  return (
    <Container>
      <Box flex="1" safeAreaTop>
        <ScrollView px="5%">
          <Heading size="md" style={styles.title}>
            Add title
          </Heading>
          <Input
            size="lg"
            variant="test"
            width="100%"
            placeholder="Green salad"
            alignSelf="center"
          />
          <Heading size="md" style={[styles.field, styles.title]}>
            Select latest pick-up date
          </Heading>
          <Heading size="md">Add description</Heading>
          <TextArea
            placeholder="Testing"
            width="100%"
            py={5}
            style={styles.field}
          />
          <Input
            size="lg"
            variant="test"
            multiline={true}
            height={100}
            width="100%"
            placeholder="Green salad"
            alignSelf="center"
            px={4}
          />
        </ScrollView>
      </Box>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#132A15",
    marginBottom: "2%",
  },
  field: {
    backgroundColor: "#F9F4F1",
    marginTop: "5%",
  },
});

export default Upload;
