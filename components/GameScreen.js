"use client"

import { useRef, useState, useEffect } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, StatusBar } from "react-native"
import { GameEngine } from "react-native-game-engine"
import Matter from "matter-js"
import { Audio } from "expo-av"
import Player from "./gameComponents/Player"
import Floor from "./gameComponents/Floor"

const { width, height } = Dimensions.get("window")

const Physics = (entities, { time, dispatch }) => {
  const engine = entities.physics.engine
  Matter.Engine.update(engine, time.delta)

  const player = entities.player.body
  const obstacles = Object.keys(entities).filter((key) => key.startsWith("obstacle"))
  const collectibles = Object.keys(entities).filter((key) => key.startsWith("collectible"))

  // Check for collisions
  obstacles.forEach((obstacleKey) => {
    const obstacle = entities[obstacleKey].body
    if (Matter.Collision.collides(player, obstacle)) {
      dispatch({ type: "game-over" })
    }
  })

  collectibles.forEach((collectibleKey) => {
    const collectible = entities[collectibleKey].body
    if (Matter.Collision.collides(player, collectible)) {
      dispatch({ type: "collect-item", collectible: collectibleKey })
    }
  })

  return entities
}

export default function GameScreen({ navigation }) {
  const [running, setRunning] = useState(true)
  const [score, setScore] = useState(0)
  const gameEngine = useRef(null)
  const [sound, setSound] = useState()

  useEffect(() => {
    setupAudio()
    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [sound]) // Added sound to dependencies

  const setupAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(require("../assets/sounds/game-music.mp3"), { isLooping: true })
    setSound(sound)
    await sound.playAsync()
  }

  const setupWorld = () => {
    const engine = Matter.Engine.create({ enableSleeping: false })
    const world = engine.world

    const player = Matter.Bodies.rectangle(50, height - 100, 50, 50)
    const floor = Matter.Bodies.rectangle(width / 2, height, width, 100, { isStatic: true })

    Matter.World.add(world, [player, floor])

    return {
      physics: { engine, world },
      player: { body: player, size: [50, 50], renderer: Player },
      floor: { body: floor, size: [width, 100], renderer: Floor },
    }
  }

  const onEvent = (e) => {
    if (e.type === "game-over") {
      setRunning(false)
      gameEngine.current.stop()
      navigation.navigate("Home")
    } else if (e.type === "collect-item") {
      setScore(score + 10)
      // Remove collected item
      gameEngine.current.dispatch({ type: "remove-collectible", collectible: e.collectible })
    }
  }

  const reset = () => {
    gameEngine.current.swap(setupWorld())
    setRunning(true)
    setScore(0)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <GameEngine
        ref={gameEngine}
        style={styles.gameContainer}
        systems={[Physics]}
        entities={setupWorld()}
        onEvent={onEvent}
        running={running}
      >
        <StatusBar hidden={true} />
      </GameEngine>
      <TouchableWithoutFeedback onPress={reset}>
        <View style={styles.fullScreenButton}>
          {!running && (
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <Text style={styles.gameOverSubText}>Tap to Play Again</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gameContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  score: {
    position: "absolute",
    top: 50,
    left: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  fullScreenButton: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  fullScreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  gameOverSubText: {
    color: "white",
    fontSize: 24,
  },
})

