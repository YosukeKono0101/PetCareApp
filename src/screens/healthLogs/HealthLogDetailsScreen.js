import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const HealthLogDetailsScreen = ({ route, navigation }) => {
  const { logId } = route.params;
  const [logDetails, setLogDetails] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchLogDetails = async () => {
        try {
          const response = await fetch(
            `http://192.168.1.39:3000/health-logs/${logId}`
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
      const response = await fetch(
        `http://192.168.1.39:3000/health-logs/${logId}`,
        {
          method: "DELETE",
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
    <View style={styles.container}>
      <Text style={styles.title}>Health Log Details</Text>
      <Text>Pet: {logDetails.pet_name}</Text>
      <Text>Date: {new Date(logDetails.log_date).toLocaleDateString()}</Text>
      <Text>Details: {logDetails.details}</Text>
      <Button
        title="Edit Log"
        onPress={() => navigation.navigate("EditHealthLog", { logId })}
      />
      <Button title="Delete Log" onPress={handleDeleteLog} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default HealthLogDetailsScreen;
