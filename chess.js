// Full Chess Web App Code with Firebase Authentication, Multiplayer, and AI Support

// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Sign Up Function
const signUp = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed up:", userCredential.user);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error("Error signing up:", error);
    });
};

// Sign In Function
const signIn = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed in:", userCredential.user);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error("Error signing in:", error);
    });
};

// Multiplayer Chess Game Setup
const createGame = async () => {
  const gameRef = await addDoc(collection(db, "games"), {
    board: Array(64).fill(null),
    turn: "white",
    players: {},
  });
  window.location.href = `game.html?gameId=${gameRef.id}`;
};

const joinGame = async (gameId, playerColor) => {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);

  if (gameSnap.exists()) {
    const gameData = gameSnap.data();
    gameData.players[playerColor] = auth.currentUser.uid;
    await setDoc(gameRef, gameData);
  }
};

const listenForGameUpdates = (gameId, updateCallback) => {
  onSnapshot(doc(db, "games", gameId), (docSnap) => {
    if (docSnap.exists()) {
      updateCallback(docSnap.data());
    }
  });
};

// AI Chess Game Setup using Stockfish
const stockfish = new Worker("stockfish.js");

const playWithAI = (fenPosition) => {
  return new Promise((resolve) => {
    stockfish.postMessage(`position fen ${fenPosition}`);
    stockfish.postMessage("go depth 15");
    stockfish.onmessage = (event) => {
      if (event.data.includes("bestmove")) {
        const bestMove = event.data.split(" ")[1];
        resolve(bestMove);
      }
    };
  });
};

export { signUp, signIn, createGame, joinGame, listenForGameUpdates, playWithAI };

// UI Elements for Login and Dashboard
const setupUI = () => {
    document.getElementById("signup-btn").addEventListener("click", () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      signUp(email, password);
    });
  
    document.getElementById("signin-btn").addEventListener("click", () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      signIn(email, password);
    });
  
    document.getElementById("play-ai").addEventListener("click", () => {
      window.location.href = "game-ai.html";
    });
  
    document.getElementById("play-multiplayer").addEventListener("click", () => {
      createGame();
    });
  };
  
  document.addEventListener("DOMContentLoaded", setupUI);
  
  export { signUp, signIn, createGame, joinGame, listenForGameUpdates, playWithAI };