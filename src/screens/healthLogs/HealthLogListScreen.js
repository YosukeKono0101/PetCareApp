import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";

// HealthLogListScreen component
const HealthLogListScreen = ({ navigation }) => {
  const { fontSize, theme } = useContext(SettingsContext);
  const [healthLogs, setHealthLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDarkTheme = theme === "dark";

  // Fetch health logs from the server
  useFocusEffect(
    useCallback(() => {
      const fetchHealthLogs = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const cachedHealthLogs = await AsyncStorage.getItem("healthLogs");

          if (cachedHealthLogs) {
            setHealthLogs(JSON.parse(cachedHealthLogs));
          }

          const response = await fetch("http://192.168.1.39:3000/health-logs", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch from server");
          }

          const json = await response.json();
          if (Array.isArray(json)) {
            const formattedLogs = json.map((log) => ({
              ...log,
              log_date: new Date(log.log_date).toLocaleDateString(),
            }));
            setHealthLogs(formattedLogs);
            await AsyncStorage.setItem(
              "healthLogs",
              JSON.stringify(formattedLogs)
            );
          } else {
            throw new Error("Fetched data is not an array");
          }
        } catch (error) {
          console.error("Network request failed:", error);
          Alert.alert(
            "Network Error",
            "Failed to fetch health logs. Please check your network connection."
          );
          // Fallback to AsyncStorage if server fails
          const cachedHealthLogs = await AsyncStorage.getItem("healthLogs");
          if (cachedHealthLogs) {
            setHealthLogs(JSON.parse(cachedHealthLogs));
          } else {
            setHealthLogs([]);
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchHealthLogs();
    }, [])
  );

  // Display a loading indicator while fetching health logs
  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, isDarkTheme && styles.darkContainer]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          isDarkTheme ? styles.darkContainer : styles.lightContainer,
        ]}
      >
        <Text
          style={[styles.title, { fontSize }, isDarkTheme && styles.darkText]}
        >
          Your Health Logs
        </Text>
        {healthLogs.length === 0 ? (
          <View style={styles.noLogsContainer}>
            <Image
              source={
                isDarkTheme
                  ? require("../../../assets/medical-report_dark.png")
                  : require("../../../assets/medical-report_white.png")
              }
              style={styles.noLogsImage}
            />
            <Text
              style={[
                styles.noLogsText,
                { fontSize },
                isDarkTheme && styles.darkText,
              ]}
            >
              You have not added any health logs yet.
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddHealthLog")}
            >
              <Text style={styles.addButtonText}>
                Add Your First Health Log
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          healthLogs.map((log) => (
            <View
              key={log.id}
              style={[
                styles.logCard,
                isDarkTheme ? styles.darkCard : styles.lightCard,
              ]}
            >
              <Image
                source={
                  isDarkTheme
                    ? require("../../../assets/health_log_dark.png")
                    : require("../../../assets/health_log_white.png")
                }
                style={styles.image}
              />
              <View style={styles.logDetails}>
                <Text
                  style={[
                    styles.logDate,
                    { fontSize },
                    isDarkTheme && styles.darkText,
                  ]}
                >
                  {log.log_date}
                </Text>
                <Text
                  style={[
                    styles.logDetail,
                    { fontSize },
                    isDarkTheme && styles.darkText,
                  ]}
                >
                  {log.details}
                </Text>
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
          ))
        )}
        {healthLogs.length > 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddHealthLog")}
          >
            <Text style={styles.addButtonText}>Add New Health Log</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: "black",
  },
  lightContainer: {
    backgroundColor: "#f0f0f0",
  },
  container: {
    flexGrow: 1,
    padding: 20,
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
  },
  darkText: {
    color: "#fff",
  },
  noLogsContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  noLogsImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  noLogsText: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 20,
  },
  logCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  lightCard: {
    backgroundColor: "#fff",
  },
  darkCard: {
    backgroundColor: "#444",
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
    padding: 15,
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
