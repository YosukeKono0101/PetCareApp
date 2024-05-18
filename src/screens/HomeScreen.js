import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPets = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const response = await fetch("http://192.168.1.39:3000/pets", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const json = await response.json();
          if (Array.isArray(json)) {
            setPets(json);
          } else {
            console.error("Fetched data is not an array:", json);
            setPets([]);
          }
        } catch (error) {
          console.error("Failed to fetch pets:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPets();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login");
  };

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome to Pet Care App</Text>
        <View style={styles.quickLinks}>
          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => navigation.navigate("PetList")}
          >
            <Image
              source={require("../../assets/pet_icon.jpeg")}
              style={styles.linkImage}
            />
            <Text style={styles.linkText}>Your Pets</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => navigation.navigate("HealthLogList")}
          >
            <Image
              source={require("../../assets/health_log.png")}
              style={styles.linkImage}
            />
            <Text style={styles.linkText}>Health Logs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => navigation.navigate("VaccinationSchedule")}
          >
            <Image
              source={require("../../assets/vaccination.png")}
              style={styles.linkImage}
            />
            <Text style={styles.linkText}>Vaccination Schedule</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Your Pets</Text>
        {pets.map((pet) => (
          <View key={pet.id} style={styles.petCard}>
            <Image
              source={require("../../assets/pet_icon.jpeg")}
              style={styles.image}
            />
            <View style={styles.petDetails}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petType}>{pet.type}</Text>
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
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
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
    color: "#333",
  },
  quickLinks: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  linkCard: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: "30%",
  },
  linkImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  petCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  petDetails: {
    flex: 1,
    marginLeft: 15,
  },
  petName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  petType: {
    fontSize: 16,
    color: "#666",
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
  logoutButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
    width: "100%",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
