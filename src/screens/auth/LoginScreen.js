import React, { useState, useContext } from "react";
import { TextInput, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthScreen from "./AuthScreen";
import { SettingsContext } from "../../context/SettingsContext";

// LoginScreen component
const LoginScreen = ({ navigation }) => {
  const { fontSize, theme } = useContext(SettingsContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isDarkTheme = theme === "dark";

  // handleLogin function
  const handleLogin = async () => {
    // Fetch request to login
    try {
      const response = await fetch("http://192.168.1.39:3000/login", {
        // POST method
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      // Response JSON
      const json = await response.json();
      // If response status is 200
      if (response.status === 200) {
        await AsyncStorage.setItem("token", json.token);
        await AsyncStorage.setItem("userData", JSON.stringify(json.userData));
        Alert.alert("Success", "Login successful", [
          {
            text: "OK",
            onPress: () => navigation.navigate("HomeTabs", { screen: "Home" }),
          },
        ]);
      } else {
        Alert.alert("Failed", json.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <AuthScreen
      title="Login to Your Account"
      buttonText="Login"
      onPress={handleLogin}
      isDarkTheme={isDarkTheme}
      fontSize={fontSize}
    >
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={[
          styles.input,
          isDarkTheme ? styles.darkInput : styles.lightInput,
          { fontSize },
        ]}
        placeholderTextColor={isDarkTheme ? "#aaa" : "#333"}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[
          styles.input,
          isDarkTheme ? styles.darkInput : styles.lightInput,
          { fontSize },
        ]}
        placeholderTextColor={isDarkTheme ? "#aaa" : "#333"}
      />
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 25,
  },
  lightInput: {
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  darkInput: {
    borderColor: "#555",
    backgroundColor: "#444",
  },
});

export default LoginScreen;
