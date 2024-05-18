import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faPaw } from "@fortawesome/free-solid-svg-icons/faPaw";
import { faBookMedical } from "@fortawesome/free-solid-svg-icons/faBookMedical";
import { faSyringe } from "@fortawesome/free-solid-svg-icons/faSyringe";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";

import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import LandingPageScreen from "../screens/LandingPageScreen";

// Pet
import PetDetailsScreen from "../screens/pets/PetDetailsScreen";
import PetListScreen from "../screens/pets/PetListScreen";
import AddPetScreen from "../screens/pets/AddPetScreen";
import EditPetScreen from "../screens/pets/EditPetScreen";
// Health Log
import HealthLogDetailsScreen from "../screens/healthLogs/HealthLogDetailsScreen";
import HealthLogListScreen from "../screens/healthLogs/HealthLogListScreen";
import AddHealthLogScreen from "../screens/healthLogs/AddHealthLogScreen";
import EditHealthLogScreen from "../screens/healthLogs/EditHealthLogScreen";
// Vaccination
import VaccinationScheduleScreen from "../screens/vaccinations/VaccinationScheduleScreen";
import VaccinationDetailsScreen from "../screens/vaccinations/VaccinationDetailsScreen";
import AddVaccinationRecordScreen from "../screens/vaccinations/AddVaccinationRecordScreen";
import EditVaccinationRecordScreen from "../screens/vaccinations/EditVaccinationRecordScreen";

// Settings
import SettingsScreen from "../screens/settings/SettingsScreen";
import AboutScreen from "../screens/about/AboutScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faHouse} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PetList"
        component={PetListScreen}
        options={{
          tabBarLabel: "Your Pets",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faPaw} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="HealthLogList"
        component={HealthLogListScreen}
        options={{
          tabBarLabel: "Health Logs",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faBookMedical} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="VaccinationSchedule"
        component={VaccinationScheduleScreen}
        options={{
          tabBarLabel: "Vaccines",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faSyringe} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faCog} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="LandingPage">
      <Stack.Screen
        name="LandingPage"
        component={LandingPageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PetDetails"
        component={PetDetailsScreen}
        options={{ title: "Pet Details" }}
      />
      <Stack.Screen
        name="AddPet"
        component={AddPetScreen}
        options={{ title: "Add New Pet" }}
      />
      <Stack.Screen
        name="EditPet"
        component={EditPetScreen}
        options={{ title: "Edit Pet" }}
      />
      <Stack.Screen
        name="HealthLogDetails"
        component={HealthLogDetailsScreen}
        options={{ title: "Health Log Details" }}
      />
      <Stack.Screen
        name="AddHealthLog"
        component={AddHealthLogScreen}
        options={{ title: "Add Health Log" }}
      />
      <Stack.Screen
        name="EditHealthLog"
        component={EditHealthLogScreen}
        options={{ title: "Edit Health Log" }}
      />
      <Stack.Screen
        name="VaccinationDetails"
        component={VaccinationDetailsScreen}
        options={{ title: "Vaccination Details" }}
      />
      <Stack.Screen
        name="AddVaccinationRecord"
        component={AddVaccinationRecordScreen}
        options={{ title: "Add Vaccination Record" }}
      />
      <Stack.Screen
        name="EditVaccinationRecord"
        component={EditVaccinationRecordScreen}
        options={{ title: "Edit Vaccination Record" }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "About" }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
