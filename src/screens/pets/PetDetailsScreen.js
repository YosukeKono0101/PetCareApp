import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";

const PetDetailsScreen = ({ route, navigation }) => {
  const { petId } = route.params;
  const [petDetails, setPetDetails] = useState(null);
  const { fontSize, theme } = useContext(SettingsContext);

  const isDarkTheme = theme === "dark";

  useFocusEffect(
    React.useCallback(() => {
      const fetchPetDetails = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const response = await fetch(
            `http://192.168.1.39:3000/pets/${petId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const json = await response.json();
          if (response.ok) {
            setPetDetails({
              ...json,
              gender: json.gender || "Not available",
              breed: json.breed || "Not available",
              age: json.age || "Not available",
              weight: json.weight ? `${json.weight} kg` : "Not available",
              birthDate: json.birthDate || "Not available",
            });
          } else {
            throw new Error(json.message || "Unable to fetch data");
          }
        } catch (error) {
          Alert.alert("Error", error.message);
          setPetDetails(null);
        }
      };

      fetchPetDetails();
    }, [petId])
  );

  const handleDeletePet = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://192.168.1.39:3000/pets/${petId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
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

  if (!petDetails) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <View style={[styles.container, isDarkTheme && styles.darkContainer]}>
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
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditPet", { petId })}
      >
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePet}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  loader: {
    flex: 1,
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
  editButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "80%",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default PetDetailsScreen;
