// "use client"

// import { useRef, useState, useEffect } from "react"
// import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, StatusBar } from "react-native"
// import { GameEngine } from "react-native-game-engine"
// import Matter from "matter-js"
// import { Audio } from "expo-av"
// import Player from "./gameComponents/Player"
// import Floor from "./gameComponents/Floor"

// const { width, height } = Dimensions.get("window")

// const Physics = (entities, { time, dispatch }) => {
//   const engine = entities.physics.engine
//   Matter.Engine.update(engine, time.delta)

//   const player = entities.player.body
//   const obstacles = Object.keys(entities).filter((key) => key.startsWith("obstacle"))
//   const collectibles = Object.keys(entities).filter((key) => key.startsWith("collectible"))

//   // Check for collisions
//   obstacles.forEach((obstacleKey) => {
//     const obstacle = entities[obstacleKey].body
//     if (Matter.Collision.collides(player, obstacle)) {
//       dispatch({ type: "game-over" })
//     }
//   })

//   collectibles.forEach((collectibleKey) => {
//     const collectible = entities[collectibleKey].body
//     if (Matter.Collision.collides(player, collectible)) {
//       dispatch({ type: "collect-item", collectible: collectibleKey })
//     }
//   })

//   return entities
// }

// export default function GameScreen({ navigation }) {
//   const [running, setRunning] = useState(true)
//   const [score, setScore] = useState(0)
//   const gameEngine = useRef(null)
//   const [sound, setSound] = useState()

//   useEffect(() => {
//     setupAudio()
//     return () => {
//       if (sound) {
//         sound.unloadAsync()
//       }
//     }
//   }, [sound]) // Added sound to dependencies

//   const setupAudio = async () => {
//     const { sound } = await Audio.Sound.createAsync(require("../assets/sounds/game-music.mp3"), { isLooping: true })
//     setSound(sound)
//     await sound.playAsync()
//   }

//   const setupWorld = () => {
//     const engine = Matter.Engine.create({ enableSleeping: false })
//     const world = engine.world

//     const player = Matter.Bodies.rectangle(50, height - 100, 50, 50)
//     const floor = Matter.Bodies.rectangle(width / 2, height, width, 100, { isStatic: true })

//     Matter.World.add(world, [player, floor])

//     return {
//       physics: { engine, world },
//       player: { body: player, size: [50, 50], renderer: Player },
//       floor: { body: floor, size: [width, 100], renderer: Floor },
//     }
//   }

//   const onEvent = (e) => {
//     if (e.type === "game-over") {
//       setRunning(false)
//       gameEngine.current.stop()
//       navigation.navigate("Home")
//     } else if (e.type === "collect-item") {
//       setScore(score + 10)
//       // Remove collected item
//       gameEngine.current.dispatch({ type: "remove-collectible", collectible: e.collectible })
//     }
//   }

//   const reset = () => {
//     gameEngine.current.swap(setupWorld())
//     setRunning(true)
//     setScore(0)
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.score}>Score: {score}</Text>
//       <GameEngine
//         ref={gameEngine}
//         style={styles.gameContainer}
//         systems={[Physics]}
//         entities={setupWorld()}
//         onEvent={onEvent}
//         running={running}
//       >
//         <StatusBar hidden={true} />
//       </GameEngine>
//       <TouchableWithoutFeedback onPress={reset}>
//         <View style={styles.fullScreenButton}>
//           {!running && (
//             <View style={styles.fullScreen}>
//               <Text style={styles.gameOverText}>Game Over</Text>
//               <Text style={styles.gameOverSubText}>Tap to Play Again</Text>
//             </View>
//           )}
//         </View>
//       </TouchableWithoutFeedback>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   gameContainer: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   score: {
//     position: "absolute",
//     top: 50,
//     left: 20,
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   fullScreenButton: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flex: 1,
//   },
//   fullScreen: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: "black",
//     opacity: 0.8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   gameOverText: {
//     color: "white",
//     fontSize: 48,
//     fontWeight: "bold",
//   },
//   gameOverSubText: {
//     color: "white",
//     fontSize: 24,
//   },
// })

import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const GameScreen = () => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [obstacles, setObstacles] = useState([]);
  const [isJumping, setIsJumping] = useState(false);
  const [isCrouching, setIsCrouching] = useState(false);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      setScore((prevScore) => prevScore + 1);
      if (Math.random() < 0.2) {
        setObstacles((prev) => [...prev, getRandomObstacle()]);
      }
    }, 1000);

    return () => clearInterval(gameInterval);
  }, []);

  const getRandomObstacle = () => {
    const types = ["trench", "barbedWire", "bullet"];
    return { id: Date.now(), type: types[Math.floor(Math.random() * types.length)] };
  };

  const handleJump = () => {
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);
  };

  const handleCrouch = () => {
    setIsCrouching(true);
    setTimeout(() => setIsCrouching(false), 500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.health}>Health: {health}</Text>
      <View style={styles.gameArea}>
        <Image source={require("../assets/images/soldier.png")} style={[styles.avatar, isJumping && styles.jump, isCrouching && styles.crouch]} />
        {obstacles.map((obs) => (
          <View key={obs.id} style={[styles.obstacle, styles[obs.type]]} />
        ))}
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleJump} style={styles.button}>
          <Text style={styles.buttonText}>Jump</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCrouch} style={styles.button}>
          <Text style={styles.buttonText}>Crouch</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#eee" },
  score: { position: "absolute", top: 40, left: 20, fontSize: 18, fontWeight: "bold" },
  health: { position: "absolute", top: 70, left: 20, fontSize: 18, fontWeight: "bold", color: "red" },
  gameArea: { flex: 1, width: "100%", justifyContent: "flex-end", alignItems: "center", position: "relative" },
  avatar: { width: 80, height: 120 },
  jump: { transform: [{ translateY: -100 }] },
  crouch: { transform: [{ scaleY: 0.7 }] },
  controls: { flexDirection: "row", justifyContent: "space-around", width: "100%", padding: 20 },
  button: { backgroundColor: "blue", padding: 15, borderRadius: 10, margin: 10 },
  buttonText: { color: "white", fontWeight: "bold" },
  obstacle: { position: "absolute", bottom: 0, width: 50, height: 50, backgroundColor: "black" },
  trench: { backgroundColor: "brown", height: 30 },
  barbedWire: { backgroundColor: "gray", height: 40 },
  bullet: { backgroundColor: "red", width: 20, height: 10 },
});

export default GameScreen;