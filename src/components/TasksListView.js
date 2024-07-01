import { Pressable, ScrollView, Text, View } from "react-native";
import { ToDoItemsByDate } from "./ToDoItemsByDate";
import Ionicons from "@expo/vector-icons/Ionicons";
import { globalStyles } from "../styles/styles";
import { asyncKeys } from "../js/main";

export const TasksListView = ({
  activeTab,
  screenMode,
  _getToDoItems,
  itemsSortedByDate,
}) => {
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  return (
    <ScrollView
      style={[
        globalStyles.homePage_items_scrollView_1,
        {
          position: "relative",
        },
      ]}
    >
      {screenMode?.value !== "edit" && (
        <Pressable
          onPress={() => {
            screenMode?.handleScreenMode("edit");
          }}
          style={{
            top: 10,
            right: 10,
            zIndex: 999,
            paddingLeft: 10,
            paddingRight: 10,
            position: "absolute",
          }}
        >
          <Ionicons size={30} color="gray" name={"checkmark-circle-outline"} />
        </Pressable>
      )}
      <ToDoItemsByDate
        asyncKey={asyncKeys[activeTab]}
        items={itemsSortedByDate}
        screenMode={screenMode}
        _getToDoItems={_getToDoItems}
      />
    </ScrollView>
  );
};
