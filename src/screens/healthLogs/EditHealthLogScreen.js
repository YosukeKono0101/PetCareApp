import React, { useState, useEffect, useContext } from "react";
import { Alert, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";
import InputField from "../../components/InputField";
import DatePickerField from "../../components/DatePickerField";
import Button from "../../components/Button";
import Container from "../../components/Container";

// Edit the health log entry
const EditHealthLogScreen = ({ route, navigation }) => {
  const { logId } = route.params;
  const [logDate, setLogDate] = useState(new Date());
  const [details, setDetails] = useState("");
  const [petName, setPetName] = useState("");
  const { fontSize, theme } = useContext(SettingsContext);
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
          const logData = JSON.parse(cachedLogDetails);
          setLogDate(new Date(logData.log_date));
          setDetails(logData.details);
          setPetName(logData.pet_name);
        }

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
          // Update the state with the health log details
          setLogDate(new Date(json.log_date));
          setDetails(json.details);
          setPetName(json.pet_name);
          await AsyncStorage.setItem(
            `healthLog-${logId}`,
            JSON.stringify(json)
          );
        } else {
          Alert.alert(
            "Error",
            json.message || "Failed to fetch health log details"
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          error.message || "Failed to fetch health log details"
        );
      }
    };

    fetchLogDetails();
  }, [logId]);

  // Update the health log entry on the server
  const handleUpdateLog = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://192.168.1.39:3000/health-logs/${logId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            log_date: logDate.toISOString(),
            details,
          }),
        }
      );
      if (response.ok) {
        const updatedLog = {
          log_date: logDate.toISOString(),
          details,
          pet_name: petName,
        };
        await AsyncStorage.setItem(
          `healthLog-${logId}`,
          JSON.stringify(updatedLog)
        );
        Alert.alert("Success", "Health log updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const json = await response.json();
        Alert.alert("Error", json.message || "Failed to update health log");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update health log");
    }
  };

  return (
    <Container isDarkTheme={isDarkTheme}>
      <DatePickerField
        date={logDate}
        setDate={setLogDate}
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
      />
      <InputField
        value={details}
        onChangeText={setDetails}
        placeholder="Details"
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
        multiline
        height={100}
      />
      <Button
        onPress={handleUpdateLog}
        title="Update Health Log"
        color="#28a745"
      />
    </Container>
  );
};

export default EditHealthLogScreen;
