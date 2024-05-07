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
} from "react-native";

const HomeScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPets = async () => {
        try {
          const response = await fetch("http://192.168.1.39:3000/pets");
          const json = await response.json();
          console.log("Fetched pets:", json);
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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Pets</Text>
      {pets.map((pet) => (
        <View key={pet.id} style={styles.petCard}>
          <Image
            source={require("../../assets/pet_icon.jpeg")}
            style={styles.image}
          />
          <Text style={styles.petName}>{pet.name}</Text>
          <Text>{pet.type}</Text>
          <Button
            title="View Details"
            onPress={() => navigation.navigate("PetDetails", { petId: pet.id })}
          />
        </View>
      ))}
      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Pet"
          onPress={() => navigation.navigate("AddPet")}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  petCard: {
    padding: 20,
    marginVertical: 5,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    alignItems: "center",
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  addButtonContainer: {
    marginTop: 20,
  },
});

export default HomeScreen;
