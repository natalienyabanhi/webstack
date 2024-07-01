import { Dimensions, Text, View } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Loading({ message = "... Loading ..." }) {
  return (
    <>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          height: windowHeight,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "green",
            marginBottom: 40,
            fontWeight: "bold",
            textAlign: "center",
            paddingHorizontal: 15,
          }}
        >
          {message}
        </Text>
      </View>
    </>
  );
}
