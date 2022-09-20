// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "next-twitter-clone-dbef5.firebaseapp.com",
  projectId: "next-twitter-clone-dbef5",
  storageBucket: "next-twitter-clone-dbef5.appspot.com",
  messagingSenderId: "339543074656",
  appId: "1:339543074656:web:831a0be9d8164c321f2005"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()
export {app, db, storage}