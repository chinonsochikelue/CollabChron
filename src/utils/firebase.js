// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "collaboration-chronolgy.firebaseapp.com",
  projectId: "collaboration-chronolgy",
  storageBucket: "collaboration-chronolgy.appspot.com",
  messagingSenderId: "562982459298",
  appId: "1:562982459298:web:a39af360b5dee56bc004fb",
  measurementId: "G-Y6CVQK5CVZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);