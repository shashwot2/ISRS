// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAjTG0xARrniddoWuHx5guu5vkswDf9bM",
  authDomain: "miro-manics.firebaseapp.com",
  projectId: "miro-manics",
  storageBucket: "miro-manics.appspot.com",
  messagingSenderId: "95347337203",
  appId: "1:95347337203:web:21d8af572f130c722b5486",
  measurementId: "G-C2JX5DQD59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
