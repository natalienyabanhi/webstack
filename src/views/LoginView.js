import { decode as base64_decode, encode as base64_encode } from "base-64";
import React, { useState } from "react";
import axios from "axios";
import {
  Pressable,
  View,
  Text,
  TextInput,
  Dimensions,
  Modal,
} from "react-native";
import { baseURL, saveUserData } from "../js/main";
import Loading from "../components/Loading";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function LoginView({
  handleSetLoginView,
  loginView,
  setLoginView,
}) {
  const [user, setUser] = useState("munya_dev");
  const [password, setPassword] = useState("xxxxxxx");
  const [showPassword, setShowPassword] = useState(true);
  const [message, setMessage] = useState({ for: [], message: [] });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    const _message = { for: [], message: [] };
    setIsLoading(true);

    if (password.length === 0) {
      _message.for.push("password");
      _message.message.push("Please enter your password");
    }
    if (user.length === 0) {
      _message.for.push("user");
      _message.message.push("Please enter your username or email");
    }
    if (_message.for.length > 0) {
      setMessage(_message);
      setIsLoading(false);
      return;
    }

    try {
      const base64 = base64_encode(`${user}:${password}`);

      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Basic ${base64}`);

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${baseURL}?loginuser=1`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          // console.log("result fetchData", result);
          const responseObj = JSON.parse(result);
          if (responseObj?.result === true) {
            saveUserData(responseObj?.value);
            cleanUp();
            handleSetLoginView(false);
          } else if (typeof responseObj?.message === "string") {
            _message.for.push("result");
            _message.message.push(responseObj?.message);
          } else {
            _message.for.push("result");
            _message.message.push("Something went wrong. Try again later.");
          }
          setMessage(_message);
          setIsLoading(false);
        })
        .catch((error) => {
          // console.log("LoginView 0 error", error);
        });
    } catch (error) {
      setIsLoading(false);
      // console.log("LoginView 1 error", error);
    }
  };

  const cleanUp = () => {
    setUser("");
    setPassword("");
    setShowPassword(true);
    setMessage({ for: [], message: [] });
  };

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
    <Modal
      animationType="slide"
      transparent={true}
      visible={loginView}
      onRequestClose={() => {
        cleanUp();
        handleSetLoginView(false);
      }}
    >
      {isLoading ? (
        <Loading message={"... Logging In ..."} />
      ) : (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            height: windowHeight,
          }}
        >
          {message.for.indexOf("result") !== -1 ? (
            <Text
              style={{
                fontSize: 20,
                color: "red",
                marginBottom: 40,
                fontWeight: "bold",
                textAlign: "center",
                paddingHorizontal: 15,
              }}
            >
              {message.message[message.for.indexOf("result")]}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 20,
                color: "black",
                marginBottom: 40,
                fontWeight: "bold",
                textAlign: "center",
                paddingHorizontal: 15,
              }}
            >
              LOG IN TO SYNC YOUR TASKS
            </Text>
          )}
          <TextInput
            value={user}
            onChangeText={(text) => {
              setUser(text);
            }}
            placeholder="Username or Email"
            autoCapitalize={"none"}
            autoComplete="email"
            keyboardType={"email-address"}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor:
                message.for.indexOf("user") !== -1 ? "red" : "silver",
              width: windowWidth * 0.8,
              marginBottom: 20,
            }}
          />
          {message.for.indexOf("user") !== -1 && (
            <Text style={{ color: "red", marginBottom: 20, marginTop: -10 }}>
              {message.message[message.for.indexOf("user")]}
            </Text>
          )}
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
            }}
            textContentType="password"
            secureTextEntry={showPassword}
            placeholder="Password"
            style={{
              padding: 10,
              borderWidth: 1,
              marginBottom: 20,
              width: windowWidth * 0.8,
              borderColor:
                message.for.indexOf("password") !== -1 ? "red" : "silver",
            }}
          />
          {message.for.indexOf("password") !== -1 && (
            <Text style={{ color: "red", marginBottom: 20, marginTop: -10 }}>
              {message.message[message.for.indexOf("password")]}
            </Text>
          )}
          <Pressable
            onPress={async () => {
              await fetchData();
            }}
            style={{
              marginTop: 20,
            }}
          >
            {({ pressed }) => (
              <Text
                style={{
                  color: "white",
                  borderRadius: 5,
                  textAlign: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  width: windowWidth * 0.5,
                  backgroundColor: "black",
                  opacity: pressed ? 0.4 : 1,
                }}
              >
                LOGIN
              </Text>
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              cleanUp();
              handleSetLoginView(false);
            }}
            style={{
              marginTop: 50,
            }}
          >
            {({ pressed }) => (
              <Text
                style={{
                  color: "gray",
                  borderRadius: 5,
                  textAlign: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  width: windowWidth * 0.5,
                  borderWidth: 1,
                  borderColor: "silver",
                  backgroundColor: "white",
                  opacity: pressed ? 0.4 : 1,
                }}
              >
                CANCEL
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </Modal>
  );
}
