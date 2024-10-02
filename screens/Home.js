import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Image, TextInput, Keyboard, TouchableWithoutFeedback, Alert, Dimensions } from "react-native";
import PrimaryButton from "../component/PrimaryButton";
import { useFocusEffect } from "@react-navigation/native"; // Import the hook
import { database } from "../firebaseConfig";  // Import your Firebase config
import { ref, set } from "firebase/database";  // Firebase Realtime Database methods

const Home = ({ navigation }) => {
  // State to hold name and email input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Get screen dimensions for responsive design
  const { width, height } = Dimensions.get("window");

  // useFocusEffect hook to clear fields when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setName("");  // Clear the name field
      setEmail(""); // Clear the email field
    }, [])
  );

  // Function to register user in Firebase and subscribe to mailing list
  const registerUser = () => {
    // Basic validation to ensure both fields are filled
    if (!name.trim() || !email.trim()) {
      Alert.alert("Sorry!", "Please enter both name and email.");
      return;
    }

    // Create a unique key for each user (using Date.now as an example)
    const userRef = ref(database, 'users/' + Date.now());

    // Store user data in Firebase
    set(userRef, {
      name: name,
      email: email
    })
    .then(() => {

      
      const emailSubscriptionURL = `https://users.go-mailer.com/api/contacts`;

      fetch(emailSubscriptionURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer Um9kbmF2LTgzMzgwMzIxMDc2MS44ODczLTM5OQ==', 
        },
        body: JSON.stringify({
          email: email,
          firstname: name,
          lists: [1727355430642],  
        }),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            console.log('Error response:', err);
            throw new Error('Failed to subscribe to email list');
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Successfully subscribed to the email list:', data);
      })
      .catch(error => {
        console.error('Error subscribing to email list:', error);
      });

      // Second API call: Send email notification
      const notifyURL = `http://api.rslhulls.online/v1/marketting/join-waitlist`;

      fetch(notifyURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: name,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Notification sent:', data);
      })
      .catch(error => {
        console.error('Error sending notification:', error);
      });

      // Navigate to GameScreen after registration and API calls
      navigation.navigate('GameScreen', { email: email });

    })
    .catch((error) => {
      Alert.alert("Error", "Failed to register user: " + error.message);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { paddingHorizontal: width * 0.05 }]}>
        <Image
          source={require("../assets/gamepics.png")}
          style={[styles.image, { width: width * 0.5, height: height * 0.2 }]}  // Responsive image size
          resizeMode="contain"
        />
        <Text style={[styles.primaryText, { fontSize: width * 0.06 }]}>
          Rodnav Rush: Win Vouchers, Ride Free!
        </Text>
        <View style={[styles.inputView, { width: width * 0.92 }]}>
          <Text style={{ marginBottom: 10, color: "white" }}>
            Join the Waiting List to begin!
          </Text>
          <TextInput 
            style={[styles.input, { height: height * 0.05 }]}  // Responsive input field size
            placeholder="Enter your Name"
            value={name}                  // Bind name state to input
            onChangeText={(text) => setName(text)}   // Update name state
          />
          <TextInput
            style={[styles.input, { height: height * 0.05 }]}  // Responsive input field size
            placeholder="Enter your Email Address"
            keyboardType="email-address"
            value={email}                 // Bind email state to input
            onChangeText={(text) => setEmail(text)}  // Update email state
          />
        </View>
        <PrimaryButton 
          text="Get Started" 
          onPress={registerUser}  // Register user and subscribe to mailing list on button press
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000066",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 40,
  },
  image: {
    marginBottom: 20,
  },
  inputView: {
    marginBottom: 40,
  },
  input: {
    backgroundColor: "white",
    marginBottom: 10,
    width: "100%",
    padding: 10,
  },
});
