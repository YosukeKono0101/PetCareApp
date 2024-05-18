import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

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
  // Add more licenses as needed
];

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>About PetCareApp</Text>
      <Text style={styles.description}>
        PetCareApp is a comprehensive solution for managing your pets' health
        and wellness. With features for tracking vaccinations, health logs, and
        more, PetCareApp ensures that you have all the information you need to
        care for your pets.
      </Text>
      <Text style={styles.header}>Open Source Licenses</Text>
      {licenses.map((license, index) => (
        <View key={index} style={styles.licenseContainer}>
          <Text style={styles.licenseName}>{license.name}</Text>
          <Text style={styles.licenseText}>{license.license}</Text>
          <Text style={styles.licenseLink}>{license.link}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
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
});

export default AboutScreen;
