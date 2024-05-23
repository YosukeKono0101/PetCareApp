import React from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";

// Container component
const Container = ({ children, isDarkTheme }) => {
  return (
    <SafeAreaView style={[styles.safeArea, isDarkTheme && styles.darkSafeArea]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isDarkTheme && styles.darkScrollContainer,
        ]}
      >
        <View style={[styles.container, isDarkTheme && styles.darkContainer]}>
          {children}
        </View>
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
    backgroundColor: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  darkScrollContainer: {
    backgroundColor: "#333",
  },
  container: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  darkContainer: {
    backgroundColor: "#333",
  },
});

export default Container;
