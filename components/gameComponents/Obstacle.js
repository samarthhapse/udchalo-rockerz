import { View, Image } from "react-native"

const Obstacle = (props) => {
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
      }}
    >
      <Image
        source={require("../../assets/images/obstacle.png")}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
      />
    </View>
  )
}

export default Obstacle

