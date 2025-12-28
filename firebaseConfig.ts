import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configured with credentials for project: bliz-teirs
const firebaseConfig = {
  apiKey: "AIzaSyCxlljCw6o4Y6LolBxP4CszfT768j0ZeuU", 
  authDomain: "bliz-teirs.firebaseapp.com",
  projectId: "bliz-teirs",
  storageBucket: "bliz-teirs.firebasestorage.app",
  messagingSenderId: "122827537828", 
  appId: "1:122827537828:web:55a24b5b8e5fca5a039531"
};

let app;
let firestoreInstance;

try {
  app = initializeApp(firebaseConfig);
  firestoreInstance = getFirestore(app);
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export const firestore = firestoreInstance;