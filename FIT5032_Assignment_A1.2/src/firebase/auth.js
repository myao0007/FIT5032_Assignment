// Firebase Authentication service
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
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

        // Email verification removed - using custom welcome email instead

        // Calculate role: admin if email is admin@admin.com and password is 1234
        let role = 'user'
        if (email === 'admin@admin.com' && password === '1234') {
            role = 'admin'
        }

        // Save extended info to Firestore
        try {
            console.log('Saving user data to Firestore:', { username, email, dob, role, uid: user.uid })
            await setDoc(doc(db, 'users', user.uid), {
                username,
                email,
                dob,
                role,
                createdAt: new Date().toISOString(),
                emailVerified: false
            })
            console.log('✅ User data saved to Firestore successfully')
        } catch (error) {
            console.error('❌ Failed to save user data to Firestore:', error)
        }

        // Send welcome email using Cloud Functions
        try {
            console.log('Sending welcome email to:', email, 'username:', username)
            
            const functions = getFunctions()
            const sendWelcomeEmail = httpsCallable(functions, 'sendWelcomeEmail')
            
            const result = await sendWelcomeEmail({ email, username })
            console.log('Welcome email result:', result.data)
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
