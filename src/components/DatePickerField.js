import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

// DatePickerField component
const DatePickerField = ({ date, setDate, isDarkTheme, fontSize }) => {
  // State for showing the date picker modal
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Function to show the date picker modal
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  // Function to handle date change
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <>
      <TouchableOpacity onPress={showDatePickerModal} style={styles.dateButton}>
        <Text style={[styles.dateButtonText, { fontSize }]}>
          Select Date: {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dateButton: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DatePickerField;
