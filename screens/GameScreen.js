import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import Modal from 'react-native-modal';

const GameScreen = ({ navigation, route }) => {
  const [diceFace1, setDiceFace1] = useState(null);
  const [diceFace2, setDiceFace2] = useState(null);
  const [score, setScore] = useState('');
  const [isRolled, setIsRolled] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isWinner, setIsWinner] = useState(false);
  const [isOutOfAttempts, setIsOutOfAttempts] = useState(false); // New state to handle out of attempts

  const diceAnimation = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(new Audio.Sound());
  const winSoundRef = useRef(new Audio.Sound());
  const loseSoundRef = useRef(new Audio.Sound());

  const { width } = Dimensions.get('window');
  const MAX_ATTEMPTS = 12; // Define the maximum number of attempts

  const { email } = route.params;

  useEffect(() => {
    const loadSounds = async () => {
      try {
        await soundRef.current.loadAsync(require('../assets/sound.mp3'));
        await winSoundRef.current.loadAsync(require('../assets/clap.mp3'));
        await loseSoundRef.current.loadAsync(require('../assets/laugh.mp3'));
      } catch (error) {
        console.log('Error loading sound:', error);
      }
    };
    loadSounds();
    return () => {
      soundRef.current.unloadAsync();
      winSoundRef.current.unloadAsync();
    };
  }, []);

  const playSound = async () => {
    try {
      await soundRef.current.replayAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const playWinSound = async () => {
    try {
      await winSoundRef.current.replayAsync();
    } catch (error) {
      console.log('Error playing win sound:', error);
    }
  };

  const sendRewardEmail = async (userEmail) => {
    const rewardURL = `http://api.rslhulls.online/v1/marketting/collect-reward`;

    fetch(rewardURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer 123',  // Use your actual Bearer token here
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
      }),
    })
    .then(response => {
      console.log('Raw response:', response);
      return response.json();
    })
    .then(data => {
      console.log('Reward email sent:', data);
    })
      .catch(error => {
        console.error('Error sending reward email:', error);
      });
  };
  const playLoseSound = async () => {
    try {
      await loseSoundRef.current.replayAsync();
    } catch (error) {
      console.log('Error playing lose sound:', error);
    }
  };

  const rollDice = () => {
    playSound();
    setIsRolling(true);
    Animated.sequence([
      Animated.timing(diceAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(diceAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const randomDiceFace1 = Math.random() < 0.15 ? 6 : Math.floor(Math.random() * 6) + 1;
      const randomDiceFace2 = Math.random() < 0.15 ? 6 : Math.floor(Math.random() * 6) + 1;

      setDiceFace1(randomDiceFace1);
      setDiceFace2(randomDiceFace2);
      setScore(randomDiceFace1 + randomDiceFace2);
      setIsRolled(true);
      setIsRolling(false);
      setAttempts(attempts + 1);

      if (randomDiceFace1 === 6 && randomDiceFace2 === 6) {
        playWinSound();
        setIsWinner(true);
        sendRewardEmail(email);
      } else if (attempts + 1 === MAX_ATTEMPTS) {
        playLoseSound();  
        setIsOutOfAttempts(true); // Show out of attempts modal
      }
    });
  };

  const getDiceImage = (diceFace) => {
    switch (diceFace) {
      case 1: return require('../assets/dice1.png');
      case 2: return require('../assets/dice2.png');
      case 3: return require('../assets/dice3.png');
      case 4: return require('../assets/dice4.png');
      case 5: return require('../assets/dice5.png');
      case 6: return require('../assets/dice6.png');
      default: return require('../assets/startDice.png');
    }
  };

  const resetGame = () => {
    setScore('');
    setIsRolled(false);
    setDiceFace1(null);
    setDiceFace2(null);
    setAttempts(0);
    setIsWinner(false);
    setIsOutOfAttempts(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backbtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={[styles.title, { fontSize: width * 0.06 }]}>To win, you must score a double 6 (12 Attempts)</Text>

      <View style={styles.diceContainer}>
        <Animated.View style={{ transform: [{ rotate: diceAnimation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
          <Image source={getDiceImage(diceFace1)} style={[styles.diceImage, { width: width * 0.25, height: width * 0.25 }]} />
        </Animated.View>
        <Animated.View style={{ transform: [{ rotate: diceAnimation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
          <Image source={getDiceImage(diceFace2)} style={[styles.diceImage, { width: width * 0.25, height: width * 0.25 }]} />
        </Animated.View>
      </View>
      <View style={{ height: 1, width: '100%', backgroundColor: 'white', marginBottom: 30 }} />

      <TouchableOpacity style={styles.button} onPress={rollDice} disabled={isRolling}>
        <Text style={styles.buttonText}>{isRolling ? 'Rolling...' : 'Roll Dice'}</Text>
      </TouchableOpacity>

      <View style={styles.score}>
        <Text style={styles.scoreText}>
          {isRolled ? `Score: ${score}` : ''}
        </Text>
        <Text style={styles.scoreText}>
          {isRolled ? `Attempts: ${attempts}` : ''}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.resetButton]}
        onPress={resetGame}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>

      {/* Winner Modal */}
      {/* Winner Modal */}
<Modal isVisible={isWinner}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Congratulations!</Text>
      <Text style={styles.modalText}>You won with double sixes!</Text>
      <Text style={styles.modalText}>Your winning code has been sent to your Email</Text>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={async () => {
          await winSoundRef.current.stopAsync();  // Stop the win sound
          setIsWinner(false);
          navigation.goBack();  // Navigate to the previous screen
        }}
      >
        <Text style={styles.modalButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* Out of Attempts Modal */}
<Modal isVisible={isOutOfAttempts}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Sorry!</Text>
      <Text style={styles.modalText}>You have used all your attempts. Better luck next time!</Text>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={async () => {
          await loseSoundRef.current.stopAsync();  // Stop the lose sound
          resetGame();
          navigation.goBack();  // Navigate to the previous screen
        }}
      >
        <Text style={styles.modalButtonText}>Okay</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000066',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 100,
  },
  diceContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  diceImage: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#ff6666',
  },
  buttonText: {
    fontSize: 18,
    color: '#000066',
    fontWeight: 'bold',
  },
  scoreText: {
    color: 'white',
    fontSize: 24,
    marginTop: 20,
  },
  backbtn: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 60,
  },
  score: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#000066',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
