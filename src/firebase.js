// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import{getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDN92MFytqkewoccbPSBwRLOmssyk-zW8Q",
    authDomain: "chatapp-f07d9.firebaseapp.com",
    databaseURL: "https://chatapp-f07d9-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chatapp-f07d9",
    storageBucket: "chatapp-f07d9.appspot.com",
    messagingSenderId: "921086266234",
    appId: "1:921086266234:web:7ebf097fdaa35b518024c3"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();