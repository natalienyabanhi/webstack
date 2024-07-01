import { View, Text, Dimensions } from "react-native";
import React from "react";
import ToDoItemsMonthlyFocus from "./ToDoItemsMonthlyFocus/ToDoItemsMonthlyFocus";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function ManualTest() {
  const items = JSON.parse(
    '{"February":{"9":[{"flag":"yellow","status":"pending","title":"LEAVE A FOLLOW","note":"","date":"2024-02-09T19:09:47.771Z","date_created":"2024-02-09T19:09:47.771Z","last_modified":"2024-02-09T19:09:47.771Z","id":"id-2024-2-9-1707505791277"},{"flag":"red","status":"pending","title":"@MUNYADESIGN","note":"","date":"2024-02-09T19:09:37.306Z","date_created":"2024-02-09T19:09:37.306Z","last_modified":"2024-02-09T19:09:37.306Z","id":"id-2024-2-9-1707505788772"},{"flag":"blue","status":"pending","title":"SPEAKS ABOUT CODING,","note":"","date":"2024-02-09T19:08:58.174Z","date_created":"2024-02-09T19:08:58.174Z","last_modified":"2024-02-09T19:08:58.174Z","id":"id-2024-2-9-1707505758942"}]},"March":{"14":[{"flag":"red","status":"pending","AND TECH.":"","note":"","date":"2024-03-14T19:09:17.688Z","date_created":"2024-02-09T19:09:17.688Z","last_modified":"2024-02-09T19:09:17.688Z","id":"id-2024-2-9-1707505775180"}]}}'
  );
  return (
    <View
      style={{
        marginTop: 10,
        width: windowWidth,
        height: windowHeight,
        borderWidth: 2,
        borderColor: "gray",
        // backgroundColor: "red",
      }}
    >
      <Text>ManualTest</Text>
      <ToDoItemsMonthlyFocus items={items} />
    </View>
  );
}
