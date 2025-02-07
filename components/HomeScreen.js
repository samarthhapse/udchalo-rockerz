import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native"
import { Audio } from "expo-av"

export default function HomeScreen({ navigation }) {
  const playButtonSound = async () => {
    const { sound } = await Audio.Sound.createAsync(require("../assets/sounds/button-click.mp3"))
    await sound.playAsync()
  }

  const handleNavigation = (screen) => {
    playButtonSound()
    navigation.navigate(screen)
  }

  return (
    <ImageBackground source={require("../assets/images/military-background.jpg")} style={styles.container}>
      <Text style={styles.title}>Defense Runner</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation("Game")}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation("CustomizeAvatar")}>
          <Text style={styles.buttonText}>Customize Avatar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleNavigation("Leaderboard")}>
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    width: "80%",
  },
  button: {
    backgroundColor: "rgba(52, 152, 219, 0.8)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})

