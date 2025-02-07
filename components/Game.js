"use client"

import { useRef, useEffect } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { GameEngine } from "react-native-game-engine"
import Matter from "matter-js"

const { width, height } = Dimensions.get("window")

const Physics = (entities, { time }) => {
  const engine = entities.physics.engine
  Matter.Engine.update(engine, time.delta)
  return entities
}

export default function Game() {
  const gameEngineRef = useRef(null)

  useEffect(() => {
    // Set up the game world
    const engine = Matter.Engine.create({ enableSleeping: false })
    const world = engine.world

    // Create the player
    const player = Matter.Bodies.rectangle(50, height - 100, 50, 50)
    Matter.World.add(world, player)

    // Create the floor
    const floor = Matter.Bodies.rectangle(width / 2, height, width, 100, { isStatic: true })
    Matter.World.add(world, floor)

    // Set up the initial game state
    const entities = {
      physics: { engine, world },
      player: { body: player, size: [50, 50], color: "red", renderer: Box },
      floor: { body: floor, size: [width, 100], color: "green", renderer: Box },
    }

    if (gameEngineRef.current) {
      gameEngineRef.current.swap(entities)
    }

    return () => {
      // Clean up Matter.js engine
      Matter.Engine.clear(engine)
    }
  }, [])

  return <GameEngine ref={gameEngineRef} style={styles.container} systems={[Physics]} entities={{}} />
}

const Box = (props) => {
  const width = props.size[0]
  const height = props.size[1]
  const x = props.body.position.x - width / 2
  const y = props.body.position.y - height / 2

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: props.color,
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
})

