import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Linking, Share, ToastAndroid } from "react-native";
import { decode as base64_decode, encode as base64_encode } from "base-64";

const ip = "";
export const baseURL = `http://${ip}/munya-server/api/du-more/`;

export const asyncKeys = {
  COMPLETED: "completedItems",
  PENDING: "pendingItems",
  TRASH: "trashedItems",
};

export const colorOptions = [
  "green",
  "blue",
  "red",
  "yellow",
  "orange",
  "purple",
  "pink",
  "black",
  "gray",
  "cyan",
  "magenta",
  "teal",
  "maroon",
];

export const initialItemState = {
  flag: "green",
  status: "pending",
  title: "",
  note: "",
  date: new Date(),
  time: new Date(),
  date_created: new Date(),
  last_modified: new Date(),
};

export const generateUniqueID = () => {
  const now = new Date();
  const year = now.getFullYear(); //
  const month = now.getMonth() + 1; //
  const day = now.getDate(); //
  const timestamp = now.getTime(); //

  return `id-${year}-${month}-${day}-${timestamp}`;
};

export const formatDate = (inputDate) => {
  const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const date = new Date(inputDate);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const formatDate1 = (date) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

export const formatTime = (inputTime) => {
  inputTime = typeof inputTime === "object" ? inputTime : new Date(inputTime);
  try {
    return (
      inputTime?.toTimeString().split(":")[0] +
      ":" +
      inputTime?.toTimeString().split(":")[1]
    );
  } catch (error) {
    return (
      new Date()?.toTimeString().split(":")[0] +
      ":" +
      new Date()?.toTimeString().split(":")[1]
    );
  }
};

export const formatDuration = (seconds) => {
  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;
  const secondsInMonth = 2592000; // Assuming 30 days in a month
  const secondsInYear = 31536000; // Assuming 365 days in a year

  const years = Math.floor(seconds / secondsInYear);
  seconds %= secondsInYear;

  const months = Math.floor(seconds / secondsInMonth);
  seconds %= secondsInMonth;

  const days = Math.floor(seconds / secondsInDay);
  seconds %= secondsInDay;

  const hours = Math.floor(seconds / secondsInHour);
  seconds %= secondsInHour;

  const minutes = Math.floor(seconds / secondsInMinute);
  seconds %= secondsInMinute;

  const secondsRemaining = seconds;

  const parts = [];
  if (years) parts.push(`${years} year(s)`);
  if (months) parts.push(`${months} month(s)`);
  if (days) parts.push(`${days} day(s)`);
  if (hours) parts.push(`${hours} hour(s)`);
  if (minutes) parts.push(`${minutes} minute(s)`);
  if (secondsRemaining) parts.push(`${secondsRemaining} second(s)`);

  return parts.join(", ");
};

export const getToDoItemById = async (id, asyncKey) => {
  try {
    const value = await AsyncStorage.getItem(asyncKey);
    if (value !== null) {
      const items = JSON.parse(value);
      const foundItem = items.find((_item) => _item.id === id);
      return foundItem;
    } else {
      return null;
    }
  } catch (e) {
    console.error("getToDoItemById", e);
    return null;
  }
};

export const getToDoItems = async (_key, rawList = false) => {
  try {
    if (Object.keys(asyncKeys).indexOf(_key) === -1)
      return ["key not found: " + _key];

    const key = asyncKeys[_key];
    const value = await AsyncStorage.getItem(key);
    const jsonValue = value ? JSON.parse(value) : null;
    const todaysItems = [];

    if (jsonValue !== null && jsonValue !== undefined) {
      if (rawList) {
        return jsonValue;
      }

      jsonValue.forEach((item) => {
        if (
          new Date(item?.date).getDate() === new Date().getDate() &&
          new Date(item?.date).getMonth() === new Date().getMonth() &&
          new Date(item?.date).getFullYear() === new Date().getFullYear()
        ) {
          todaysItems.push(item);
        }
      });

      return {
        todaysItems: todaysItems,
        itemsItemsByDate: sortTasksByDate(jsonValue),
      };
    } else {
      return ["jsonValue", jsonValue];
    }
  } catch (error) {
    return ["error " + error];
  }
};

export const addToDoItems = async (singleItemData) => {
  try {
    let items = [];
    const value = await AsyncStorage.getItem("pendingItems");
    const newItem = singleItemData;
    newItem.id = generateUniqueID();
    newItem.date = mergeTimeAndDate(singleItemData.date, singleItemData.time);
    if (value !== null) {
      const pendingItems = JSON.parse(value);
      pendingItems.unshift(newItem);
      items = pendingItems;
    } else {
      items.push(newItem);
    }
    await AsyncStorage.setItem("pendingItems", JSON.stringify(items));
  } catch (e) {
    console.log("addToDoItems()", e);
  }
};

export const searchItems = async (_value) => {
  try {
    const jsonData = [
      ...(await getToDoItems("COMPLETED", true)),
      ...(await getToDoItems("PENDING", true)),
      ...(await getToDoItems("TRASH", true)),
    ];

    if (
      _value !== undefined &&
      _value !== null &&
      _value !== "" &&
      _value.trim().length > 1
    ) {
      const matchingItems = jsonData.filter((item) => {
        return (
          item.title.toLowerCase().includes(_value.toLowerCase()) ||
          item.note.toLowerCase().includes(_value.toLowerCase())
        );
      });
      if (matchingItems.length > 0) {
        return matchingItems;
      } else {
        return [];
      }
    } else {
      return [];
    }
  } catch (e) {
    console.log("getToDoItems()", e);
  }
};

export const clearTrash = async () => {
  try {
    await AsyncStorage.setItem("trashedItems", JSON.stringify([]));
  } catch (e) {}
};

export const saveToDoItems = async (singleItemData, item, asyncKey) => {
  try {
    const value = await AsyncStorage.getItem(asyncKey);
    if (value !== null) {
      const items = JSON.parse(value);
      if (singleItemData.status === item.status) {
        items.forEach((_item, index) => {
          if (_item.id === item.id) {
            items[index] = singleItemData;
          }
        });
        // SAVE ITEMS
        await AsyncStorage.setItem(asyncKey, JSON.stringify(items));
      } else {
        const updateItems = [];
        items.forEach((_item, index) => {
          if (_item.id !== item.id) {
            updateItems.push(_item);
          }
        });
        await AsyncStorage.setItem(asyncKey, JSON.stringify(updateItems));
        //
        const _value = await AsyncStorage.getItem(
          asyncKeys[singleItemData.status.toUpperCase()]
        );
        if (_value !== null) {
          const existingItems = JSON.parse(_value);
          const newItem = singleItemData;
          existingItems.unshift(newItem);
          await AsyncStorage.setItem(
            asyncKeys[singleItemData.status.toUpperCase()],
            JSON.stringify(existingItems)
          );
        }
      }
    }
  } catch (e) {
    console.log("saveToDoItems()", e);
  }
};

// TASK METHODS END

export const sortTasksByDate = (tasks) => {
  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Initialize an object to store tasks grouped by month and day
  const result = {};

  // Iterate over the tasks
  tasks.forEach((task) => {
    const date = new Date(task.date);
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();

    // Ensure month and day objects exist
    result[month] = result[month] || {};
    result[month][day] = result[month][day] || [];

    // Push the task to the corresponding day in the month
    result[month][day].push(task);
  });

  // Sort the months based on the order defined in monthOrder array
  const sortedResult = {};
  monthOrder.forEach((month) => {
    if (result[month]) {
      sortedResult[month] = result[month];
    }
  });

  return sortedResult;
};

export const editSelectedItems = async (moveTo, activeTab, selectedItemsID) => {
  try {
    if (asyncKeys[moveTo] !== undefined && asyncKeys[activeTab] !== undefined) {
      const value = await AsyncStorage.getItem(asyncKeys[activeTab]);
      if (value !== null) {
        const items = JSON.parse(value);
        const newItems = [];
        const oldItems = [];
        //
        items.forEach((_item) => {
          if (selectedItemsID.indexOf(_item.id) === -1) {
            newItems.push(_item);
          } else {
            _item.status = moveTo.toLowerCase();
            oldItems.push(_item);
          }
        });
        // save the new list of items
        await AsyncStorage.setItem(
          asyncKeys[activeTab],
          JSON.stringify(newItems)
        );
        // move the old list of items
        const newAsyncValue = await AsyncStorage.getItem(asyncKeys[moveTo]);
        if (newAsyncValue !== null) {
          const newAsyncItems = JSON.parse(newAsyncValue);
          const newCombinedItems = [...oldItems, ...newAsyncItems];
          await AsyncStorage.setItem(
            asyncKeys[moveTo],
            JSON.stringify(newCombinedItems)
          );
        }

        //
      }
    } else {
      Alert.alert("Failed", "Failed to move tasks to " + moveTo);
    }
  } catch (e) {
    console.error("editSelectedItems", e);
  }
};

export const mergeTimeAndDate = (date, time) => {
  date = typeof date === "object" ? date : new Date(date);
  time = typeof time === "object" ? time : new Date(time);
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const newDate = new Date(date);
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(seconds);
  return newDate;
};

export const saveUserData = async (data) => {
  //
  if (data === undefined || data === null || typeof data !== "object") {
    Alert.alert(
      "Invalid User",
      "Failed to save login. Please try again later."
    );
    return;
  }
  //
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem("user_data", jsonValue);
    return;
  } catch (e) {
    if (data === undefined || data === null || typeof data !== "object") {
      Alert.alert(
        "Permission Denied",
        "Failed to save login. Please try again later."
      );
      return;
    }
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem("user_data");
    return;
  } catch (e) {}
};

