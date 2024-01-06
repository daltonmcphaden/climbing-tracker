// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth"

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
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const provider = new GoogleAuthProvider()

export const auth = getAuth()

// setPersistence(auth, browserSessionPersistence)
//   .then(() => {
//     // Existing and future Auth states are now persisted in the current
//     // session only. Closing the window would clear any existing state even
//     // if a user forgets to sign out.
//     // ...
//     // New sign-in will be persisted with session persistence.
//     return signInWithPopup(auth, provider)
//   })
//   .catch(error => {
//     // Handle Errors here.
//     const errorCode = error.code
//     const errorMessage = error.message
//   })

export const login = (): Promise<{ token: string; user: User }> => {
  return new Promise((resolve, reject) => {
    signInWithPopup(auth, provider)
      .then(result => {
        const credential = GoogleAuthProvider.credentialFromResult(result)!
        const token = credential.accessToken!
        const user = result.user
        resolve({ token, user })
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        const email = error.customData.email
        const credential = GoogleAuthProvider.credentialFromError(error)
        reject({ errorCode, errorMessage, email, credential })
      })
  })
}
