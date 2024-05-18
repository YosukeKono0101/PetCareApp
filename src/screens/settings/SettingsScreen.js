import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SettingsContext } from "../../context/SettingsContext";

const SettingsScreen = ({ navigation }) => {
  const { fontSize, theme, updateFontSize, updateTheme } =
    useContext(SettingsContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.setting}>
          <Text style={[styles.label, { fontSize }]}>Font Size</Text>
          <Slider
            style={styles.slider}
            minimumValue={12}
            maximumValue={24}
            step={1}
            value={fontSize}
            onValueChange={updateFontSize}
          />
          <Text style={[styles.fontSizePreview, { fontSize }]}>
            Preview Text (Size: {fontSize})
          </Text>
        </View>
        <View style={styles.setting}>
          <Text style={[styles.label, { fontSize }]}>Theme</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  setting: {
    marginBottom: 30,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  fontSizePreview: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
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
});

export default SettingsScreen;
