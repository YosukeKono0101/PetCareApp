import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const savedFontSize = await AsyncStorage.getItem("fontSize");
      const savedTheme = await AsyncStorage.getItem("theme");
      const savedNotificationsEnabled = await AsyncStorage.getItem(
        "notificationsEnabled"
      );

      if (savedFontSize) {
        setFontSize(parseInt(savedFontSize, 10));
      }

      if (savedTheme) {
        setTheme(savedTheme);
      }

      if (savedNotificationsEnabled !== null) {
        setNotificationsEnabled(savedNotificationsEnabled === "true");
      }
    };

    loadSettings();
  }, []);

  const updateFontSize = async (value) => {
    setFontSize(value);
    await AsyncStorage.setItem("fontSize", value.toString());
  };

  const updateTheme = async (value) => {
    setTheme(value);
    await AsyncStorage.setItem("theme", value);
  };

  const updateNotificationsEnabled = async (value) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem("notificationsEnabled", value.toString());
  };

  return (
    <SettingsContext.Provider
      value={{
        fontSize,
        theme,
        notificationsEnabled,
        updateFontSize,
        updateTheme,
        updateNotificationsEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
