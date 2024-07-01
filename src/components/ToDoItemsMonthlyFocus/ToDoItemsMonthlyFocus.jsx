import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ModalToDoItemsMonthlyFocus from "./ModalToDoItemsMonthlyFocus";
import { controlIconSize_1, globalStyles } from "../../styles/styles";

const ToDoItemsMonthlyFocus = ({ items, setModalVisible, _getToDoItems }) => {
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Generate an array of dates representing each day of the year
  const daysInYear = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const daysInMonth = new Date(currentYear, month, 0).getDate();
    return Array.from(
      { length: daysInMonth },
      (_, j) => `${currentYear}-${month}-${j + 1}`
    );
  }).flat();

  const handleShowCalendarModal = () => {
    setShowCalendarModal(!showCalendarModal);
  };

  return (
    <>
      <ModalToDoItemsMonthlyFocus
        items={items}
        _getToDoItems={_getToDoItems}
        setModalVisible={setModalVisible}
        showCalendarModal={showCalendarModal}
        handleShowCalendarModal={handleShowCalendarModal}
      />
      <Pressable
        style={globalStyles.bottomControlButton_1}
        onPress={handleShowCalendarModal}
      >
        {({ pressed }) => (
          <Ionicons
            size={controlIconSize_1}
            name="calendar"
            color={"white"}
            style={{ opacity: pressed ? 0.4 : 1 }}
          />
        )}
      </Pressable>
    </>
  );
};

export default ToDoItemsMonthlyFocus;
