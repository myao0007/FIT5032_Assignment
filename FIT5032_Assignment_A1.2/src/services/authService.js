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

/** 把"当前用户的精简信息"存起来，路由守卫好用 */
export function cacheSession(user, role) {
  const payload = { uid: user.uid, email: user.email, role }
  localStorage.setItem('currentUser', JSON.stringify(payload))
  return payload
}
export function getCachedUser() {
  const raw = localStorage.getItem('currentUser')
  return raw ? JSON.parse(raw) : null
}

/** 读 Firestore 的角色（保险起见，守卫里也会用到） */
export async function fetchUserRole(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? (snap.data().role || 'user') : 'user'
  } catch (e) {
    // 网络不可达/被拦截等情况：降级为普通用户，避免路由报错
    console.warn('[fetchUserRole] fallback to user due to error:', e?.message || e)
    return 'user'
  }
}

/** 注册：默认 user；你已有 username/dob 就一起存 */
export async function register({ email, password, username, dob }) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)

  // 默认角色 user
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

/** 登录：如果邮箱 = admin@admin.com 且密码=1234，强制视为 admin
 *  否则从 Firestore 读角色
 */
export async function login(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password)

  let role = 'user'
  if (email === 'admin@admin.com' && password === '1234') {
    role = 'admin'
    // 确保库里也落一份
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
