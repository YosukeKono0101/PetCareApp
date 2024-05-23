import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faPaw } from "@fortawesome/free-solid-svg-icons/faPaw";
import { faBookMedical } from "@fortawesome/free-solid-svg-icons/faBookMedical";
import { faSyringe } from "@fortawesome/free-solid-svg-icons/faSyringe";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { SettingsContext } from "../context/SettingsContext";

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

// App Navigator
const Stack = createNativeStackNavigator();
// Home Tabs
const Tab = createBottomTabNavigator();

// Tab Screen Options
const tabScreenOptions = (label, icon) => ({
  tabBarLabel: label,
  headerShown: false,
  tabBarIcon: ({ color, size }) => (
    <FontAwesomeIcon icon={icon} color={color} size={size} />
  ),
});

// Home Tabs
function HomeTabs() {
  const { theme } = useContext(SettingsContext);
  const isDarkTheme = theme === "dark";

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: isDarkTheme ? "black" : "#fff" },
        tabBarLabelStyle: { color: isDarkTheme ? "#fff" : "black" },
        tabBarIconStyle: { color: isDarkTheme ? "#fff" : "black" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={tabScreenOptions("Home", faHouse)}
      />
      <Tab.Screen
        name="PetList"
        component={PetListScreen}
        options={tabScreenOptions("Your Pets", faPaw)}
      />
      <Tab.Screen
        name="HealthLogList"
        component={HealthLogListScreen}
        options={tabScreenOptions("Health Logs", faBookMedical)}
      />
      <Tab.Screen
        name="VaccinationSchedule"
        component={VaccinationScheduleScreen}
        options={tabScreenOptions("Vaccines", faSyringe)}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={tabScreenOptions("Settings", faCog)}
      />
    </Tab.Navigator>
  );
}

// App Navigator
function AppNavigator() {
  const { theme } = useContext(SettingsContext);
  const isDarkTheme = theme === "dark";

  return (
    <Stack.Navigator
      initialRouteName="LandingPage"
      screenOptions={{
        headerStyle: { backgroundColor: isDarkTheme ? "#000" : "#fff" },
        headerTintColor: isDarkTheme ? "#fff" : "#000",
      }}
    >
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
