import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About PetCareApp</Text>
      <Text style={styles.text}>
        PetCareApp is a mobile application designed to help pet owners manage
        the health and wellness of their pets. It includes features like health
        logs, vaccination schedules, and more.
      </Text>
      <Text style={style.subtitle}>Open Source Licenses</Text>
      <Text style={styles.text}>
        This app uses open source software: - React Native - Expo - Other
        libraries listed here..
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default AboutScreen;
