import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";

const HealthLogDetailsScreen = ({ route, navigation }) => {
  const { logId } = route.params;
  const { fontSize, theme } = useContext(SettingsContext);
  const [logDetails, setLogDetails] = useState(null);

  const isDarkTheme = theme === "dark";

  useFocusEffect(
    React.useCallback(() => {
      const fetchLogDetails = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const response = await fetch(
            `http://192.168.1.39:3000/health-logs/${logId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const json = await response.json();
          if (response.ok) {
            setLogDetails(json);
          } else {
            throw new Error(json.message || "Unable to fetch log details");
          }
        } catch (error) {
          Alert.alert("Error", error.message);
          setLogDetails(null);
        }
      };

      fetchLogDetails();
    }, [logId])
  );

  const handleDeleteLog = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://192.168.1.39:3000/health-logs/${logId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
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

  if (!logDetails) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={[styles.container, isDarkTheme && styles.darkContainer]}>
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditHealthLog", { logId })}
      >
        <Text style={styles.buttonText}>Edit Log</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={handleDeleteLog}
      >
        <Text style={styles.buttonText}>Delete Log</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  darkContainer: {
    backgroundColor: "#333",
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
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "80%",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default HealthLogDetailsScreen;
