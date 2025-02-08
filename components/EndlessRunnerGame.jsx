// //******************************* */
// import React, { useEffect, useState, useRef } from "react";
// import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
// import { GameEngine } from "react-native-game-engine";
// import Matter from "matter-js";

// // Importing assets
// import soldierImg from "../assets/images/soldier.png";
// import obstacleImg from "../assets/images/obstacle.png";
// import backgroundImg from "../assets/images/background.png";

// // Setup physics world
// const setupWorld = () => {
//   let engine = Matter.Engine.create({ enableSleeping: false });
//   let world = engine.world;

//   let player = Matter.Bodies.rectangle(80, 300, 50, 50, { label: "player", restitution: 0.3 });
//   let ground = Matter.Bodies.rectangle(200, 400, 400, 20, { isStatic: true });
//   let obstacle = Matter.Bodies.rectangle(400, 385, 40, 40, { label: "obstacle" });

//   Matter.World.add(world, [player, ground, obstacle]);

//   return {
//     physics: { engine, world },
//     player: { body: player, renderer: Player },
//     ground: { body: ground, renderer: Ground },
//     obstacle: { body: obstacle, renderer: Obstacle },
//   };
// };

// // Background Component
// const Background = () => <Image source={backgroundImg} style={styles.background} />;

// // Player Component
// const Player = ({ body }) => {
//   const { position } = body;
//   return <Image source={soldierImg} style={[styles.player, { left: position.x - 25, top: position.y - 25 }]} />;
// };

// // Ground Component
// const Ground = ({ body }) => {
//   const { position } = body;
//   return <View style={[styles.ground, { left: position.x - 200, top: position.y - 10 }]} />;
// };

// // Obstacle Component
// const Obstacle = ({ body }) => {
//   const { position } = body;
//   return <Image source={obstacleImg} style={[styles.obstacle, { left: position.x - 20, top: position.y - 20 }]} />;
// };

// // Game Loop
// const GameLoop = (entities, { touches, events, dispatch }) => {
//   let engine = entities.physics.engine;
//   let player = entities.player.body;
//   let obstacle = entities.obstacle.body;

//   // Move obstacle left continuously
//   Matter.Body.setVelocity(obstacle, { x: -2, y: 0 });

//   // Reset obstacle when off-screen
//   if (obstacle.position.x < -20) {
//     Matter.Body.setPosition(obstacle, { x: 400, y: 370 });
//     dispatch({ type: "increase_score" });
//   }

//   // Handle Jump using events
//   events.forEach((event) => {
//     if (event.type === "jump" && player.position.y >= 300) {
//       Matter.Body.setVelocity(player, { x: 0, y: -12 }); // Slightly reduced jump height
//     }
//   });

//   // Collision Detection
//   let collision = Matter.Collision.collides(player, obstacle);
//   if (collision) {
//     dispatch({ type: "game_over" });
//   }

//   Matter.Engine.update(engine);
//   return entities;
// };

// // Main Game Component
// const EndlessRunnerGame = ({ navigation }) => {
//   const [running, setRunning] = useState(true);
//   const [score, setScore] = useState(0);
//   const [gameKey, setGameKey] = useState(0); // Force re-render on restart
//   const gameEngineRef = useRef(null); // Ref to access game engine

//   const handleEvent = (event) => {
//     if (event.type === "game_over") {
//       setRunning(false);
//     } else if (event.type === "increase_score") {
//       setScore((prev) => prev + 5);
//     }
//   };

//   const restartGame = () => {
//     setRunning(true);
//     setScore(0);
//     setGameKey((prev) => prev + 1); // Re-render game engine
//   };

//   return (
//     <View style={styles.container}>
//       <Background />

//       <GameEngine
//         ref={gameEngineRef}
//         key={gameKey}
//         style={styles.gameContainer}
//         systems={[GameLoop]}
//         entities={setupWorld()}
//         running={running}
//         onEvent={handleEvent}
//       />

//       {/* Score Counter */}
//       <Text style={styles.scoreText}>Score: {score}</Text>

//       {/* Jump Button */}
//       {running && (
//         <TouchableOpacity style={styles.jumpButton} onPress={() => gameEngineRef.current.dispatch({ type: "jump" })}>
//           <Text style={styles.buttonText}>Jump</Text>
//         </TouchableOpacity>
//       )}

//       {/* Restart Button */}
//       {!running && (
//         <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
//           <Text style={styles.buttonText}>Restart</Text>
//         </TouchableOpacity>
//       )}

//       {/* Back Button */}
//       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//         <Text style={styles.buttonText}>Back</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#add8e6" },
//   gameContainer: { flex: 1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
//   background: { position: "absolute", width: "100%", height: "100%" },
//   backButton: {
//     position: "absolute",
//     top: 40,
//     left: 20,
//     backgroundColor: "red",
//     padding: 10,
//     borderRadius: 5,
//   },
//   jumpButton: {
//     position: "absolute",
//     bottom: 50,
//     left: "40%",
//     backgroundColor: "blue",
//     padding: 15,
//     borderRadius: 10,
//   },
//   restartButton: {
//     position: "absolute",
//     bottom: 50,
//     left: "40%",
//     backgroundColor: "green",
//     padding: 15,
//     borderRadius: 10,
//   },
//   buttonText: { color: "white", fontSize: 16, textAlign: "center" },
//   player: { width: 50, height: 50, position: "absolute", resizeMode: "contain" },
//   ground: { width: 400, height: 20, backgroundColor: "green", position: "absolute" },
//   obstacle: { width: 40, height: 40, position: "absolute", resizeMode: "contain" },
//   scoreText: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//     fontSize: 20,
//     color: "black",
//     fontWeight: "bold",
//   },
// });

