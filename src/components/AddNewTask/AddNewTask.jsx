import React, { useState } from "react";
import {
  Text,
  View,
  Alert,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "../../styles/styles";
import {
  addToDoItems,
  colorOptions,
  formatDate1,
  formatTime,
  initialItemState,
} from "../../js/main";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AddNewTask = ({ setModalVisible, setActiveTab, _getToDoItems }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [singleItemData, setSingleItemData] = useState(initialItemState);
  return (
    <View>
      <View style={globalStyles.modal_parent_1}>
        {!isSaving ? (
          <>
            <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 5 }}>
              ADD NEW TASK
            </Text>
            {/* INPUTS */}
            <ScrollView
              style={{
                width: windowWidth,
              }}
            >
              <View
                style={{
                  display: "flex",
                  paddingBottom: 30,
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <View style={globalStyles.modal_input_group_1}>
                  <TextInput
                    style={globalStyles.modal_text_input}
                    onChangeText={(value) => {
                      setSingleItemData({
                        ...singleItemData,
                        title: value,
                      });
                    }}
                    value={singleItemData.title}
                    placeholder="Title"
                    placeholderTextColor={"gray"}
                  />

                  <TextInput
                    style={globalStyles.modal_multitext_input}
                    onChangeText={(value) => {
                      setSingleItemData({
                        ...singleItemData,
                        note: value,
                      });
                    }}
                    value={singleItemData.note}
                    placeholder={"Add A Note\n...\n...\n\n\n\n\n\n\n\n\n\n"}
                    placeholderTextColor={"gray"}
                    multiline={true}
                    textAlignVertical="top"
                  />

                  <View style={globalStyles.modal_color_date_group_1}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: "gray",
                        marginRight: 25,
                        fontWeight: "bold",
                      }}
                    >
                      Due Date:
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        setShowDatePicker(true);
                      }}
                    >
                      {showDatePicker && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={singleItemData.date}
                          minimumDate={new Date()}
                          mode="date"
                          is24Hour={true}
                          display="default"
                          onChange={(event, selectedDate) => {
                            const currentDate =
                              selectedDate || singleItemData.date;
                            setSingleItemData({
                              ...singleItemData,
                              date: currentDate,
                            });
                            setShowDatePicker(false);
                          }}
                        />
                      )}
                      <Text style={globalStyles.modal_button_2}>
                        {formatDate1(singleItemData.date)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowTimePicker(true);
                      }}
                    >
                      {showTimePicker && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={singleItemData.time}
                          // minimumDate={new Date()}
                          mode="time"
                          is24Hour={true}
                          display="default"
                          onChange={(event, selectedTime) => {
                            const currentTime =
                              selectedTime || singleItemData.time;
                            setSingleItemData({
                              ...singleItemData,
                              time: currentTime,
                            });
                            setShowTimePicker(false);
                          }}
                        />
                      )}
                      <Text style={globalStyles.modal_button_2}>
                        {formatTime(singleItemData.time)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      marginTop: 10,
                      display: "flex",
                      marginBottom: 20,
                      alignItems: "flex-start",
                      flexDirection: "column",
                      width: windowWidth / 1.2,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: "gray",
                        marginBottom: 10,
                        fontWeight: "bold",
                      }}
                    >
                      Select A Color Tag:
                    </Text>
                    <View style={globalStyles.modal_color_option_group_2}>
                      <View style={globalStyles.modal_color_option_group_1}>
                        {colorOptions.map((option, i) => (
                          <TouchableOpacity
                            key={i}
                            onPress={() => {
                              setSingleItemData({
                                ...singleItemData,
                                flag: option,
                              });
                            }}
                          >
                            <View
                              style={[
                                globalStyles.modal_color_option_1,
                                {
                                  backgroundColor: option,
                                },
                                singleItemData.flag !== option
                                  ? {}
                                  : {
                                      borderWidth: 1,
                                      borderColor: "black",
                                    },
                              ]}
                            ></View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            {/* CANCEL AND SAVE BUTTON */}
            <View style={globalStyles.modal_button_group_1}>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Cancel Adding Task",
                    "Are you sure you want to cancel?",
                    [
                      {
                        text: "No",
                        onPress: () => {
                          return false;
                        },
                        style: "cancel",
                      },
                      {
                        text: "YES",
                        onPress: () => {
                          setSingleItemData({
                            flag: "green",
                            status: "pending",
                            title: "",
                            note: "",
                            date: new Date(),
                            date_created: new Date(),
                          });
                          setModalVisible(false);
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={globalStyles.modal_button_1}>CANCEL</Text>
              </TouchableOpacity>
              {/*
            <PushNotification
              title={"ADD"}
              addToDoItems={addToDoItems}
              taskTitle={singleItemData.title}
              taskNote={singleItemData.note}
              datetime={mergeTimeAndDate(
                singleItemData.date,
                singleItemData.time
              )}
            />
            */}

              <TouchableOpacity
                onPress={async () => {
                  setIsSaving(true);
                  await addToDoItems(singleItemData);
                  _getToDoItems();
                  setModalVisible(false);
                  setActiveTab("PENDING");
                  setSingleItemData(initialItemState);
                  setIsSaving(false);
                }}
              >
                <Text style={globalStyles.modal_button_1}>ADD</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: windowHeight - 100,
            }}
          >
            <ActivityIndicator size="large" color="#003153" />
            <Text
              style={{
                fontSize: 20,
                marginTop: 15,
                color: "#003153",
                fontWeight: "bold",
              }}
            >
              ADDING NEW TASK
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AddNewTask;
