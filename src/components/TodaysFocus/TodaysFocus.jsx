import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import Animated, { SlideInLeft, SlideOutLeft } from "react-native-reanimated";
import { globalStyles } from "../../styles/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import UpdateToDoItem from "../SingleToDoItem/UpdateToDoItem";
import AddNewTask from "../AddNewTask/AddNewTask";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const TodaysFocus = ({
  setActiveTab,
  _getToDoItems,
  todaysItems = ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
}) => {
  const [item, setItem] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
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
          setModalVisible(false);
        }}
      >
        <UpdateToDoItem
          item={item}
          asyncKey={"pendingItems"}
          _getToDoItems={_getToDoItems}
          setModalVisible={setModalVisible}
        />
      </Modal>

      {/* ADD ITEM MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={addItemModalVisible}
        onRequestClose={() => {
          setAddItemModalVisible(false);
        }}
      >
        <AddNewTask
          setActiveTab={setActiveTab}
          _getToDoItems={_getToDoItems}
          setModalVisible={setAddItemModalVisible}
        />
      </Modal>

      <Animated.View
        entering={SlideInLeft}
        exiting={SlideOutLeft}
        style={{
          height: 100,
          paddingBottom: 5,
          maxHeight: windowHeight * 0.2,
        }}
      >
        <ScrollView
          horizontal={true}
          style={{
            margin: 0,
            width: windowWidth,
          }}
        >
          {/* ADD ITEM BUTTON */}
          {todaysItems?.length === 0 && (
            <Pressable
              onPress={() => {
                setAddItemModalVisible(true);
              }}
            >
              {({ pressed }) => (
                <View
                  style={[
                    {
                      display: "flex",
                      paddingBottom: 5,
                      alignItems: "center",
                      paddingLeft: 20,
                      paddingRight: 10,
                      flexDirection: "column",
                      justifyContent: "center",
                      maxHeight: windowHeight * 0.2,
                      height: todaysItems?.length === 0 ? 80 : 95,
                    },
                    todaysItems?.length === 0 ? { width: windowWidth } : {},
                  ]}
                >
                  <Ionicons
                    name="add-circle"
                    size={todaysItems?.length === 0 ? 55 : 35}
                    color={"white"}
                    style={{ opacity: pressed ? 0.4 : 1 }}
                  />
                  {todaysItems?.length === 0 && (
                    <Text style={{ color: "white", fontSize: 12 }}>
                      ADD TODAY'S TASK
                    </Text>
                  )}
                </View>
              )}
            </Pressable>
          )}

          {/* ITEMS */}
          {todaysItems.map((item, index) => {
            return (
              <Pressable
                key={index}
                onPress={() => {
                  setItem(item);
                  setModalVisible(true);
                }}
              >
                <View
                  style={[
                    globalStyles.item_parent_2,
                    {
                      borderRadius: 10,
                      backgroundColor: item?.flag ? item?.flag : "gray",
                      marginRight: index === todaysItems.length - 1 ? 10 : 0,
                    },
                  ]}
                >
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    style={{
                      borderRadius: 10,
                    }}
                    colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]}
                  >
                    <View style={globalStyles.item_container_2}>
                      <View
                        style={[
                          globalStyles.item_flag_2,
                          {
                            backgroundColor: item?.flag ? item?.flag : "black",
                          },
                        ]}
                      >
                        {/* <Text style={globalStyles.item_flag_text_2}>.</Text> */}
                      </View>
                      <View style={globalStyles.item_info_parent_2}>
                        <View style={globalStyles.item_title_text_2_parent}>
                          <Text
                            style={globalStyles.item_title_text_2}
                            numberOfLines={1}
                          >
                            {item?.title ? item?.title : "no title"}
                          </Text>
                        </View>
                        <View>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 12,
                              color: "black",
                            }}
                          >
                            {item?.note ? item?.note : "no note"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>
    </>
  );
};

export default TodaysFocus;
