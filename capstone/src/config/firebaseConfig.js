// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpXNdBA0Lu7DcMKvWKcYVvH_EqAXfF_jc",
  authDomain: "thesis-97fef.firebaseapp.com",
  projectId: "thesis-97fef",
  storageBucket: "thesis-97fef.firebasestorage.app",
  messagingSenderId: "500548210107",
  appId: "1:500548210107:web:b845496c83784639c0489e",
  measurementId: "G-D8H9L7DGV6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
