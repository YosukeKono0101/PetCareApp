import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a context for managing settings
const SettingsContext = createContext();

// SettingsProvider component to manage settings state
const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    fontSize: 16,
    theme: "light",
    notificationsEnabled: true,
  });

  // Load settings from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.multiGet([
          "fontSize",
          "theme",
          "notificationsEnabled",
        ]);
        setSettings({
          fontSize: savedSettings[0][1]
            ? parseInt(savedSettings[0][1], 10)
            : 16,
          theme: savedSettings[1][1] || "light",
          notificationsEnabled: savedSettings[2][1] === "true",
        });
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  // Update settings in state and AsyncStorage
  const updateSettings = async (key, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
    await AsyncStorage.setItem(key, value.toString());
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        updateFontSize: (value) => updateSettings("fontSize", value),
        updateTheme: (value) => updateSettings("theme", value),
        updateNotificationsEnabled: (value) =>
          updateSettings("notificationsEnabled", value),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
