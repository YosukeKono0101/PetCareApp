import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch("http://192.168.1.39:8081/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const json = await response.json();
      if (response.status === 200) {
        Alert.alert("Success", "Registration successful");
      } else {
        Alert.alert("Failed", json.message);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred during registration: " + error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

export default RegisterScreen;
