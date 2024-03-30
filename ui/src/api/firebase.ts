// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAe43qrBwZ_m-vynhx7ittRgiOHyhVRfk",
    authDomain: "charchas.firebaseapp.com",
    projectId: "charchas",
    storageBucket: "charchas.appspot.com",
    messagingSenderId: "959267204319",
    appId: "1:959267204319:web:d91be37ba73131a7e2cd6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export {firestore};