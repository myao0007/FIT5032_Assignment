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
        const { email, password, username, dob } = userData

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Update user display name (best-effort)
        try {
            await updateProfile(user, { displayName: username })
        } catch (_) {}

        // Fire-and-forget: email verification，不阻塞注册流程
        try { sendEmailVerification(user) } catch (_) {}

        // Calculate role: admin if email is admin@admin.com and password is 1234
        let role = 'user'
        if (email === 'admin@admin.com' && password === '1234') {
            role = 'admin'
        }

        // Fire-and-forget: 保存扩展信息到 Firestore，不阻塞注册流程
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

        // 立即返回，让前端尽快跳转
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
