import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCSXcm692gMizSGUjGRSvjmGHiriYSJ1aM",
    authDomain: "she-93a56.firebaseapp.com",
    projectId: "she-93a56",
    storageBucket: "she-93a56.firebasestorage.app",
    messagingSenderId: "102206821629",
    appId: "1:102206821629:web:d41ee885de20cc18095a94"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
