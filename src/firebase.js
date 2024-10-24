import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyBIIfWMiajd2XQpGYVruJ2LZWyddlN-I9k",
    authDomain: "todolist-b625c.firebaseapp.com",
    projectId: "todolist-b625c",
    storageBucket: "todolist-b625c.appspot.com",
    messagingSenderId: "244747369236",
    appId: "1:244747369236:web:3496b81025acef3d466001"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, updateDoc, doc };
