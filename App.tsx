import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import EndlessRunnerGame from "./components/EndlessRunnerGame";
import { useNavigation } from "@react-navigation/native"; 

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Udchalo</Text>
      <Text style={styles.info}>
        UdChalo is a travel agency specializing in flights for defense personnel, providing affordable travel options with seamless booking experiences.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("GameSelection") }>
        <Text style={styles.buttonText}>Play Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const GameSelectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Theme</Text>
      <TouchableOpacity style={styles.themeButton} onPress={() => navigation.navigate("AvatarCustomization", { theme: "Army" })}>
        <Text style={styles.themeText}>Army</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.themeButton} onPress={() => navigation.navigate("AvatarCustomization", { theme: "Navy" })}>
        <Text style={styles.themeText}>Navy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.themeButton} onPress={() => navigation.navigate("AvatarCustomization", { theme: "Air-Force" })}>
        <Text style={styles.themeText}>Air-Force</Text>
      </TouchableOpacity>
    </View>
  );
};

const AvatarCustomizationScreen = ({ route }) => {
  const navigation = useNavigation(); 
  const { theme } = route.params;
  const [helmet, setHelmet] = useState(false);
  const [bag, setBag] = useState(false);
  const [shoes, setShoes] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{theme} Avatar Customization</Text>
      <Image source={require("./assets/images/soldier.png")} style={styles.avatar} />
      {helmet && <Image source={require("./assets/images/helmet.png")} style={styles.helmet} />}
      {bag && <Image source={require("./assets/images/bag.png")} style={styles.bag} />}
      {shoes && <Image source={require("./assets/images/shoes.png")} style={styles.shoes} />}
      
      <View style={styles.customizationContainer}>
        <TouchableOpacity style={styles.customButton} onPress={() => setHelmet(!helmet)}>
          <Text style={styles.customText}>Helmet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.customButton} onPress={() => setBag(!bag)}>
          <Text style={styles.customText}>Bag</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.customButton} onPress={() => setShoes(!shoes)}>
          <Text style={styles.customText}>Shoes</Text>
        </TouchableOpacity>
      </View>
      
      {/* <TouchableOpacity style={styles.startButton}>
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity> */}
     <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate("EndlessRunnerGame")}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>

    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GameSelection" component={GameSelectionScreen} options={{ title: "Select Theme" }} />
        <Stack.Screen name="AvatarCustomization" component={AvatarCustomizationScreen} options={{ title: "Customize Avatar" }} />
        <Stack.Screen name="EndlessRunnerGame" component={EndlessRunnerGame} options={{ title: "Endless Runner" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  info: { fontSize: 16, textAlign: "center", marginBottom: 30 },
  button: { backgroundColor: "blue", padding: 15, borderRadius: 10 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  themeButton: { backgroundColor: "#008080", padding: 15, marginVertical: 10, borderRadius: 8, width: "80%", alignItems: "center" },
  themeText: { color: "white", fontSize: 18, fontWeight: "bold" },
  customizationContainer: { flexDirection: "row", marginVertical: 20 },
  customButton: { backgroundColor: "#555", padding: 10, marginHorizontal: 5, borderRadius: 5 },
  customText: { color: "white", fontSize: 16 },
  startButton: { backgroundColor: "green", padding: 15, borderRadius: 10, marginTop: 20 },
  // avatar: { width: 150, height: 250, marginBottom: 20 },
  // helmet: { position: "absolute", top: 100, width: 60, height: 60 },
  // bag: { position: "absolute", top: 150, width: 80, height: 100 },
  // shoes: { position: "absolute", bottom: 50, width: 80, height: 50 },
  avatar: { 
    width: 150, 
    height: 250, 
    marginBottom: 20 
  },
  helmet: { 
    position: "absolute", 
    top: 50,  // Adjusted for head position
    left: "50%", 
    transform: [{ translateX: -40 }], // Centering on head
    width: 80, 
    height: 60, 
    zIndex: 2
  },
  bag: { 
    position: "absolute", 
    top: 140, // Adjusted for back
    left: "50%",
    transform: [{ translateX: -45 }], // Centering on back
    width: 90, 
    height: 120, 
    zIndex: 1 
  },
  shoes: { 
    position: "absolute", 
    bottom: 20, // Adjusted for feet
    left: "50%",
    transform: [{ translateX: -40 }], 
    width: 80, 
    height: 50, 
    zIndex: 2 
  }
});