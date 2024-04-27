import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const HealthLogListScreen = ({ navigation, route }) => {
  const { petId } = route.params;
  const [healthLogs, setHealthLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthLogs = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.39:3000/health-logs/${petId}`
        );
        const data = await response.json();
        setHealthLogs(data);
      } catch (error) {
        console.error("Failed to fetch health logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthLogs();
  }, [petId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate("HealthLogDetails", { logId: item.id })
      }
    >
      <Text style={styles.date}>{item.log_date}</Text>
      <Text style={styles.details}>{item.details}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={healthLogs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: "#f9c2ff",
    borderRadius: 5,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    fontSize: 16,
  },
});

export default HealthLogListScreen;
