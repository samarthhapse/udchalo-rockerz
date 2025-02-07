"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function CustomizeAvatar({ onBack }) {
  const [uniform, setUniform] = useState("Army")
  const [rank, setRank] = useState("Captain")
  const [gear, setGear] = useState("Helmet")

  const saveCustomization = async () => {
    try {
      await AsyncStorage.setItem("avatarCustomization", JSON.stringify({ uniform, rank, gear }))
      onBack()
    } catch (error) {
      console.error("Error saving customization:", error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customize Avatar</Text>

      <View style={styles.optionContainer}>
        <Text style={styles.optionTitle}>Uniform:</Text>
        <TouchableOpacity style={styles.option} onPress={() => setUniform("Army")}>
          <Text style={uniform === "Army" ? styles.selectedOption : styles.optionText}>Army</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => setUniform("Navy")}>
          <Text style={uniform === "Navy" ? styles.selectedOption : styles.optionText}>Navy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => setUniform("Air Force")}>
          <Text style={uniform === "Air Force" ? styles.selectedOption : styles.optionText}>Air Force</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.optionContainer}>
        <Text style={styles.optionTitle}>Rank:</Text>
        <TouchableOpacity style={styles.option} onPress={() => setRank("Captain")}>
          <Text style={rank === "Captain" ? styles.selectedOption : styles.optionText}>Captain</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => setRank("Major")}>
          <Text style={rank === "Major" ? styles.selectedOption : styles.optionText}>Major</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => setRank("Colonel")}>
          <Text style={rank === "Colonel" ? styles.selectedOption : styles.optionText}>Colonel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.optionContainer}>
        <Text style={styles.optionTitle}>Gear:</Text>
        <TouchableOpacity style={styles.option} onPress={() => setGear("Helmet")}>
          <Text style={gear === "Helmet" ? styles.selectedOption : styles.optionText}>Helmet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => setGear("Backpack")}>
          <Text style={gear === "Backpack" ? styles.selectedOption : styles.optionText}>Backpack</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => setGear("Boots")}>
          <Text style={gear === "Boots" ? styles.selectedOption : styles.optionText}>Boots</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveCustomization}>
        <Text style={styles.saveButtonText}>Save and Return</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c3e50",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ecf0f1",
    marginBottom: 20,
    textAlign: "center",
  },
  optionContainer: {
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ecf0f1",
    marginBottom: 10,
  },
  option: {
    backgroundColor: "#34495e",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  optionText: {
    color: "#ecf0f1",
    fontSize: 16,
  },
  selectedOption: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})

