import {
  Button,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { globalStyles } from "../styles/styles";
import { formatDate } from "../js/main";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ToDoItemsMonthlyFocus({ items }) {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [itemsArray, setItemsArray] = useState([]);
  const [showingAll, setShowingAll] = useState(false);
  const [month, setMonth] = useState("XXXXXXX");
  //
  useEffect(() => {
    const itemsValid =
      typeof items === "object" && items !== null && items !== undefined;
    if (itemsValid) {
      const itemsEmpty = Object.values(Object.values(items)[0])[0];
      setItemsArray(itemsEmpty);
      setMonth(Object.keys(items)[0]);
    }
  }, [items]);
  //
  //
  const handleSetShowingAll = () => {
    setShowingAll(!showingAll);
  };
  //
  //
  return (
    <>
      <Text
        style={{
          fontSize: 16,
          color: "gray",
          marginLeft: 10,
          marginVertical: 10,
          fontWeight: "bold",
        }}
      >
        {month}
      </Text>

      <View style={{ flex: 1 }}>
        <View
          style={{
            height: !showingAll ? windowWidth * 0.2 : windowHeight * 0.5,
            borderWidth: 1,
            borderColor: "green",
          }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View
              style={{
                flexWrap: "wrap",
                flexDirection: "row",
                paddingHorizontal: 10,
                justifyContent: "flex-start",
              }}
            >
              {itemsArray.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    marginRight: 10,
                    marginBottom: 15,
                    paddingHorizontal: 10,
                    width: windowWidth * 0.2,
                    height: windowWidth * 0.2,
                    backgroundColor: "#ebebeb",
                  }}
                >
                  <Text numberOfLines={1}>{index}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        <View
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Pressable onPress={handleSetShowingAll}>
            {({ pressed }) => (
              <View
                style={{
                  width: 45,
                  height: 45,
                  transform: "translateY(-20px)",
                  borderWidth: 1,
                  display: "flex",
                  borderRadius: 100,
                  alignItems: "center",
                  borderColor: "silver",
                  flexDirection: "column",
                  justifyContent: "center",
                  backgroundColor: "silver",
                  opacity: pressed ? 0.5 : 1,
                }}
              >
                <Ionicons
                  size={40}
                  color="white"
                  name={showingAll ? "chevron-up" : "chevron-down"}
                  style={{
                    borderWidth: 1,
                    borderRadius: 100,
                    borderColor: "silver",
                    backgroundColor: "silver",
                    opacity: pressed ? 0.5 : 1,
                  }}
                />
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
}
