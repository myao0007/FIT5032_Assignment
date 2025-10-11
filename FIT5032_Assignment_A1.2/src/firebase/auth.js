// Firebase Authentication service
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './config.js'


// User login
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        return { success: true, user: userCredential.user }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// User registration
export const registerUser = async (userData) => {
    try {
        console.log('=== REGISTER USER STARTED ===')
        console.log('User data:', userData)
        const { email, password, username, dob } = userData

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Update user display name (best-effort)
        try {
            await updateProfile(user, { displayName: username })
        } catch (_) {}

        // Fire-and-forget: email verification, non-blocking registration
        try { sendEmailVerification(user) } catch (_) {}

        // Calculate role: admin if email is admin@admin.com and password is 1234
        let role = 'user'
        if (email === 'admin@admin.com' && password === '1234') {
            role = 'admin'
        }

        // Fire-and-forget: save extended info to Firestore, non-blocking registration
        try {
            setDoc(doc(db, 'users', user.uid), {
                username,
                email,
                dob,
                role,
                createdAt: new Date().toISOString(),
                emailVerified: false
            })
        } catch (_) {}

        // Send welcome email using fetch to backend
        try {
            console.log('Sending welcome email to:', email, 'username:', username)
            
            // Use a simple fetch without CORS issues
            const response = await fetch('http://localhost:3000/api/send-welcome-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    username: username
                })
            })
            
            const result = await response.json()
            console.log('Welcome email result:', result)
        } catch (error) {
            console.log('Failed to send email:', error.message)
        }

        // Return immediately to let frontend redirect quickly
        return { success: true, user, role }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// User logout
export const logoutUser = async () => {
    try {
        await signOut(auth)
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Listen to authentication state changes
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback)
}

// Get additional user information
export const getUserProfile = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid))
        if (userDoc.exists()) {
            return { success: true, data: userDoc.data() }
        } else {
            return { success: false, error: 'User profile not found' }
        }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Check if user is admin
export const isAdmin = async (user) => {
    if (!user) return false

    try {
        const userProfile = await getUserProfile(user.uid)
        if (userProfile.success) {
            return userProfile.data.role === 'admin'
        }
        return false
    } catch (error) {
        console.error('Error checking admin status:', error)
        return false
    }
}
