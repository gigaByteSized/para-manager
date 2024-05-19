// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import firebase from "firebase/compat/app";
// Required for side-effects
import "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOrA-XzLXMtHc7osvMqBdvqUI20rPmE6k",
  authDomain: "para-cfd13.firebaseapp.com",
  projectId: "para-cfd13",
  storageBucket: "para-cfd13.appspot.com",
  messagingSenderId: "320809981779",
  appId: "1:320809981779:web:f405fe553c85f5f41633a6",
  measurementId: "G-G6ECFWT21Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);