import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZGrFci50OlPQxf8wAFtTIjcX2V5YCYHE",
  authDomain: "chat-room-6b9cb.firebaseapp.com",
  projectId: "chat-room-6b9cb",
  storageBucket: "chat-room-6b9cb.appspot.com",
  messagingSenderId: "770425211235",
  appId: "1:770425211235:web:dee834a30b987490f52b56",
  measurementId: "G-B435EQQLN8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

connectAuthEmulator(auth, "http://localhost:9099")
if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', '8080')
}

export { auth, db };
