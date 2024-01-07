// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
import { getAuth, User, signInWithEmailAndPassword } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3cVJMEAOj6hrQ4L-HYM30Furih6dwwyw",
  authDomain: "climbing-tracker-633.firebaseapp.com",
  projectId: "climbing-tracker-633",
  storageBucket: "climbing-tracker-633.appspot.com",
  messagingSenderId: "1080014736204",
  appId: "1:1080014736204:web:6142c83058fc7da5fa1de9",
  measurementId: "G-LD03RMMJP9",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
export const db = getFirestore(app)

export const auth = getAuth()

export const login = (email: string, password: string): Promise<{ token: string; user: User }> => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user
        // ...
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
      })
  })
}
