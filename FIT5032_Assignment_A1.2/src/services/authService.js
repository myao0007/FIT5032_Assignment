// src/services/authService.js
import { auth, db } from '@/firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  doc, getDoc, setDoc, serverTimestamp,
} from 'firebase/firestore'

/** Cache "current user simplified info" for route guard use */
export function cacheSession(user, role) {
  const payload = { uid: user.uid, email: user.email, role }
  localStorage.setItem('currentUser', JSON.stringify(payload))
  return payload
}
export function getCachedUser() {
  const raw = localStorage.getItem('currentUser')
  return raw ? JSON.parse(raw) : null
}

/** Read Firestore role (for safety, also used in guards) */
export async function fetchUserRole(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? (snap.data().role || 'user') : 'user'
  } catch (e) {
    // Network unreachable/blocked etc: downgrade to regular user, avoid route errors
    console.warn('[fetchUserRole] fallback to user due to error:', e?.message || e)
    return 'user'
  }
}

/** Registration: default user; save username/dob if available */
export async function register({ email, password, username, dob }) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)

  // Default role user
  const role = 'user'
  await setDoc(doc(db, 'users', user.uid), {
    email,
    username: username || '',
    dob: dob || '',
    role,
    createdAt: serverTimestamp(),
  })

  return cacheSession(user, role)
}

/** Login: if email = admin@admin.com and password=1234, force as admin
 *  Otherwise read role from Firestore
 */
export async function login(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password)

  let role = 'user'
  if (email === 'admin@admin.com' && password === '1234') {
    role = 'admin'
    // Ensure it's also saved in database
    await setDoc(
      doc(db, 'users', user.uid),
      { email, role, createdAt: serverTimestamp() },
      { merge: true }
    )
  } else {
    role = await fetchUserRole(user.uid)
  }

  return cacheSession(user, role)
}

export async function logout() {
  await signOut(auth)
  localStorage.removeItem('currentUser')
}
