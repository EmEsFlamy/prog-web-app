
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAyFadT3ob4cUzYGIxRV-I5zVtUkYGyyPY",
  authDomain: "webapp-e1285.firebaseapp.com",
  projectId: "webapp-e1285",
  storageBucket: "webapp-e1285.appspot.com",
  messagingSenderId: "960305936511",
  appId: "1:960305936511:web:548f6b2f81d8739de0a74a",
  measurementId: "G-DY3G7GGJ57"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics, app };