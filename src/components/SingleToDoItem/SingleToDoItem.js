import { View, Text, Modal, TouchableOpacity, Dimensions } from "react-native";
import { useState } from "react";
import { globalStyles } from "../../styles/styles";
import { formatDate } from "../../js/main";
import UpdateToDoItem from "./UpdateToDoItem";
import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
//

export const SingleToDoItem = ({
  item,
  asyncKey,
  screenMode,
  _getToDoItems,
  animate = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  //
  //
  //

  const Child = () => (
    <View
      style={[
        globalStyles.item_container_1,
        screenMode.value === "edit" &&
        screenMode.selectedItemsID.indexOf(item?.id) !== -1
          ? {
              borderWidth: 2,
              borderColor: "blue",
            }
          : {},
      ]}
    >
      <View
        style={[
          globalStyles.item_flag_1,
          { backgroundColor: item.flag ? item.flag : "black" },
        ]}
      >
        <Text style={globalStyles.item_flag_text_1}>|</Text>
      </View>
      <View style={globalStyles.item_info_parent_1}>
        <View style={globalStyles.item_title_text_1_parent}>
          <Text style={globalStyles.item_title_text_1} numberOfLines={1}>
            {item.title ? item.title : "no title"}
          </Text>
        </View>
        <View>
          <Text style={globalStyles.item_date_text_1}>
            {item.date ? formatDate(item.date) : "no date"}
          </Text>
        </View>
      </View>
    </View>
  );
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
  //
  return (
    <>
      {/* UPDATE ITEM MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <UpdateToDoItem
          asyncKey={asyncKey}
          item={item}
          _getToDoItems={_getToDoItems}
          setModalVisible={setModalVisible}
        />
      </Modal>

      {/* TASK ITEM CARD */}
      <TouchableOpacity
        onPress={() => {
          if (screenMode.value === "edit") {
            screenMode.selectedItemsIds(item?.id);
          } else {
            setModalVisible(true);
          }
        }}
        onLongPress={() => {
          screenMode.handleScreenMode("edit");
          screenMode.selectedItemsIds(item?.id);
        }}
      >
        {animate ? (
          <Animated.View
            entering={SlideInLeft}
            exiting={SlideOutLeft}
            style={globalStyles.item_parent_1}
          >
            <Child />
          </Animated.View>
        ) : (
          <View style={globalStyles.item_parent_1}>
            <Child />
          </View>
        )}
      </TouchableOpacity>
    </>
  );
};
