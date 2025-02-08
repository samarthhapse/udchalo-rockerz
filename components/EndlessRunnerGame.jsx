import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";

// Importing assets
import soldierImg from "../assets/images/soldier.png";
import cloudImg from "../assets/images/obstacle.png"; // Renamed obstacle to cloud
import backgroundImg from "../assets/images/background.png";
import barbedWireImg from "../assets/images/barbed_wire.png";

// Fixed heights for obstacles
const CLOUD_HEIGHT = 250; // X height
const BARBED_WIRE_HEIGHT = 350; // 2X height

// Setup physics world
const setupWorld = () => {
  let engine = Matter.Engine.create({ enableSleeping: false });
  let world = engine.world;

  let player = Matter.Bodies.rectangle(80, 300, 50, 50, { label: "player", restitution: 0.3 });
  let ground = Matter.Bodies.rectangle(200, 400, 400, 20, { isStatic: true });

  let cloud = Matter.Bodies.rectangle(600, CLOUD_HEIGHT, 40, 40, { label: "cloud", isStatic: false });
  let barbedWire = Matter.Bodies.rectangle(800, BARBED_WIRE_HEIGHT, 80, 10, { label: "barbedWire", isStatic: false });

  Matter.World.add(world, [player, ground, cloud, barbedWire]);

  return {
    physics: { engine, world },
    player: { body: player, renderer: Player },
    ground: { body: ground, renderer: Ground },
    cloud: { body: cloud, renderer: Cloud },
    barbedWire: { body: barbedWire, renderer: BarbedWire },
  };
};

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

// Cloud Obstacle
const Cloud = ({ body }) => {
  const { position } = body;
  return <Image source={cloudImg} style={[styles.cloud, { left: position.x - 20, top: position.y - 20 }]} />;
};

// Barbed Wire Obstacle
const BarbedWire = ({ body }) => {
  const { position } = body;
  return <Image source={barbedWireImg} style={[styles.barbedWire, { left: position.x - 40, top: position.y - 5 }]} />;
};

// Game Loop
const GameLoop = (entities, { events, dispatch }) => {
  let engine = entities.physics.engine;
  let player = entities.player.body;
  let cloud = entities.cloud.body;
  let barbedWire = entities.barbedWire.body;

  // Move obstacles left
  Matter.Body.setVelocity(cloud, { x: -5, y: 0 });
  Matter.Body.setVelocity(barbedWire, { x: -4, y: 0 });

  // Ensure obstacles always spawn at the correct height
  if (cloud.position.x < -20) {
    setTimeout(() => {
      Matter.Body.setPosition(cloud, { x: 600, y: CLOUD_HEIGHT });
    }, 4000); // Increased delay
  }

  if (barbedWire.position.x < -20) {
    setTimeout(() => {
      Matter.Body.setPosition(barbedWire, { x: 600, y: BARBED_WIRE_HEIGHT });
    }, 8000); // Extra delay to alternate
  }

  // Handle Jump
  events.forEach((event) => {
    if (event.type === "jump" && player.position.y >= 300) {
      Matter.Body.setVelocity(player, { x: 0, y: -12 });
    }
  });

  // Handle Crouch
  events.forEach((event) => {
    if (event.type === "crouch") {
      Matter.Body.scale(player, 1, 0.5);
      setTimeout(() => {
        Matter.Body.scale(player, 1, 2);
      }, 1000);
    }
  });

  // Collision Detection
  let collisionWithCloud = Matter.Collision.collides(player, cloud);
  let collisionWithBarbedWire = Matter.Collision.collides(player, barbedWire);

  if (collisionWithCloud || collisionWithBarbedWire) {
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

  const handleEvent = (event) => {
    if (event.type === "game_over") {
      setRunning(false);
    } else if (event.type === "increase_score") {
      setScore((prev) => prev + 1);
    }
  };

  const restartGame = () => {
    setRunning(true);
    setScore(0);
    setGameKey((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
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

      {/* Crouch Button */}
      {running && (
        <TouchableOpacity style={styles.crouchButton} onPress={() => gameEngineRef.current.dispatch({ type: "crouch" })}>
          <Text style={styles.buttonText}>Crouch</Text>
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
  backButton: { position: "absolute", top: 40, left: 20, backgroundColor: "red", padding: 10, borderRadius: 5 },
  jumpButton: { position: "absolute", bottom: 50, left: "30%", backgroundColor: "blue", padding: 15, borderRadius: 10 },
  crouchButton: { position: "absolute", bottom: 50, left: "60%", backgroundColor: "purple", padding: 15, borderRadius: 10 },
  restartButton: { position: "absolute", bottom: 50, left: "45%", backgroundColor: "green", padding: 15, borderRadius: 10 },
  buttonText: { color: "white", fontSize: 16, textAlign: "center" },
  player: { width: 50, height: 50, position: "absolute", resizeMode: "contain" },
  ground: { width: 400, height: 20, backgroundColor: "green", position: "absolute" },
  cloud: { width: 40, height: 40, position: "absolute", resizeMode: "contain" },
  barbedWire: { width: 80, height: 10, position: "absolute", resizeMode: "contain" },
  scoreText: { position: "absolute", top: 20, right: 20, fontSize: 20, color: "black", fontWeight: "bold" },
});

export default EndlessRunnerGame;