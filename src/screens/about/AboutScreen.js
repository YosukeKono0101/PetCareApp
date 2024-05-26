import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Button,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { SettingsContext } from "../../context/SettingsContext";
import licenses from "../../../licenses.json";

// About screen component
const AboutScreen = () => {
  const { fontSize, theme } = useContext(SettingsContext);
  const isDarkTheme = theme === "dark";
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [displayCount, setDisplayCount] = useState(10);

  const handleToggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleShowMore = () => {
    setDisplayCount(displayCount + 10);
  };

  const displayedLicenses = Object.keys(licenses).slice(0, displayCount);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
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
      {displayedLicenses.map((key, index) => (
        <View key={index} style={styles.licenseContainer}>
          <TouchableOpacity onPress={() => handleToggleExpand(index)}>
            <Text
              style={[
                styles.licenseName,
                { fontSize },
                isDarkTheme && styles.darkText,
              ]}
            >
              {key}
            </Text>
          </TouchableOpacity>
          <Collapsible collapsed={expandedIndex !== index}>
            <View style={styles.collapsibleContent}>
              <Text
                style={[
                  styles.licenseText,
                  { fontSize },
                  isDarkTheme && styles.darkText,
                ]}
              >
                {licenses[key].licenses}
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(licenses[key].licenseUrl)}
              >
                <Text style={styles.licenseLink}>
                  {licenses[key].licenseUrl}
                </Text>
              </TouchableOpacity>
            </View>
          </Collapsible>
        </View>
      ))}
      {displayCount < Object.keys(licenses).length && (
        <View style={styles.showMoreContainer}>
          <Button title="Show More" onPress={handleShowMore} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
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
  collapsibleContent: {
    paddingTop: 10,
    paddingBottom: 10,
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
  showMoreContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default AboutScreen;
