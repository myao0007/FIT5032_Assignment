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

    // 监听Firebase认证状态变化
    onAuthStateChange(async (firebaseUser) => {
        if (firebaseUser) {
            // 用户已登录
            authState.user = firebaseUser
            authState.isAuthenticated = true

            // 获取用户额外信息
            const profileResult = await getUserProfile(firebaseUser.uid)
            if (profileResult.success) {
                authState.userProfile = profileResult.data
            }

            // 检查管理员权限
            authState.isAdmin = await isAdmin(firebaseUser)
        } else {
            // 用户未登录
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
    // Firebase会自动更新状态
}

// Computed properties
export const authComputed = {
    user: computed(() => authState.user),
    userProfile: computed(() => authState.userProfile),
    isAuthenticated: computed(() => authState.isAuthenticated),
    isLoading: computed(() => authState.isLoading),
    isAdmin: computed(() => authState.isAdmin),
    userName: computed(() => {
        if (authState.userProfile) {
            return authState.userProfile.username || 'User'
        } else if (authState.user && authState.user.displayName) {
            return authState.user.displayName
        }
        return ''
    }),
    userEmail: computed(() => {
        return authState.user ? authState.user.email : ''
    })
}

export default authState
