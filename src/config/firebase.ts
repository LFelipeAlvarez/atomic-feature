import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAVpQiXHCk59A6gBi_UkvadYbgsDdDaOKc",
  authDomain: "atomic-lab-42a55.firebaseapp.com",
  projectId: "atomic-lab-42a55",
  storageBucket: "atomic-lab-42a55.appspot.com",
  messagingSenderId: "534179239457",
  appId: "1:534179239457:web:249e65f3b8e05d5067f560"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
