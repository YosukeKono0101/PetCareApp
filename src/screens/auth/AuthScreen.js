import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useContext } from "react";
import { SettingsContext } from "../../context/SettingsContext";

// Auth screen component
const AuthScreen = ({
  title,
  buttonText,
  onPress,
  isDarkTheme,
  fontSize,
  children,
}) => {
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
            {title}
          </Text>
          {children}
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{buttonText}</Text>
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

export default AuthScreen;
