import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsContext } from "../../context/SettingsContext";
import { API_URL } from "@env";

// VaccinationScheduleScreen component
const VaccinationScheduleScreen = ({ navigation }) => {
  const { fontSize, theme } = useContext(SettingsContext);
  const [vaccinations, setVaccinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDarkTheme = theme === "dark";

  // Fetch vaccination records from the server
  useFocusEffect(
    useCallback(() => {
      const fetchVaccinations = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const cachedVaccinations = await AsyncStorage.getItem("vaccinations");

          if (cachedVaccinations) {
            setVaccinations(JSON.parse(cachedVaccinations));
          }

          const response = await fetch(`${API_URL}/vaccination`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch from server");
          }

          const json = await response.json();
          setVaccinations(json);
          await AsyncStorage.setItem("vaccinations", JSON.stringify(json));
        } catch (error) {
          console.error("Network request failed:", error);
          Alert.alert(
            "Network Error",
            "Failed to get vaccination logs. Please check your network connection."
          );

          const cachedVaccinations = await AsyncStorage.getItem("vaccinations");
          if (cachedVaccinations) {
            console.log("Fetching data from AsyncStorage");
            setVaccinations(JSON.parse(cachedVaccinations));
          } else {
            console.log("No cached data available");
            setVaccinations([]);
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchVaccinations();
    }, [])
  );

  // Display a loading indicator while fetching health logs
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
          Vaccination Schedule
        </Text>
        {vaccinations.length === 0 ? (
          <View style={styles.noLogsContainer}>
            <Image
              source={
                isDarkTheme
                  ? require("../../../assets/vaccine_logo_dark.png")
                  : require("../../../assets/vaccine_logo_white.png")
              }
              style={styles.noLogsImage}
            />
            <Text
              style={[
                styles.noLogsText,
                { fontSize },
                isDarkTheme ? styles.darkText : styles.lightText,
              ]}
            >
              You have not added any vaccination logs yet.
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("AddVaccinationRecord")}
            >
              <Text style={styles.addButtonText}>
                Add Your First Vaccination
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          vaccinations.map((vaccination) => (
            <View
              key={vaccination.id}
              style={[
                styles.vaccinationCard,
                isDarkTheme ? styles.darkCard : styles.lightCard,
              ]}
            >
              <Image
                source={
                  isDarkTheme
                    ? require("../../../assets/vaccine_dark.png")
                    : require("../../../assets/vaccine_white.png")
                }
                style={styles.image}
              />
              <View style={styles.vaccinationDetails}>
                <Text
                  style={[
                    styles.vaccinationName,
                    { fontSize },
                    isDarkTheme ? styles.darkText : styles.lightText,
                  ]}
                >
                  {vaccination.vaccine_name}
                </Text>
                <Text
                  style={[
                    styles.vaccinationDate,
                    { fontSize },
                    isDarkTheme ? styles.darkText : styles.lightText,
                  ]}
                >
                  {new Date(vaccination.vaccination_date).toLocaleDateString()}
                </Text>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() =>
                    navigation.navigate("VaccinationDetails", {
                      vaccinationId: vaccination.id,
                    })
                  }
                >
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        {vaccinations.length > 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddVaccinationRecord")}
          >
            <Text style={styles.addButtonText}>Add New Vaccination</Text>
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
    padding: 20,
  },
  lightContainer: {
    backgroundColor: "#f0f0f0",
  },
  darkContainer: {
    backgroundColor: "black",
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
  noLogsContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  noLogsImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  noLogsText: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 20,
  },
  vaccinationCard: {
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
  vaccinationDetails: {
    flex: 1,
    marginLeft: 15,
  },
  vaccinationName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  vaccinationDate: {
    fontSize: 16,
    marginVertical: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 20,
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

export default VaccinationScheduleScreen;
