"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface LeaderboardProps {
  onBack: () => void
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [scores, setScores] = useState<number[]>([])

  useEffect(() => {
    loadScores()
  }, [])

  const loadScores = async () => {
    try {
      const storedScores = await AsyncStorage.getItem("scores")
      if (storedScores) {
        setScores(JSON.parse(storedScores))
      }
    } catch (error) {
      console.error("Error loading scores:", error)
    }
  }

  const renderScoreItem = ({ item, index }: { item: number; index: number }) => (
    <View style={styles.scoreItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.score}>{item}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={scores}
        renderItem={renderScoreItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No scores yet</Text>}
      />
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back to Menu</Text>
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
  scoreItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#34495e",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  rank: {
    color: "#ecf0f1",
    fontSize: 18,
    fontWeight: "bold",
  },
  score: {
    color: "#3498db",
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#ecf0f1",
    fontSize: 16,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})

