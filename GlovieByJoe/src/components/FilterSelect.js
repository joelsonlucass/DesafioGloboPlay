// FilterSelect.js
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

// Se usar a lib oficial do RN v0.64+ ou expo:
import { Picker } from '@react-native-picker/picker';

function FilterSelect({ options, selectedValue, onValueChange, first }) {
    if (Platform.OS === 'web') {
        // Renderiza <select> no web
        return (
            <select
                style={styles.webSelect}
                value={selectedValue}
                onChange={(e) => onValueChange(e.target.value)}
            >
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.name}
                    </option>
                ))}
            </select>
        );
    }

    // Em iOS/Android: usar <Picker>
    return (
        <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={styles.nativePicker}
            dropdownIconColor="#fff" // para Android
        >
            <Picker.Item key={""} label={first} value={""} />
            {options.map((opt) => (
                <Picker.Item key={opt.id} label={opt.name} value={opt.id} />
            ))}
        </Picker>
    );
}

const styles = StyleSheet.create({
    webSelectContainer: {
        width: 210,
        height: 70,
    },
    webSelect: {
        fontSize: 16,
        padding: 4,
        height: 200,
        backgroundColor: "rgba(0,0,0,0)",
        color: "#fff"
    },
    nativePicker: {
        color: "#fff",
        width: 210,
        height: 60,
    },
});

export default FilterSelect;
