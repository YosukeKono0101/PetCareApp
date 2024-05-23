import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { SettingsContext } from "../../context/SettingsContext";

// Array of open source licenses used in the app
const licenses = [
  {
    name: "React",
    license: "MIT",
    link: "https://github.com/facebook/react/blob/main/LICENSE",
  },
  {
    name: "React Native",
    license: "MIT",
    link: "https://github.com/facebook/react-native/blob/main/LICENSE",
  },
];

// About screen component
const AboutScreen = () => {
  const { fontSize, theme } = useContext(SettingsContext);
  const isDarkTheme = theme === "dark";

  return (
    <ScrollView
      style={[
        styles.container,
        isDarkTheme ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      <Text
        style={[styles.header, { fontSize }, isDarkTheme && styles.darkText]}
      >
        About PetCareApp
      </Text>
      <Text
        style={[
          styles.description,
          { fontSize },
          isDarkTheme && styles.darkText,
        ]}
      >
        PetCareApp is a comprehensive solution for managing your pets' health
        and wellness. With features for tracking vaccinations and health logs,
        PetCareApp ensures that you have all the information you need to care
        for your pets.
      </Text>
      <Text
        style={[styles.header, { fontSize }, isDarkTheme && styles.darkText]}
      >
        Open Source Licenses
      </Text>
      {licenses.map((license, index) => (
        <View key={index} style={styles.licenseContainer}>
          <Text
            style={[
              styles.licenseName,
              { fontSize },
              isDarkTheme && styles.darkText,
            ]}
          >
            {license.name}
          </Text>
          <Text
            style={[
              styles.licenseText,
              { fontSize },
              isDarkTheme && styles.darkText,
            ]}
          >
            {license.license}
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL(license.link)}>
            <Text style={styles.licenseLink}>{license.link}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  lightContainer: {
    backgroundColor: "#f0f0f0",
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
  },
  licenseContainer: {
    marginBottom: 15,
  },
  licenseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  licenseText: {
    fontSize: 16,
    color: "#555",
  },
  licenseLink: {
    fontSize: 14,
    color: "#007bff",
  },
  darkText: {
    color: "#fff",
  },
});

export default AboutScreen;
