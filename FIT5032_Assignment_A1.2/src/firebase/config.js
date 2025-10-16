import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCSXcm692gMizSGUjGRSvjmGHiriYSJ1aM",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "she-93a56.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "she-93a56",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "she-93a56.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "102206821629",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:102206821629:web:d41ee885de20cc18095a94"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
