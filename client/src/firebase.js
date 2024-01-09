// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-marketplace-55505.firebaseapp.com",
  projectId: "real-estate-marketplace-55505",
  storageBucket: "real-estate-marketplace-55505.appspot.com",
  messagingSenderId: "490007877356",
  appId: "1:490007877356:web:356da40fac7d570247f7c9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);