import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const HealthLogListScreen = ({ navigation }) => {
  const [healthLogs, setHealthLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchHealthLogs = async () => {
        try {
          const response = await fetch("http://192.168.1.39:3000/health-logs");
          const json = await response.json();
          if (Array.isArray(json)) {
            const formattedLogs = json.map((log) => ({
              ...log,
              log_date: new Date(log.log_date).toLocaleDateString(),
            }));
            setHealthLogs(formattedLogs);
          } else {
            throw new Error("Fetched data is not an array");
          }
        } catch (error) {
          Alert.alert("Error", error.message || "Failed to fetch health logs");
        } finally {
          setIsLoading(false);
        }
      };

      fetchHealthLogs();
    }, [])
  );

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Health Logs</Text>
      {healthLogs.map((log) => (
        <View key={log.id} style={styles.logCard}>
          <Image
            source={require("../../../assets/health_log.png")}
            style={styles.image}
          />
          <View style={styles.logDetails}>
            <Text style={styles.logDate}>{log.log_date}</Text>
            <Text style={styles.logDetail}>{log.details}</Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() =>
                navigation.navigate("HealthLogDetails", { logId: log.id })
              }
            >
              <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddHealthLog")}
      >
        <Text style={styles.addButtonText}>Add New Health Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  logCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  logDetails: {
    flex: 1,
    marginLeft: 15,
  },
  logDate: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  logDetail: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  detailsButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  addButton: {
    marginTop: 30,
    paddingVertical: 15,
    backgroundColor: "#28a745",
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HealthLogListScreen;
