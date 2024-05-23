import React, { useState, useEffect, useContext } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";
import InputField from "../../components/InputField";
import DatePickerField from "../../components/DatePickerField";
import Button from "../../components/Button";
import Container from "../../components/Container";

// Edit the vaccination record
const EditVaccinationRecordScreen = ({ route, navigation }) => {
  const { vaccinationId } = route.params;
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState(new Date());
  const [petName, setPetName] = useState("");
  const { fontSize, theme } = useContext(SettingsContext);
  const isDarkTheme = theme === "dark";

  // Fetch the vaccination details from the server
  useEffect(() => {
    const fetchVaccinationDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const cachedDetails = await AsyncStorage.getItem(
          `vaccination-${vaccinationId}`
        );

        if (cachedDetails) {
          const cachedData = JSON.parse(cachedDetails);
          setVaccineName(cachedData.vaccine_name);
          setVaccinationDate(new Date(cachedData.vaccination_date));
          setPetName(cachedData.pet_name);
        }

        const response = await fetch(
          `http://192.168.1.39:3000/vaccination/${vaccinationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch from server");
        }

        const json = await response.json();
        if (json) {
          setVaccineName(json.data.vaccine_name);
          setVaccinationDate(new Date(json.data.vaccination_date));
          setPetName(json.data.pet_name);
          await AsyncStorage.setItem(
            `vaccination-${vaccinationId}`,
            JSON.stringify(json.data)
          );
        }
      } catch (error) {
        Alert.alert("Error", "Could not load vaccination details.");
      }
    };

    fetchVaccinationDetails();
  }, [vaccinationId]);

  const handleUpdateVaccination = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://192.168.1.39:3000/vaccination/${vaccinationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vaccine_name: vaccineName,
            vaccination_date: vaccinationDate.toISOString(),
          }),
        }
      );

      if (response.ok) {
        const updatedVaccination = {
          id: vaccinationId,
          vaccine_name: vaccineName,
          vaccination_date: vaccinationDate.toISOString(),
        };
        await AsyncStorage.setItem(
          `vaccination-${vaccinationId}`,
          JSON.stringify(updatedVaccination)
        );
        Alert.alert("Success", "Vaccination updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        const json = await response.json();
        Alert.alert("Failed", json.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating the vaccination");
    }
  };

  return (
    <Container isDarkTheme={isDarkTheme}>
      <InputField
        value={vaccineName}
        onChangeText={setVaccineName}
        placeholder="Vaccine Name"
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
      />
      <DatePickerField
        date={vaccinationDate}
        setDate={setVaccinationDate}
        isDarkTheme={isDarkTheme}
        fontSize={fontSize}
      />
      <Button
        onPress={handleUpdateVaccination}
        title="Update Vaccination"
        color="#28a745"
      />
    </Container>
  );
};

export default EditVaccinationRecordScreen;
