import React, { useState, useContext, useEffect } from "react";
import { Text, StyleSheet, Alert, ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";
import Button from "../../components/Button";
import Container from "../../components/Container";
import { API_URL } from "@env";

// HealthLogDetailsScreen component
const HealthLogDetailsScreen = ({ route, navigation }) => {
  const { logId } = route.params;
  const { fontSize, theme } = useContext(SettingsContext);
  const [logDetails, setLogDetails] = useState(null);
  const isDarkTheme = theme === "dark";

  // Fetch the health log details from the server
  useEffect(() => {
    const fetchLogDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const cachedLogDetails = await AsyncStorage.getItem(
          `healthLog-${logId}`
        );
        if (cachedLogDetails) {
          console.log("Fetching data from AsyncStorage");
          setLogDetails(JSON.parse(cachedLogDetails));
        } else {
          console.log("Fetching data from the server");
          const response = await fetch(`${API_URL}/health-logs/${logId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch from server");
          }

          const json = await response.json();
          if (response.ok) {
            setLogDetails(json);
            await AsyncStorage.setItem(
              `healthLog-${logId}`,
              JSON.stringify(json)
            );
          } else {
            throw new Error(json.message || "Unable to fetch log details");
          }
        }
      } catch (error) {
        Alert.alert("Error", error.message);
        setLogDetails(null);
      }
    };

    fetchLogDetails();
  }, [logId]);

  // Handle the deletion of the health log entry
  const handleDeleteLog = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/health-logs/${logId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await AsyncStorage.removeItem(`healthLog-${logId}`);
        Alert.alert("Success", "Health log deleted successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const json = await response.json();
        throw new Error(json.message || "Failed to delete health log");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Display a loading indicator while fetching the health log details
  if (!logDetails) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Container isDarkTheme={isDarkTheme}>
      <View style={styles.content}>
        <Text
          style={[styles.title, { fontSize }, isDarkTheme && styles.darkText]}
        >
          Health Log Details
        </Text>
        <Text
          style={[
            styles.detailText,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Pet: {logDetails.pet_name}
        </Text>
        <Text
          style={[
            styles.detailText,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Date: {new Date(logDetails.log_date).toLocaleDateString()}
        </Text>
        <Text
          style={[
            styles.detailText,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Details: {logDetails.details}
        </Text>
      </View>
      <Button
        onPress={() => navigation.navigate("EditHealthLog", { logId })}
        title="Edit Log"
        color="#007bff"
      />
      <Button onPress={handleDeleteLog} title="Delete Log" color="#ff4444" />
    </Container>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  detailText: {
    fontSize: 18,
    color: "#333",
    marginVertical: 5,
  },
});

export default HealthLogDetailsScreen;
