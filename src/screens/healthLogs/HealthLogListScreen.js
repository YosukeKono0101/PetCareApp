import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";

const HealthLogListScreen = ({ navigation }) => {
  const [healthLogs, setHealthLogs] = useState([]);

  useEffect(() => {
    const fetchHealthLogs = async () => {
      const response = await fetch("http://192.168.1.39:3000/health-logs");
      const json = await response.json();
      setHealthLogs(json);
    };

    fetchHealthLogs();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={healthLogs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>
              {item.log_date} - {item.details}
            </Text>
            <Button
              title="Edit"
              onPress={() =>
                navigation.navigate("EditHealthLog", { logId: item.id })
              }
            />
            <Button
              title="Delete"
              onPress={() => handleDeleteHealthLog(item.id)}
            />
          </View>
        )}
      />
    </View>
  );

  async function handleDeleteHealthLog(id) {
    const response = await fetch(`http://192.168.1.39:3000/health-logs/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setHealthLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
      Alert.alert("Success", "Health log deleted successfully");
    } else {
      Alert.alert("Error", "Failed to delete the health log");
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
  },
});

export default HealthLogListScreen;
