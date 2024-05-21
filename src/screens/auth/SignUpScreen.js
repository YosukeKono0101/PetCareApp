import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";

const SignUpScreen = ({ navigation }) => {
  const { fontSize, theme } = useContext(SettingsContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isDarkTheme = theme === "dark";

  const handleSignUp = async () => {
    try {
      const response = await fetch("http://192.168.1.39:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const json = await response.json();
      if (response.status === 200) {
        await AsyncStorage.setItem("token", json.token);
        Alert.alert("Success", "Registration successful", [
          {
            text: "OK",
            onPress: () => navigation.navigate("HomeTabs", { screen: "Home" }),
          },
        ]);
      } else {
        Alert.alert("Failed", json.message);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred during registration: " + error.message
      );
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        isDarkTheme ? styles.darkSafeArea : styles.lightSafeArea,
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            isDarkTheme ? styles.darkContainer : styles.lightContainer,
          ]}
        >
          <Image
            source={
              isDarkTheme
                ? require("../../../assets/app_logo_dark.png")
                : require("../../../assets/app_logo_white.png")
            }
            style={styles.logo}
          />
          <Text
            style={[
              styles.header,
              { fontSize },
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}
          >
            Create an Account
          </Text>
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
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  lightSafeArea: {
    backgroundColor: "white",
  },
  darkSafeArea: {
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  lightContainer: {
    backgroundColor: "white",
  },
  darkContainer: {
    backgroundColor: "black",
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  lightText: {
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
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
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
