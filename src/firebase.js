import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVFA9eg-_XmG_ynDYMCNo43pAc_4U6uEM",
  authDomain: "placement-200eb.firebaseapp.com",
  projectId: "placement-200eb",
  storageBucket: "placement-200eb.appspot.com",
  messagingSenderId: "846283037666",
  appId: "1:846283037666:web:ad79dcd66d1ddc099777bb",
  measurementId: "G-NN60VTK2J8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
