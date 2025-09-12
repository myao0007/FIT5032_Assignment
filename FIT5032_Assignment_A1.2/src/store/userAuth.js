// Firebase authentication state management
import { reactive, computed } from 'vue'
import { onAuthStateChange, getUserProfile, isAdmin } from '@/firebase/auth.js'

// Global authentication state
const authState = reactive({
    user: null,
    userProfile: null,
    isAuthenticated: false,
    isLoading: true,
    isAdmin: false
})

// Initialize authentication state with Firebase
export const initAuth = () => {
    authState.isLoading = true

    // Listen to Firebase authentication state changes
    onAuthStateChange(async (firebaseUser) => {
        if (firebaseUser) {
            // User is logged in
            authState.user = firebaseUser
            authState.isAuthenticated = true

            // Get additional user information
            const profileResult = await getUserProfile(firebaseUser.uid)
            if (profileResult.success) {
                authState.userProfile = profileResult.data
            }

            // Check admin permissions
            authState.isAdmin = await isAdmin(firebaseUser)
        } else {
            // User is not logged in
            authState.user = null
            authState.userProfile = null
            authState.isAuthenticated = false
            authState.isAdmin = false
        }
        authState.isLoading = false
    })
}

// Logout
export const logout = async () => {
    const { logoutUser } = await import('@/firebase/auth.js')
    await logoutUser()
    // Firebase will automatically update state
}

// Computed properties
export const authComputed = {
    user: computed(() => authState.user),
    userProfile: computed(() => authState.userProfile),
    isAuthenticated: computed(() => authState.isAuthenticated),
    isLoading: computed(() => authState.isLoading),
    isAdmin: computed(() => authState.isAdmin),
    userName: computed(() => {
        // Priority: username from user profile
        const profileName = authState.userProfile?.username
        if (profileName && profileName.trim()) return profileName

        // Second: Firebase user displayName
        const displayName = authState.user?.displayName
        if (displayName && displayName.trim()) return displayName

        // Fallback: email prefix
        const email = authState.user?.email || ''
        const prefix = email.includes('@') ? email.split('@')[0] : ''
        return prefix || 'User'
    }),
    userEmail: computed(() => {
        return authState.user ? authState.user.email : ''
    })
}

export default authState
