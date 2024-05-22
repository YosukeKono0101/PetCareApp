import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SettingsContext } from "../../context/SettingsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = ({ navigation }) => {
  const { fontSize, theme, updateFontSize, updateTheme } =
    useContext(SettingsContext);

  const isDarkTheme = theme === "dark";

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login");
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Session expired", "Please log in again.");
        navigation.navigate("Login");
      }
    };

    checkToken();
  }, [navigation]);

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        isDarkTheme ? styles.darkSafeArea : styles.lightSafeArea,
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          isDarkTheme ? styles.darkContainer : styles.lightContainer,
        ]}
      >
        <Text
          style={[
            styles.title,
            { fontSize },
            isDarkTheme ? styles.darkText : styles.lightText,
          ]}
        >
          Settings
        </Text>
        <View
          style={[
            styles.setting,
            isDarkTheme ? styles.darkSetting : styles.lightSetting,
          ]}
        >
          <Text
            style={[styles.label, { fontSize }, isDarkTheme && styles.darkText]}
          >
            Font Size
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={12}
            maximumValue={20}
            step={1}
            value={fontSize}
            onValueChange={updateFontSize}
          />
          <Text
            style={[
              styles.fontSizePreview,
              { fontSize },
              isDarkTheme && styles.darkText,
            ]}
          >
            Preview Text (Size: {fontSize})
          </Text>
        </View>
        <View
          style={[
            styles.setting,
            isDarkTheme ? styles.darkSetting : styles.lightSetting,
          ]}
        >
          <Text
            style={[styles.label, { fontSize }, isDarkTheme && styles.darkText]}
          >
            Theme
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => updateTheme(theme === "light" ? "dark" : "light")}
          >
            <Text style={styles.buttonText}>
              {theme === "light"
                ? "Switch to Dark Theme"
                : "Switch to Light Theme"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.aboutButton}
          onPress={() => navigation.navigate("About")}
        >
          <Text style={[styles.aboutButtonText, { fontSize }]}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={[styles.aboutButtonText, { fontSize }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  lightSafeArea: {
    backgroundColor: "#f0f0f0",
  },
  darkSafeArea: {
    backgroundColor: "black",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  lightContainer: {
    backgroundColor: "#f0f0f0",
  },
  darkContainer: {
    backgroundColor: "black",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  lightText: {
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  setting: {
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  lightSetting: {
    backgroundColor: "#fff",
  },
  darkSetting: {
    backgroundColor: "#444",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  fontSizePreview: {
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  aboutButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  aboutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SettingsScreen;
