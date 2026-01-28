// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { setDoc, collection, Firestore, getFirestore, serverTimestamp } from "firebase/firestore";
//@ts-ignore this is a temporary fix for the error
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_APIKEY,
  authDomain: process.env.EXPO_PUBLIC_authDomain,
  projectId: process.env.EXPO_PUBLIC_projectId,
  storageBucket: process.env.EXPO_PUBLIC_storageBucket,
  messagingSenderId: process.env.EXPO_PUBLIC_messagingSenderId,
  appId: process.env.EXPO_PUBLIC_appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore: Firestore = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: [getReactNativePersistence(AsyncStorage)]
});

const USERINFO: string = 'userinfo'

export {auth, firestore, collection, setDoc, USERINFO, serverTimestamp}