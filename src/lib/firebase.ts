import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC8J3czTRxKaYp0i_yTVT-5L1T3LJD5BEY",
  authDomain: "tinhgpa-1d515.firebaseapp.com",
  databaseURL: "https://tinhgpa-1d515-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tinhgpa-1d515",
  storageBucket: "tinhgpa-1d515.firebasestorage.app",
  messagingSenderId: "694939849244",
  appId: "1:694939849244:web:19381b92492fe7addf05d9",
  measurementId: "G-Y2JV22XG7H"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);