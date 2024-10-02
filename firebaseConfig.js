// Import the necessary Firebase services
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsQQMHh0dcXdZXfjE0H_Fcp60pZBBG_S8",
  authDomain: "rodnav-dice-game.firebaseapp.com",
  projectId: "rodnav-dice-game",
  storageBucket: "rodnav-dice-game.appspot.com",
  messagingSenderId: "637437586800",
  appId: "1:637437586800:web:5d041f703d5257bd88b3b5",
  databaseURL: "https://rodnav-dice-game-default-rtdb.firebaseio.com/" // Add this line
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Realtime Database and export
const database = getDatabase(app);
export { database };
