import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useContext } from "react";
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
import { SettingsContext } from "../context/SettingsContext";

const HomeScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fontSize, theme } = useContext(SettingsContext);

  const isDarkTheme = theme === "dark";

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

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, isDarkTheme && styles.darkSafeArea]}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          isDarkTheme && styles.darkContainer,
        ]}
      >
        <Text
          style={[styles.title, { fontSize }, isDarkTheme && styles.darkText]}
        >
          Welcome to Pet Care App
        </Text>
        <View style={styles.quickLinks}>
          <TouchableOpacity
            style={[styles.linkCard, isDarkTheme && styles.darkCard]}
            onPress={() => navigation.navigate("PetList")}
          >
            <Image
              source={
                isDarkTheme
                  ? require("../../assets/dog_dark.png")
                  : require("../../assets/dog_white.png")
              }
              style={styles.linkImage}
            />
            <Text
              style={[
                styles.linkText,
                { fontSize },
                isDarkTheme && styles.darkText,
              ]}
            >
              Your Pets
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.linkCard, isDarkTheme && styles.darkCard]}
            onPress={() => navigation.navigate("HealthLogList")}
          >
            <Image
              source={
                isDarkTheme
                  ? require("../../assets/health_log_dark.png")
                  : require("../../assets/health_log_white.png")
              }
              style={styles.linkImage}
            />
            <Text
              style={[
                styles.linkText,
                { fontSize },
                isDarkTheme && styles.darkText,
              ]}
            >
              Health Logs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.linkCard, isDarkTheme && styles.darkCard]}
            onPress={() => navigation.navigate("VaccinationSchedule")}
          >
            <Image
              source={
                isDarkTheme
                  ? require("../../assets/vaccine_dark.png")
                  : require("../../assets/vaccine_white.png")
              }
              style={styles.linkImage}
            />
            <Text
              style={[
                styles.linkText,
                { fontSize },
                isDarkTheme && styles.darkText,
              ]}
            >
              Vaccines
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={[
            styles.subtitle,
            { fontSize },
            isDarkTheme && styles.darkText,
          ]}
        >
          Your Pets
        </Text>
        {pets.length === 0 ? (
          <View style={styles.noPetsContainer}>
            <Image
              source={
                isDarkTheme
                  ? require("../../assets/pets_dark.png")
                  : require("../../assets/pets_white.png")
              }
              style={styles.noPetsImage}
            />
            <Text
              style={[
                styles.noPetsText,
                { fontSize },
                isDarkTheme && styles.darkText,
              ]}
            >
              No pets added yet.
            </Text>
          </View>
        ) : (
          pets.map((pet) => (
            <View
              key={pet.id}
              style={[styles.petCard, isDarkTheme && styles.darkCard]}
            >
              <Image
                source={
                  isDarkTheme
                    ? require("../../assets/dog_dark.png")
                    : require("../../assets/dog_white.png")
                }
                style={styles.image}
              />
              <View style={styles.petDetails}>
                <Text
                  style={[
                    styles.petName,
                    { fontSize },
                    isDarkTheme && styles.darkText,
                  ]}
                >
                  {pet.name}
                </Text>
                <Text
                  style={[
                    styles.petType,
                    { fontSize },
                    isDarkTheme && styles.darkText,
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
                  <Text style={[styles.detailsButtonText, { fontSize }]}>
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  darkSafeArea: {
    backgroundColor: "black",
  },
  container: {
    flexGrow: 1,
    padding: 20,
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
    color: "#333",
  },
  darkText: {
    color: "#fff",
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
  darkCard: {
    backgroundColor: "#444",
  },
  linkImage: {
    width: 70,
    height: 70,
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
  noPetsContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noPetsImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  noPetsText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#666",
    textAlign: "center",
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
});

export default HomeScreen;
