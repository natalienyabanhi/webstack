import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { globalStyles } from "../../styles/styles";
import {
  colorOptions,
  formatDate,
  formatTime,
  getToDoItemById,
  initialItemState,
  saveToDoItems,
} from "../../js/main";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function UpdateToDoItem({
  item,
  asyncKey,
  _getToDoItems,
  setModalVisible,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [singleItemData, setSingleItemData] = useState(initialItemState);

  useEffect(() => {
    const _getToDoItemById = async () => {
      const result = await getToDoItemById(item?.id, asyncKey);
      if (result) {
        setSingleItemData(result);
      } else {
        ToastAndroid.show("Could not get that task", ToastAndroid.LONG, 1000);
      }
    };
    _getToDoItemById();
  }, [item]);

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
    <View>
      <View style={globalStyles.modal_parent_1}>
        {!isSaving ? (
          <>
            {/* TASK TITLE */}
            <Text
              numberOfLines={3}
              style={{
                fontSize: 20,
                marginBottom: 5,
                fontWeight: "bold",
                paddingHorizontal: 10,
                textAlign: "center",
              }}
            >
              {singleItemData.title}
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
                {/* INPUTS */}
                <View style={globalStyles.modal_input_group_1}>
                  <View
                    style={[globalStyles.row_center, { marginVertical: 10 }]}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setSingleItemData({
                          ...singleItemData,
                          status: "pending",
                        });
                      }}
                    >
                      <Text
                        style={[
                          globalStyles.modal_status_buttons,
                          singleItemData.status === "pending"
                            ? { backgroundColor: "#ff7c00", color: "black" }
                            : {},
                        ]}
                      >
                        PENDING
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setSingleItemData({
                          ...singleItemData,
                          status: "completed",
                        });
                      }}
                    >
                      <Text
                        style={[
                          globalStyles.modal_status_buttons,
                          singleItemData.status === "completed"
                            ? { backgroundColor: "green", color: "white" }
                            : {},
                        ]}
                      >
                        COMPLETED
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setSingleItemData({
                          ...singleItemData,
                          status: "trash",
                        });
                      }}
                    >
                      <Text
                        style={[
                          globalStyles.modal_status_buttons,
                          singleItemData.status === "trash"
                            ? { backgroundColor: "red", color: "white" }
                            : {},
                        ]}
                      >
                        TRASH
                      </Text>
                    </TouchableOpacity>
                  </View>

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
                    placeholderTextColor={"silver"}
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
                    placeholder={
                      "Add A Note\n...\n...\n...\n\n\n\n\n\n\n\n\n\n"
                    }
                    placeholderTextColor={"silver"}
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
                          value={new Date(singleItemData.date)}
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
                        {formatDate(singleItemData.date)}
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
                          value={new Date(singleItemData.time)}
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
                  setModalVisible(false);
                }}
              >
                <Text style={globalStyles.modal_button_1}>CANCEL</Text>
              </TouchableOpacity>
              {/* <PushNotification
            title={"SAVE"}
            addToDoItems={() => {
              const _saveToDoItems = async () => {
                await saveToDoItems();
                _getToDoItems();
              };
              _saveToDoItems();
            }}
            taskTitle={singleItemData.title}
            taskNote={singleItemData.note}
            datetime={mergeTimeAndDate(
              singleItemData.date,
              singleItemData.time
            )}
          /> */}

              <TouchableOpacity
                onPress={async () => {
                  setIsSaving(true);
                  await saveToDoItems(singleItemData, item, asyncKey);
                  setTimeout(() => {
                    _getToDoItems();
                    setModalVisible(false);
                    setIsSaving(false);
                  }, 2000);
                }}
              >
                <Text style={globalStyles.modal_button_1}>SAVE</Text>
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
              SAVING CHANGES
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
