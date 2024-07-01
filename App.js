import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { HomePage } from "./src/views/HomeView";

export default function App() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="red" />
      <SafeAreaView style={styles.container}>
        <HomePage />
        {/* <ManualTest /> */}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
  },
});
