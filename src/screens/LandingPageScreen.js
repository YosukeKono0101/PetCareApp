import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SettingsContext } from "../context/SettingsContext";

const LandingPageScreen = ({ navigation }) => {
  const { theme } = useContext(SettingsContext);
  const isDarkTheme = theme === "dark";

  return (
    <View
      style={[
        styles.container,
        isDarkTheme ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      <Image
        source={
          isDarkTheme
            ? require("../../assets/app_logo_dark.png")
            : require("../../assets/app_logo_white.png")
        }
        style={styles.logo}
      />
      <Text
        style={[
          styles.welcomeText,
          isDarkTheme ? styles.darkText : styles.lightText,
        ]}
      >
        Welcome to PetWell
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    width: 350,
    height: 350,
    marginBottom: 5,
  },
  welcomeText: {
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
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LandingPageScreen;
