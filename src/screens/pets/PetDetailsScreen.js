import React, { useState, useContext, useCallback } from "react";
import {
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";
import Button from "../../components/Button";
import Container from "../../components/Container";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "@env";

// PetDetailsScreen component
const PetDetailsScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  const [petDetails, setPetDetails] = useState(null);
  const { fontSize, theme } = useContext(SettingsContext);
  const isDarkTheme = theme === "dark";

  // Fetch the pet details from the server
  useFocusEffect(
    useCallback(() => {
      const fetchPetDetails = async () => {
        try {
          const token = await AsyncStorage.getItem("token");

          // Check if pet details are available in AsyncStorage
          const cachedPetDetails = await AsyncStorage.getItem(`pet-${petId}`);
          if (cachedPetDetails) {
            console.log("Fetching data from AsyncStorage");
            setPetDetails(JSON.parse(cachedPetDetails));
          } else {
            console.log("Fetching data from the server");
            const response = await fetch(`${API_URL}/pets/${petId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error("Failed to fetch from server");
            }

            const json = await response.json();
            // Update the state with the pet details
            if (response.ok) {
              setPetDetails(json);
              await AsyncStorage.setItem(`pet-${petId}`, JSON.stringify(json));
            } else {
              throw new Error(json.message || "Unable to fetch data");
            }
          }
        } catch (error) {
          Alert.alert("Error", error.message);
          setPetDetails(null);
        }
      };

      fetchPetDetails();
    }, [petId])
  );

  // Handle the deletion of the pet
  const handleDeletePet = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/pets/${petId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      // Show an alert if the pet was deleted successfully
      if (response.ok) {
        await AsyncStorage.removeItem(`pet-${petId}`);
        Alert.alert("Success", "Pet deleted successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        throw new Error(json.message || "Failed to delete pet");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Show a loading indicator while fetching the pet details
  if (!petDetails) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <Container isDarkTheme={isDarkTheme}>
      <View style={styles.content}>
        <Image
          source={require("../../../assets/pet_icon.jpeg")}
          style={styles.image}
        />
        <Text
          style={[styles.title, { fontSize }, isDarkTheme && styles.darkText]}
        >
          {petDetails.name}
        </Text>
        <Text
          style={[
            styles.detailText,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Type: {petDetails.type}
        </Text>
        <Text
          style={[
            styles.detailText,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Gender: {petDetails.gender}
        </Text>
        <Text
          style={[
            styles.detailText,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Breed: {petDetails.breed}
        </Text>
        <Text
          style={[
            styles.detailText,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Age: {petDetails.age}
        </Text>
        <Text
          style={[
            styles.detailText,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Weight: {petDetails.weight}
        </Text>
        <Text
          style={[
            styles.detailText,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Birth Date: {petDetails.birthDate}
        </Text>
      </View>
      <Button
        onPress={() => navigation.navigate("EditPet", { petId })}
        title="Edit"
        color="#007bff"
      />
      <Button onPress={handleDeletePet} title="Delete" color="#ff4444" />
    </Container>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  detailText: {
    fontSize: 18,
    marginBottom: 5,
    color: "#555",
  },
});

export default PetDetailsScreen;
