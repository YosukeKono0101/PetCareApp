import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { SettingsProvider } from "./src/context/SettingsContext";

const App = () => {
  return (
    <SettingsProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SettingsProvider>
  );
};

export default App;
