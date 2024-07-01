import { View, Text, Dimensions } from "react-native";
import { SingleToDoItem } from "./SingleToDoItem/SingleToDoItem";
import { globalStyles } from "../styles/styles";
import { useEffect, useState } from "react";

export const ToDoItemsByDate = ({
  items = {},
  _getToDoItems,
  screenMode,
  asyncKey,
}) => {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    //
    try {
      //
      if (
        items !== undefined &&
        Object.keys(items)?.length > 0 &&
        items !== null
      ) {
        setOrder(Object.keys(items));
      } else {
        setOrder([]);
      }
    } catch (error) {
      console.log("error", error);
    }
    //
  }, [items]);
  //
  //
  //
  //
  //
  return (
    <>
      {order?.length > 0 && order !== undefined && order !== null && (
        <View style={globalStyles.homePage_items_scrollView_viewChild_1}>
          {order?.map((month, index) => {
            const tasksForMonth = items[month] ? Object.keys(items[month]) : [];
            return (
              <View
                key={index}
                style={{
                  marginBottom: 10,
                  marginTop: index === 0 ? 20 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "gray",
                    marginLeft: 10,
                    marginBottom: 10,
                  }}
                >
                  {month}
                </Text>
                {tasksForMonth?.map((day, index) => {
                  return (
                    <View key={index}>
                      {items[month][day].map((item, index) => {
                        return (
                          <SingleToDoItem
                            item={item}
                            key={index}
                            index={index}
                            asyncKey={asyncKey}
                            screenMode={screenMode}
                            _getToDoItems={_getToDoItems}
                          />
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      )}
    </>
  );
};
