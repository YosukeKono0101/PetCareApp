import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";
import { API_URL } from "@env";

// PetListScreen component
const PetListScreen = ({ navigation }) => {
  const { fontSize, theme } = useContext(SettingsContext);
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDarkTheme = theme === "dark";

  // Fetch pets from the server
  useFocusEffect(
    useCallback(() => {
      const fetchPets = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const cachedPets = await AsyncStorage.getItem("pets");

          if (cachedPets) {
            setPets(JSON.parse(cachedPets));
          }

          const response = await fetch(`${API_URL}/pets`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch from server");
          }

          const json = await response.json();
          // Update the state with the fetched pets
          if (Array.isArray(json)) {
            console.log("Fetched pets from the server");
            setPets(json);
            await AsyncStorage.setItem("pets", JSON.stringify(json));
          } else {
            console.error("Fetched data is not an array:", json);
            // Clear the pets array if the fetched data is not an array
            setPets([]);
          }
        } catch (error) {
          Alert.alert(
            "Network Error",
            "Failed to get pets. Please check your network connection."
          );
          // Fallback to AsyncStorage if server fails
          const cachedPets = await AsyncStorage.getItem("pets");
          if (cachedPets) {
            console.log("Fetching pets from AsyncStorage");
            setPets(JSON.parse(cachedPets));
          } else {
            setPets([]);
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchPets();
    }, [])
  );

  // Display a loading indicator while fetching pets
  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        isDarkTheme ? styles.darkSafeArea : styles.lightSafeArea,
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          isDarkTheme ? styles.darkContainer : styles.lightContainer,
        ]}
      >
        <Text
          style={[
            styles.title,
            { fontSize },
            isDarkTheme ? styles.darkText : styles.lightText,
          ]}
        >
          Your Pets
        </Text>
        {pets.length === 0 ? (
          <View style={styles.noPetsContainer}>
            <Image
              source={
                isDarkTheme
                  ? require("../../../assets/dog_dark.png")
                  : require("../../../assets/dog_white.png")
              }
              style={styles.noPetsImage}
            />
            <Text
              style={[
                styles.noPetsText,
                { fontSize },
                isDarkTheme ? styles.darkText : styles.lightText,
              ]}
            >
              You have not added any pets yet.
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddPet")}
            >
              <Text style={styles.addButtonText}>Add Your First Pet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          pets.map((pet) => (
            <View
              key={pet.id}
              style={[
                styles.petCard,
                isDarkTheme ? styles.darkCard : styles.lightCard,
              ]}
            >
              <Image
                source={
                  isDarkTheme
                    ? require("../../../assets/dog_dark.png")
                    : require("../../../assets/dog_white.png")
                }
                style={styles.image}
              />
              <View style={styles.petDetails}>
                <Text
                  style={[
                    styles.petName,
                    { fontSize },
                    isDarkTheme ? styles.darkText : styles.lightText,
                  ]}
                >
                  {pet.name}
                </Text>
                <Text
                  style={[
                    styles.petType,
                    { fontSize },
                    isDarkTheme ? styles.darkText : styles.lightText,
                  ]}
                >
                  {pet.type}
                </Text>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() =>
                    navigation.navigate("PetDetails", { petId: pet.id })
                  }
                >
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        {pets.length > 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddPet")}
          >
            <Text style={styles.addButtonText}>Add New Pet</Text>
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
  lightSafeArea: {
    backgroundColor: "#f0f0f0",
  },
  darkSafeArea: {
    backgroundColor: "black",
  },
  container: {
    flexGrow: 1,
    padding: 15,
  },
  lightContainer: {
    backgroundColor: "#f0f0f0",
  },
  darkContainer: {
    backgroundColor: "black",
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
  lightText: {
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  noPetsContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  noPetsImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 1000,
  },
  noPetsText: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 20,
  },
  petCard: {
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
  petDetails: {
    flex: 1,
    marginLeft: 15,
  },
  petName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  petType: {
    fontSize: 16,
    marginVertical: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  detailsButton: {
    marginTop: 10,
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

export default PetListScreen;
