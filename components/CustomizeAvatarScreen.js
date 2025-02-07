"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

const uniforms = ["Army", "Navy", "Air Force"]
const ranks = ["Captain", "Major", "Colonel"]
const gears = ["Helmet", "Backpack", "Boots"]

export default function CustomizeAvatarScreen({ navigation }) {
  const [uniform, setUniform] = useState("Army")
  const [rank, setRank] = useState("Captain")
  const [gear, setGear] = useState("Helmet")

  useEffect(() => {
    loadCustomization()
  }, [])

  const loadCustomization = async () => {
    try {
      const customization = await AsyncStorage.getItem("avatarCustomization")
      if (customization) {
        const { uniform, rank, gear } = JSON.parse(customization)
        setUniform(uniform)
        setRank(rank)
        setGear(gear)
      }
    } catch (error) {
      console.error("Error loading customization:", error)
    }
  }

  const saveCustomization = async () => {
    try {
      await AsyncStorage.setItem("avatarCustomization", JSON.stringify({ uniform, rank, gear }))
      navigation.goBack()
    } catch (error) {
      console.error("Error saving customization:", error)
    }
  }

  const renderOptions = (options, selectedOption, setOption) => {
    return options.map((option) => (
      <TouchableOpacity
        key={option}
        style={[styles.option, selectedOption === option && styles.selectedOption]}
        onPress={() => setOption(option)}
      >
        <Text style={styles.optionText}>{option}</Text>
      </TouchableOpacity>
    ))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customize Avatar</Text>
      <View style={styles.avatarContainer}>
        <Image source={require("../assets/images/soldier-avatar.png")} style={styles.avatarImage} />
      </View>
      <View style={styles.optionsContainer}>
        <Text style={styles.sectionTitle}>Uniform</Text>
        <View style={styles.optionsRow}>{renderOptions(uniforms, uniform, setUniform)}</View>
        <Text style={styles.sectionTitle}>Rank</Text>
        <View style={styles.optionsRow}>{renderOptions(ranks, rank, setRank)}</View>
        <Text style={styles.sectionTitle}>Gear</Text>
        <View style={styles.optionsRow}>{renderOptions(gears, gear, setGear)}</View>
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ecf0f1",
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  option: {
    backgroundColor: "#34495e",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#3498db",
  },
  optionText: {
    color: "#ecf0f1",
    fontSize: 16,
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