// export default EndlessRunnerGame;







import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Audio } from "expo-av"; // Importing expo-av for sound

// Importing assets
import soldierImg from "../assets/images/soldier.png";
import obstacleImg from "../assets/images/obstacle.png";
import backgroundImg from "../assets/images/background.png";
import scoreSoundFile from "../assets/sounds/score.mp3"; // Score sound
import gameOverSoundFile from "../assets/sounds/gameOver.mp3"; // Game over sound

// Setup physics world
const setupWorld = () => {
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;

  let player = Matter.Bodies.rectangle(80, 300, 50, 50, { label: "player", restitution: 0.3 });
  let ground = Matter.Bodies.rectangle(200, 400, 400, 20, { isStatic: true });
  let obstacle = Matter.Bodies.rectangle(400, 385, 40, 40, { label: "obstacle" });

  Matter.World.add(world, [player, ground, obstacle]);

  return {
    physics: { engine, world },
    player: { body: player, renderer: Player },
    ground: { body: ground, renderer: Ground },
    obstacle: { body: obstacle, renderer: Obstacle },
  };
};

// Function to play sound
const playSound = async (soundFile) => {
  const { sound } = await Audio.Sound.createAsync(soundFile);
  await sound.playAsync();
};

// Background Component
const Background = () => <Image source={backgroundImg} style={styles.background} />;

// Player Component
const Player = ({ body }) => {
  const { position } = body;
  return <Image source={soldierImg} style={[styles.player, { left: position.x - 25, top: position.y - 25 }]} />;
};

// Ground Component
const Ground = ({ body }) => {
  const { position } = body;
  return <View style={[styles.ground, { left: position.x - 200, top: position.y - 10 }]} />;
};

// Obstacle Component
const Obstacle = ({ body }) => {
  const { position } = body;
  return <Image source={obstacleImg} style={[styles.obstacle, { left: position.x - 20, top: position.y - 20 }]} />;
};

// Game Loop
const GameLoop = (entities, { touches, events, dispatch }) => {
  let engine = entities.physics.engine;
  let player = entities.player.body;
  let obstacle = entities.obstacle.body;

  // Move obstacle left continuously
  Matter.Body.setVelocity(obstacle, { x: -2, y: 0 });

  // Reset obstacle when off-screen
  if (obstacle.position.x < -20) {
    Matter.Body.setPosition(obstacle, { x: 400, y: 370 });
    dispatch({ type: "increase_score" });
  }

  // Handle Jump using events
  events.forEach((event) => {
    if (event.type === "jump" && player.position.y >= 300) {
      Matter.Body.setVelocity(player, { x: 0, y: -12 });
    }
  });

  // Collision Detection
  let collision = Matter.Collision.collides(player, obstacle);
  if (collision) {
    dispatch({ type: "game_over" });
  }

  Matter.Engine.update(engine);
  return entities;
};

// Main Game Component
const EndlessRunnerGame = ({ navigation }) => {
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const gameEngineRef = useRef(null);

  const handleEvent = async (event) => {
    if (event.type === "game_over") {
      await playSound(gameOverSoundFile); // Play game over sound
      setRunning(false);
    } else if (event.type === "increase_score") {
      await playSound(scoreSoundFile); // Play score sound
      setScore((prev) => prev + 5);
    }
  };

  const restartGame = () => {
    setRunning(true);
    setScore(0);
    setGameKey((prev) => prev + 1); // Re-render game engine
  };

  return (
    <View style={styles.container}>
      <Background />

      <GameEngine
        ref={gameEngineRef}
        key={gameKey}
        style={styles.gameContainer}
        systems={[GameLoop]}
        entities={setupWorld()}
        running={running}
        onEvent={handleEvent}
      />

      {/* Score Counter */}
      <Text style={styles.scoreText}>Score: {score}</Text>

      {/* Jump Button */}
      {running && (
        <TouchableOpacity style={styles.jumpButton} onPress={() => gameEngineRef.current.dispatch({ type: "jump" })}>
          <Text style={styles.buttonText}>Jump</Text>
        </TouchableOpacity>
      )}

      {/* Restart Button */}
      {!running && (
        <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
      )}

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#add8e6" },
  gameContainer: { flex: 1, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  background: { position: "absolute", width: "100%", height: "100%" },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  jumpButton: {
    position: "absolute",
    bottom: 50,
    left: "40%",
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
  },
  restartButton: {
    position: "absolute",
    bottom: 50,
    left: "40%",
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: { color: "white", fontSize: 16, textAlign: "center" },
  player: { width: 50, height: 50, position: "absolute", resizeMode: "contain" },
  ground: { width: 400, height: 20, backgroundColor: "green", position: "absolute" },
  obstacle: { width: 40, height: 40, position: "absolute", resizeMode: "contain" },
  scoreText: {
    position: "absolute",
    top: 20,
    right: 20,
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
});

export default EndlessRunnerGame;