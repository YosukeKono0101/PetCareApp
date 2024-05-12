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
    return <ActivityIndicator size="large" color="#0000ff" />;
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
          <Text style={styles.logDetail}>
            {log.log_date} - {log.details}
          </Text>
          <Button
            title="View Details"
            onPress={() =>
              navigation.navigate("HealthLogDetails", { logId: log.id })
            }
          />
        </View>
      ))}
      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Health Log"
          onPress={() => navigation.navigate("AddHealthLog")}
        />
      </View>
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
    marginVertical: 10,
  },
  logCard: {
    padding: 20,
    marginVertical: 5,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    alignItems: "center",
  },
  logDetail: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  addButtonContainer: {
    marginTop: 20,
  },
});

export default HealthLogListScreen;
