// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJ2S_N9JjqOD5jxo82T1BtzuZM_-SsraY",
  authDomain: "troublesome-or-not.firebaseapp.com",
  projectId: "troublesome-or-not",
  storageBucket: "troublesome-or-not.appspot.com",
  messagingSenderId: "648432944231",
  appId: "1:648432944231:web:b62c1298179924d92380c2",
  measurementId: "G-8YP2KH7LT7",
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
// export const analytics = getAnalytics(firebaseApp)
export const db = getFirestore()
