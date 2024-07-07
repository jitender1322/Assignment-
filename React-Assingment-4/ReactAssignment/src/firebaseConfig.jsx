// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQZAicn_7xp29DvsSiTAelSDfgItdzB_4",
    authDomain: "myreactfbproject.firebaseapp.com",
    projectId: "myreactfbproject",
    storageBucket: "myreactfbproject.appspot.com",
    messagingSenderId: "756231743409",
    appId: "1:756231743409:web:daa5d3470ac688fb197f90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }