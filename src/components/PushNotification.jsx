import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Button,
  Platform,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { globalStyles } from "../styles/styles";
import { formatDuration } from "../js/main";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function PushNotification({
  title = "ACTION",
  taskNote = "",
  addToDoItems,
  taskTitle = "No title",
  datetime = new Date(new Date().getTime() + 15 * 1000),
}) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <TouchableOpacity
      onPress={async () => {
        addToDoItems();
        await schedulePushNotification(taskTitle, taskNote, datetime);
      }}
    >
      <Text style={globalStyles.modal_button_1}>{title}</Text>
    </TouchableOpacity>
  );
}

async function schedulePushNotification(taskTitle, taskNote, datetime) {
  const currentTime = new Date();
  const scheduledTime = new Date(datetime);
  const secondsUntilNotification = Math.floor(
    (scheduledTime - currentTime) / 1000
  );

  ToastAndroid.show(
    formatDuration(secondsUntilNotification),
    ToastAndroid.LONG,
    1000
  );

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${taskTitle}`,
      body: `NOTE: ${taskNote}`,
      //
      // data: { data: "goes here" },
    },
    trigger: { seconds: secondsUntilNotification },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
