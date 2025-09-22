// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzq2eiBH1D5-Yjx1e8JB5evSSemVIigj8",
  authDomain: "library-d9246.firebaseapp.com",
  projectId: "library-d9246",
  // storageBucket: "library-d9246.firebasestorage.app",
  storageBucket: "library-d9246.appspot.com",
  messagingSenderId: "499105479858",
  appId: "1:499105479858:web:4fc793927ab3e1ee54ddab",
  measurementId: "G-JW9H66VTNM"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);

// onst app = initializeApp(firebaseConfig)

// export const auth = getAuth(app)
export const db = getFirestore(app)


let analytics;
if (typeof window !== "undefined") {
  const { getAnalytics, isSupported } = require("firebase/analytics");
  isSupported().then((supported: boolean) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}







// // firebase.ts
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyAzq2eiBH1D5-Yjx1e8JB5evSSemVIigj8",
//   authDomain: "library-d9246.firebaseapp.com",
//   projectId: "library-d9246",
//   // storageBucket: "library-d9246.appspot.com", // 🔥 fix
//   storageBucket: "https://library-d9246-default-rtdb.firebaseio.com/",
//   messagingSenderId: "499105479858",
//   appId: "1:499105479858:web:4fc793927ab3e1ee54ddab",
//   measurementId: "G-JW9H66VTNM",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Export services
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);
