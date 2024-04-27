import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import PetDetailsScreen from "../screens/pets/PetDetailsScreen";
import PetListScreen from "../screens/pets/PetListScreen";
import AddPetScreen from "../screens/pets/AddPetScreen";
import EditPetScreen from "../screens/pets/EditPetScreen";
import HealthLogScreen from "../screens/healthLogs/HealthLogListScreen";
import HealthLogListScreen from "../screens/healthLogs/HealthLogListScreen";
import AddHealthLogScreen from "../screens/healthLogs/AddHealthLogScreen";
import EditHealthLogScreen from "../screens/healthLogs/EditHealthLogScreen";
import VaccinationScheduleScreen from "../screens/vaccinations/VaccinationScheduleScreen";
import AddVaccinationRecordScreen from "../screens/vaccinations/AddVaccinationRecordScreen";
import EditVaccinationRecordScreen from "../screens/vaccinations/EditVaccinationRecordScreen";
import LandingPageScreen from "../screens/LandingPageScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="PetList"
        component={PetListScreen}
        options={{ title: "Your Pets" }}
      />
      <Tab.Screen
        name="VaccinationSchedule"
        component={VaccinationScheduleScreen}
        options={{ title: "Vaccination Schedule" }}
      />
      <Tab.Screen
        name="HealthLogList"
        component={HealthLogListScreen}
        options={{ title: "Health Logs" }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen
        name="LandingPage"
        component={LandingPageScreen}
        options={{ title: "Welcome" }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: "Sign Up" }}
      />
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ title: "Home", headerShown: false }}
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
        name="HealthLog"
        component={HealthLogScreen}
        options={{ title: "Health Log" }}
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
        name="AddVaccinationRecord"
        component={AddVaccinationRecordScreen}
        options={{ title: "Add Vaccination Record" }}
      />
      <Stack.Screen
        name="EditVaccinationRecord"
        component={EditVaccinationRecordScreen}
        options={{ title: "Edit Vaccination Record" }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