export const deleteSelectedItemsFromTrash = async (
  selectedItemsID,
  activeTab
) => {
  try {
    const value = await AsyncStorage.getItem(asyncKeys[activeTab]);
    if (value !== null) {
      const items = JSON.parse(value);
      const newItems = [];
      //
      items.forEach((_item) => {
        if (selectedItemsID.indexOf(_item.id) === -1) {
          newItems.push(_item);
        }
      });
      await AsyncStorage.setItem(
        asyncKeys[activeTab],
        JSON.stringify(newItems)
      );
    }
  } catch (e) {
    console.log("deleteSelectedItemsFromTrash()", e);
  }
};

export const openWebLink = (link) => {
  Linking.openURL(link).catch((error) =>
    console.error("Error opening link:", error)
  );
};

export const openEmailApp = (toEmail, subject, body) => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const url = `mailto:${toEmail}?subject=${encodedSubject}&body=${encodedBody}`;
  Linking.openURL(url).catch((error) =>
    console.error("Error opening email app:", error)
  );
};

export const shareApp = async () => {
  try {
    const result = await Share.share({
      message:
        "Hey.\nCheck out this cool To Do app called *Du-More*. It has increased my productivity ALOT! 💯.\n\nhttps://play.google.com/store/apps/details?id=com.munya_m.dumore",
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

export const DEV_ADDTODOITEMS = async () => {
  try {
    await AsyncStorage.setItem(
      "completedItems",
      JSON.stringify(DEV_TEST_DATA_COMPLETED)
    );
    await AsyncStorage.setItem(
      "pendingItems",
      JSON.stringify(DEV_TEST_DATA_PENDING)
    );
    await AsyncStorage.setItem(
      "trashedItems",
      JSON.stringify(DEV_TEST_DATA_TRASH)
    );
  } catch (e) {}
};

export const DEV_DELETETODOITEMS = async () => {
  try {
    await AsyncStorage.setItem("completedItems", JSON.stringify([]));
    await AsyncStorage.setItem("pendingItems", JSON.stringify([]));
    await AsyncStorage.setItem("trashedItems", JSON.stringify([]));
  } catch (e) {}
};

export const DEV_TEST_DATA_PENDING = [
  {
    id: 1,
    flag: "purple",
    status: "pending",
    title: "Buy groceries",
    date: "2023-09-03 15:56:51",
    time: "2024-07-01 13:57:35",
    date_created: "2024-01-26 12:00:13",
    date_modified: "2023-11-22 09:30:10",
    note: "Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.",
  },
  {
    id: 2,
    flag: "black",
    status: "pending",
    title: "Try a new restaurant",
    date: "2023-06-28 17:50:48",
    time: "2024-12-11 05:58:36",
    date_created: "2023-12-10 12:49:37",
    date_modified: "2024-10-05 22:38:02",
    note: "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus.",
  },
  {
    id: 3,
    flag: "orange",
    status: "pending",
    title: "Buy groceries",
    date: "2024-07-31 07:01:10",
    time: "2024-03-06 08:25:21",
    date_created: "2023-12-27 05:01:59",
    date_modified: "2024-08-27 10:07:38",
    note: "Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus.",
  },
  {
    id: 4,
    flag: "purple",
    status: "pending",
    title: "Practice gratitude",
    date: "2023-07-15 21:49:02",
    time: "2024-04-18 21:13:47",
    date_created: "2024-07-04 16:06:25",
    date_modified: "2023-12-14 18:28:07",
    note: "Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy.",
  },
  {
    id: 5,
    flag: "cyan",
    status: "pending",
    title: "Read a chapter of a book",
    date: "2024-05-12 20:31:11",
    time: "2024-12-08 09:06:20",
    date_created: "2023-12-21 06:30:41",
    date_modified: "2023-11-05 10:18:30",
    note: "Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat.",
  },
  {
    id: 6,
    flag: "green",
    status: "pending",
    title: "Reflect on accomplishments and set new goals",
    date: "2023-08-25 04:35:33",
    time: "2024-01-14 10:24:42",
    date_created: "2024-05-03 10:27:49",
    date_modified: "2024-04-22 16:01:06",
    note: "Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia.",
  },
  {
    id: 7,
    flag: "black",
    status: "pending",
    title: "Read a chapter of a book",
    date: "2023-08-22 08:52:04",
    time: "2024-01-27 08:41:52",
    date_created: "2024-03-02 19:26:57",
    date_modified: "2024-04-27 08:30:55",
    note: "In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst.",
  },
  {
    id: 8,
    flag: "yellow",
    status: "pending",
    title: "Listen to a podcast episode",
    date: "2024-11-26 01:07:47",
    time: "2024-11-15 08:02:08",
    date_created: "2023-11-13 07:25:04",
    date_modified: "2024-06-28 08:16:29",
    note: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
  },
  {
    id: 9,
    flag: "magenta",
    status: "pending",
    title: "Sort through emails",
    date: "2023-07-15 05:50:23",
    time: "2024-06-05 04:50:54",
    date_created: "2023-11-01 00:51:14",
    date_modified: "2023-07-05 15:56:29",
    note: "Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus. Pellentesque eget nunc.",
  },
  {
    id: 10,
    flag: "magenta",
    status: "pending",
    title: "Attend a workshop or seminar",
    date: "2024-11-05 17:12:35",
    time: "2024-06-26 15:00:23",
    date_created: "2023-10-30 23:41:00",
    date_modified: "2024-06-04 00:45:08",
    note: "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",
  },
  {
    id: "01HR74RBGT6BMNXSDDX0553MG2",
    flag: "purple",
    status: "pending",
    title: "Plan vacation",
    date: new Date(),
    time: new Date(),
    date_created: new Date(),
    date_modified: new Date(),
    note: "Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla.",
  },
  {
    id: "01HR74RBGWRC6Q8M9SV1EX8E6P",
    flag: "red",
    status: "pending",
    title: "Declutter desk",
    date: new Date(),
    time: new Date(),
    date_created: new Date(),
    date_modified: new Date(),
    note: "Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque.",
  },
  {
    id: "01HR74RBGYJEYQJAGGY7PMDH09",
    flag: "maroon",
    status: "pending",
    title: "Attend a yoga class",
    date: new Date(),
    time: new Date(),
    date_created: new Date(),
    date_modified: new Date(),
    note: "Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
  },
  {
    id: "01HR74RBGZDYHYPKF2CTG4SHTT",
    flag: "gray",
    status: "pending",
    title: "Plan vacation",
    date: new Date(),
    time: new Date(),
    date_created: new Date(),
    date_modified: new Date(),
    note: "Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue.",
  },
  {
    id: "01HR74RBH0H6GVJN47RM65F3C5",
    flag: "black",
    status: "pending",
    title: "Try a new restaurant",
    date: new Date(),
    time: new Date(),
    date_created: new Date(),
    date_modified: new Date(),
    note: "Aliquam non mauris. Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
  },
];

export const DEV_TEST_DATA_COMPLETED = [
  {
    id: 1,
    flag: "teal",
    status: "completed",
    title: "Back In Action",
    date: "2023-10-29 06:51:15",
    time: "2024-02-10 07:22:54",
    date_created: "2023-06-14 08:37:05",
    date_modified: "2024-09-20 12:42:08",
    note: "adipiscing lorem vitae mattis nibh ligula nec sem duis aliquam convallis nunc proin at turpis a",
  },
  {
    id: 2,
    flag: "red",
    status: "completed",
    title: "I Am Sam",
    date: "2024-07-15 03:07:11",
    time: "2023-11-03 06:19:43",
    date_created: "2024-05-21 03:20:19",
    date_modified: "2023-09-19 06:59:54",
    note: "dapibus augue vel accumsan tellus nisi eu orci mauris lacinia sapien quis libero nullam sit amet turpis",
  },
  {
    id: 3,
    flag: "blue",
    status: "completed",
    title: "Mrs. Pollifax-Spy",
    date: "2023-12-22 01:39:54",
    time: "2023-09-14 09:02:18",
    date_created: "2023-05-02 13:50:12",
    date_modified: "2023-10-17 08:38:23",
    note: "ipsum ac tellus semper interdum mauris ullamcorper purus sit amet nulla quisque arcu libero rutrum ac lobortis vel dapibus at",
  },
  {
    id: 4,
    flag: "green",
    status: "completed",
    title: "Box of Moon Light",
    date: "2024-08-29 01:07:47",
    time: "2023-03-08 11:27:34",
    date_created: "2024-08-31 20:56:18",
    date_modified: "2023-04-11 15:47:33",
    note: "pellentesque quisque porta volutpat erat quisque erat eros viverra eget congue eget semper rutrum nulla nunc purus phasellus",
  },
  {
    id: 5,
    flag: "pink",
    status: "completed",
    title: "Mahogany",
    date: "2023-07-30 21:42:02",
    time: "2024-06-26 22:45:50",
    date_created: "2024-12-08 03:07:52",
    date_modified: "2024-02-22 06:38:55",
    note: "nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh",
  },
  {
    id: 6,
    flag: "magenta",
    status: "completed",
    title: "Ben-Hur",
    date: "2023-03-29 08:31:27",
    time: "2023-09-07 20:20:23",
    date_created: "2023-07-25 00:26:11",
    date_modified: "2024-08-26 16:43:01",
    note: "odio justo sollicitudin ut suscipit a feugiat et eros vestibulum ac est lacinia nisi venenatis tristique fusce congue diam",
  },
  {
    id: 7,
    flag: "red",
    status: "completed",
    title: "Fox, The",
    date: "2024-01-11 08:48:59",
    time: "2023-06-25 06:15:17",
    date_created: "2024-06-01 11:37:32",
    date_modified: "2024-12-29 17:28:47",
    note: "ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae mauris",
  },
  {
    id: 8,
    flag: "teal",
    status: "completed",
    title: "Wanted: Dead or Alive",
    date: "2023-09-26 14:56:00",
    time: "2023-10-12 17:43:42",
    date_created: "2024-10-04 20:27:40",
    date_modified: "2024-02-01 22:39:26",
    note: "faucibus orci luctus et ultrices posuere cubilia curae mauris viverra diam vitae quam",
  },
  {
    id: 9,
    flag: "teal",
    status: "completed",
    title: "Assault on Precinct 13",
    date: "2023-05-02 12:13:43",
    time: "2023-08-31 00:22:18",
    date_created: "2024-11-09 05:53:30",
    date_modified: "2024-09-26 18:31:27",
    note: "ligula suspendisse ornare consequat lectus in est risus auctor sed tristique in tempus sit",
  },
  {
    id: 10,
    flag: "teal",
    status: "completed",
    title: "Librarian: Quest for the Spear, The",
    date: "2024-03-06 07:07:51",
    time: "2024-08-10 18:49:43",
    date_created: "2024-05-12 20:31:19",
    date_modified: "2024-01-28 08:05:10",
    note: "dui vel nisl duis ac nibh fusce lacus purus aliquet at feugiat non pretium quis lectus suspendisse potenti",
  },
];

export const DEV_TEST_DATA_TRASH = [
  {
    id: 1,
    flag: "blue",
    status: "trash",
    title: "Time Limit",
    date: "2023-07-20 06:49:08",
    time: "2024-06-03 17:03:42",
    date_created: "2023-06-24 23:54:34",
    date_modified: "2024-11-29 12:56:13",
    note: "ultrices vel augue vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere",
  },
  {
    id: 2,
    flag: "cyan",
    status: "trash",
    title: "Russell Peters: The Green Card Tour - Live from the O2 Arena",
    date: "2024-04-09 22:06:55",
    time: "2024-07-19 23:28:33",
    date_created: "2024-09-26 08:40:28",
    date_modified: "2024-01-18 03:35:15",
    note: "rutrum ac lobortis vel dapibus at diam nam tristique tortor",
  },
  {
    id: 3,
    flag: "magenta",
    status: "trash",
    title: "Meatballs III",
    date: "2024-02-02 03:09:27",
    time: "2024-12-17 03:57:11",
    date_created: "2023-07-13 20:55:38",
    date_modified: "2023-04-14 19:44:31",
    note: "sapien in sapien iaculis congue vivamus metus arcu adipiscing molestie hendrerit at vulputate vitae nisl aenean",
  },
  {
    id: 4,
    flag: "maroon",
    status: "trash",
    title: "Rescue Dawn",
    date: "2023-10-25 04:31:36",
    time: "2024-10-19 15:21:01",
    date_created: "2023-08-11 18:52:00",
    date_modified: "2023-04-01 09:36:51",
    note: "felis donec semper sapien a libero nam dui proin leo",
  },
  {
    id: 5,
    flag: "purple",
    status: "trash",
    title: "Slugger's Wife, The",
    date: "2024-08-30 20:58:12",
    time: "2023-12-12 16:37:26",
    date_created: "2024-02-08 03:14:26",
    date_modified: "2024-07-02 06:09:12",
    note: "integer tincidunt ante vel ipsum praesent blandit lacinia erat vestibulum sed magna",
  },
  {
    id: 6,
    flag: "cyan",
    status: "trash",
    title: "Lathe of Heaven, The",
    date: "2023-07-31 16:21:03",
    time: "2024-10-15 17:03:36",
    date_created: "2023-03-17 02:20:01",
    date_modified: "2024-10-05 08:19:04",
    note: "porttitor lorem id ligula suspendisse ornare consequat lectus in est risus auctor",
  },
  {
    id: 7,
    flag: "magenta",
    status: "trash",
    title: "Good bye, Lenin!",
    date: "2024-04-30 10:54:47",
    time: "2024-03-05 14:43:51",
    date_created: "2024-08-18 21:00:38",
    date_modified: "2024-09-15 23:14:30",
    note: "porttitor pede justo eu massa donec dapibus duis at velit eu",
  },
  {
    id: 8,
    flag: "green",
    status: "trash",
    title: "Videodrome",
    date: "2023-09-08 14:56:14",
    time: "2024-08-10 10:00:14",
    date_created: "2023-08-28 14:24:28",
    date_modified: "2024-01-31 11:04:28",
    note: "orci nullam molestie nibh in lectus pellentesque at nulla suspendisse potenti cras in purus eu magna vulputate",
  },
  {
    id: 9,
    flag: "pink",
    status: "trash",
    title: "Sum of All Fears, The",
    date: "2024-07-25 12:34:13",
    time: "2024-12-01 01:54:07",
    date_created: "2024-10-22 23:59:42",
    date_modified: "2023-11-14 12:14:11",
    note: "vel pede morbi porttitor lorem id ligula suspendisse ornare consequat lectus in est risus auctor sed",
  },
  {
    id: 10,
    flag: "green",
    status: "trash",
    title: "Get Carter",
    date: "2023-06-11 10:39:56",
    time: "2023-10-03 03:37:12",
    date_created: "2023-12-21 03:54:19",
    date_modified: "2024-12-12 09:47:34",
    note: "platea dictumst morbi vestibulum velit id pretium iaculis diam erat fermentum justo nec condimentum neque",
  },
];
