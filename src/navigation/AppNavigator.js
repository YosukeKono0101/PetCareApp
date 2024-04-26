import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import PetDetailsScreen from "../screens/PetDetailsScreen";
import VaccinationScheduleScreen from "../screens/VaccinationScheduleScreen";
import HealthLogScreen from "../screens/HealthLogScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="PetDetails"
        component={PetDetailsScreen}
        options={{ title: "Pet Details" }}
      />
      <Stack.Screen
        name="VaccinationSchedule"
        component={VaccinationScheduleScreen}
        options={{ title: "Vaccination Schedule" }}
      />
      <Stack.Screen
        name="HealthLog"
        component={HealthLogScreen}
        options={{ title: "Health Log" }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
