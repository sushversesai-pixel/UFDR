import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDhnbU76hbtAX7WFwOZLcusbR9jGqJl69Q",
  authDomain: "ufdr-analysis-739218.firebaseapp.com",
  projectId: "ufdr-analysis-739218",
  storageBucket: "ufdr-analysis-739218.firebasestorage.app",
  messagingSenderId: "457854138424",
  appId: "1:457854138424:web:a32b65907e7451c73c4ecd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
