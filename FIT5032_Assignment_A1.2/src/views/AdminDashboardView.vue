<template>
    <div class="admin-dashboard">
        <div class="container">
            <!-- Page Header -->
            <div class="page-header">
                <h1 class="page-title">Admin Dashboard</h1>
                <p class="page-subtitle">Website Overview & User Management</p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading dashboard data...</p>
            </div>

            <!-- Dashboard Content -->
            <div v-else class="dashboard-content">
                <!-- User Statistics Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-number">{{ totalUsers.toLocaleString() }}</h3>
                            <p class="stat-label">Total Users</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fa-solid fa-user-plus"></i>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-number">{{ todayNewUsers }}</h3>
                            <p class="stat-label">Today New Users</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fa-solid fa-calendar-week"></i>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-number">{{ weekNewUsers }}</h3>
                            <p class="stat-label">This Week New Users</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fa-solid fa-calendar-days"></i>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-number">{{ monthNewUsers }}</h3>
                            <p class="stat-label">This Month New Users</p>
                        </div>
                    </div>
                </div>

                <!-- User Activity Distribution -->
                <div class="chart-section">
                    <div class="chart-card">
                        <h3 class="chart-title">User Activity Distribution</h3>
                        <div class="chart-container">
                            <div class="chart-visual">
                                <div class="pie-chart" :style="{ '--active-percentage': activePercentage }">
                                    <div class="pie-center">
                                        <span class="pie-label">Total Users</span>
                                        <span class="pie-number">{{ totalUsers }}</span>
                                    </div>
                                </div>
                                <div class="chart-details">
                                    <div class="detail-item">
                                        <div class="detail-color active-color"></div>
                                        <div class="detail-info">
                                            <span class="detail-label">Active Users</span>
                                            <span class="detail-value">{{ activeUsers }} ({{ activePercentage.toFixed(1)
                                            }}%)</span>
                                        </div>
                                    </div>
                                    <div class="detail-item">
                                        <div class="detail-color inactive-color"></div>
                                        <div class="detail-info">
                                            <span class="detail-label">Inactive Users</span>
                                            <span class="detail-value">{{ inactiveUsers }} ({{
                                                inactivePercentage.toFixed(1) }}%)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content Management Section -->
                <div class="content-section">
                    <!-- Event Bookings -->
                    <div class="content-card">
                        <h3 class="content-title">Event Bookings</h3>
                        <div class="content-stats">
                            <div class="content-stat">
                                <div class="content-number">{{ totalBookings.toLocaleString() }}</div>
                                <div class="content-label">Total Bookings</div>
                            </div>
                            <div class="content-stat">
                                <div class="content-number">{{ todayBookings }}</div>
                                <div class="content-label">Today Bookings</div>
                            </div>
                        </div>
                        <div class="trend-chart">
                            <h4 class="trend-title">Event Booking Statistics</h4>
                            <div class="bar-chart-container">
                                <div v-for="eventStat in eventBookingStats" :key="eventStat.id" class="bar-chart-item">
                                    <div class="bar-label">{{ eventStat.title }}</div>
                                    <div class="bar-container">
                                        <div class="bar-fill" :style="{ width: eventStat.percentage + '%' }"></div>
                                        <span class="bar-value">{{ eventStat.count }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tree Hole Posts -->
                    <div class="content-card">
                        <h3 class="content-title">Tree Hole Posts</h3>
                        <div class="content-stats">
                            <div class="content-stat">
                                <div class="content-number">{{ totalPosts.toLocaleString() }}</div>
                                <div class="content-label">Total Posts</div>
                            </div>
                            <div class="content-stat">
                                <div class="content-number">{{ todayPosts }}</div>
                                <div class="content-label">Today Posts</div>
                            </div>
                            <div class="content-stat">
                                <div class="content-number">{{ weekPosts }}</div>
                                <div class="content-label">This Week Posts</div>
                            </div>
                        </div>
                        <div class="trend-chart">
                            <h4 class="trend-title">Popular Keywords</h4>
                            <div class="keyword-cloud">
                                <span v-for="keyword in topKeywords" :key="keyword.word"
                                    :class="['keyword-tag', `keyword-size-${keyword.size}`]"
                                    :style="{ color: keyword.color }" :title="`${keyword.count} times`">
                                    {{ keyword.word }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- User Management Table -->
                <div class="table-section">
                    <div class="table-card">
                        <div class="table-header">
                            <h3 class="table-title">User Management</h3>
                            <a class="download-link" @click="downloadPDF" :disabled="isDownloading"
                                title="Download as PDF">
                                <i class="fa-solid fa-download"></i>
                                <span>{{ isDownloading ? 'Generating...' : 'Download PDF' }}</span>
                            </a>
                        </div>
                        <div class="table-container">
                            <table class="user-table">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Date of Birth</th>
                                        <th>Role</th>
                                        <th>Booking Info</th>
                                        <th>Tree Hole Info</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="user in users" :key="user.id">
                                        <td class="username-cell">{{ user.username || '-' }}</td>
                                        <td class="email-cell">{{ user.email }}</td>
                                        <td class="dob-cell">{{ user.dob || '-' }}</td>
                                        <td class="role-cell">
                                            <span class="role-text" :class="user.role">{{ user.role || 'user' }}</span>
                                        </td>
                                        <td class="booking-cell">
                                            <span class="info-text" :class="getUserBookingStatus(user.email)">
                                                {{ getUserBookingCount(user.email) }} bookings
                                            </span>
                                        </td>
                                        <td class="treehole-cell">
                                            <span class="info-text" :class="getUserTreeHoleStatus(user.email)">
                                                {{ getUserTreeHoleCount(user.email) }} posts
                                            </span>
                                        </td>
                                        <td class="status-cell">
                                            <span class="status-text" :class="getUserActivityStatus(user.email)">
                                                {{ getUserActivityStatus(user.email) }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import jsPDF from 'jspdf'
import { authComputed } from '@/store/userAuth.js'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive data
const loading = ref(true)
const users = ref([])
const bookings = ref([])
const treeholePosts = ref([])
const isDownloading = ref(false)

// Computed properties for user statistics
const totalUsers = computed(() => users.value.length)

const todayNewUsers = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return users.value.filter(user => {
        const userDate = user.createdAt?.toDate?.() || new Date(user.createdAt)
        return userDate >= today
    }).length
})

const weekNewUsers = computed(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    weekAgo.setHours(0, 0, 0, 0)
    return users.value.filter(user => {
        const userDate = user.createdAt?.toDate?.() || new Date(user.createdAt)
        return userDate >= weekAgo
    }).length
})

const monthNewUsers = computed(() => {
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    monthAgo.setHours(0, 0, 0, 0)
    return users.value.filter(user => {
        const userDate = user.createdAt?.toDate?.() || new Date(user.createdAt)
        return userDate >= monthAgo
    }).length
})

// User activity classification
const activeUsers = computed(() => {
    const bookingEmails = new Set(bookings.value.map(b => b.attendeeInfo?.email).filter(Boolean))
    const postEmails = new Set(treeholePosts.value.map(p => p.author).filter(Boolean))
    const activeEmails = new Set([...bookingEmails, ...postEmails])

    return users.value.filter(user => activeEmails.has(user.email)).length
})

const inactiveUsers = computed(() => totalUsers.value - activeUsers.value)

const activePercentage = computed(() => {
    if (totalUsers.value === 0) return 0
    return (activeUsers.value / totalUsers.value) * 100
})

const inactivePercentage = computed(() => {
    if (totalUsers.value === 0) return 0
    return (inactiveUsers.value / totalUsers.value) * 100
})

// Content management statistics
const totalBookings = computed(() => bookings.value.length)

const todayBookings = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookings.value.filter(booking => {
        const bookingDate = booking.createdAt?.toDate?.() || new Date(booking.createdAt)
        return bookingDate >= today
    }).length
})


// Event booking statistics for bar chart
const eventBookingStats = computed(() => {
    if (bookings.value.length === 0) return []

    const eventCounts = {}
    bookings.value.forEach(booking => {
        const eventId = booking.eventId
        eventCounts[eventId] = (eventCounts[eventId] || 0) + 1
    })

    const eventsData = [
        { id: 1, title: "Reconnecting with Yourself – Healing Workshop" },
        { id: 2, title: "Emotional Boundaries and Self-Worth" },
        { id: 3, title: "Building Confidence Through Self-Expression" },
        { id: 4, title: "Navigating Relationships with Emotional Intelligence" },
        { id: 5, title: "Mindfulness and Stress Management for Women" },
        { id: 6, title: "Career Growth and Personal Development" },
        { id: 7, title: "Creative Healing Through Art and Writing" },
        { id: 8, title: "Financial Wellness and Independence" },
        { id: 9, title: "Body Positivity and Self-Acceptance" },
        { id: 10, title: "Building Supportive Female Networks" }
    ]

    const maxCount = Math.max(...Object.values(eventCounts))

    return eventsData
        .map(event => ({
            id: event.id,
            title: event.title.length > 25 ? event.title.substring(0, 25) + '...' : event.title,
            count: eventCounts[event.id] || 0,
            percentage: maxCount > 0 ? ((eventCounts[event.id] || 0) / maxCount) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count) // Sort by count descending
})

const totalPosts = computed(() => treeholePosts.value.length)

const todayPosts = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return treeholePosts.value.filter(post => {
        const postDate = post.createdAt?.toDate?.() || new Date(post.createdAt)
        return postDate >= today
    }).length
})

const weekPosts = computed(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    weekAgo.setHours(0, 0, 0, 0)
    return treeholePosts.value.filter(post => {
        const postDate = post.createdAt?.toDate?.() || new Date(post.createdAt)
        return postDate >= weekAgo
    }).length
})

// Keyword extraction and cloud generation
const topKeywords = computed(() => {
    if (treeholePosts.value.length === 0) return []

    // Combine all post content
    const allText = treeholePosts.value
        .map(post => `${post.content || ''} ${post.keyword || ''}`)
        .join(' ')
        .toLowerCase()

    // Simple word extraction (split by spaces and common punctuation)
    const words = allText
        .replace(/[^\w\s]/g, ' ') // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 2) // Filter out short words

    // Count word frequency
    const wordCount = {}
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1
    })

    // Filter out common stop words
    const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'she', 'use', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'she', 'use']
    const filteredWords = Object.entries(wordCount)
        .filter(([word, count]) => !stopWords.includes(word) && count > 1)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 15) // Top 15 keywords

    // Color palette for keywords
    const colors = ['#2c3e50', '#e67e22', '#e74c3c', '#9b59b6', '#3498db', '#1abc9c', '#f39c12', '#34495e']

    // Assign sizes and colors based on frequency
    const maxCount = Math.max(...filteredWords.map(([, count]) => count))
    return filteredWords.map(([word, count], index) => ({
        word,
        count,
        size: count >= maxCount * 0.7 ? 'large' :
            count >= maxCount * 0.4 ? 'medium' : 'small',
        color: word === 'love' ? '#f0b6c1' : colors[index % colors.length]
    }))
})


// User management methods
const getUserBookingCount = (email) => {
    return bookings.value.filter(booking => booking.attendeeInfo?.email === email).length
}

const getUserTreeHoleCount = (email) => {
    return treeholePosts.value.filter(post => post.author === email).length
}

const getUserBookingStatus = (email) => {
    const count = getUserBookingCount(email)
    if (count === 0) return 'no-bookings'
    if (count === 1) return 'low-bookings'
    if (count <= 3) return 'medium-bookings'
    return 'high-bookings'
}

const getUserTreeHoleStatus = (email) => {
    const count = getUserTreeHoleCount(email)
    if (count === 0) return 'no-posts'
    if (count === 1) return 'low-posts'
    if (count <= 3) return 'medium-posts'
    return 'high-posts'
}

const getUserActivityStatus = (email) => {
    const bookingCount = getUserBookingCount(email)
    const postCount = getUserTreeHoleCount(email)

    if (bookingCount > 0 || postCount > 0) {
        return 'active'
    } else {
        return 'inactive'
    }
}

// Methods
const fetchUsers = async () => {
    try {
        const usersRef = collection(db, 'users')
        const q = query(usersRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)

        users.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (error) {
        console.error('Error fetching users:', error)
    }
}

const fetchBookings = async () => {
    try {
        const bookingsRef = collection(db, 'bookings')
        const q = query(bookingsRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)

        bookings.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (error) {
        console.error('Error fetching bookings:', error)
    }
}

const fetchTreeholePosts = async () => {
    try {
        // Assuming treehole posts are stored in a collection
        // You may need to adjust the collection name based on your actual structure
        const postsRef = collection(db, 'treehole')
        const q = query(postsRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)

        treeholePosts.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (error) {
        console.error('Error fetching treehole posts:', error)
        // If treehole collection doesn't exist, initialize with empty array
        treeholePosts.value = []
    }
}


const loadDashboardData = async () => {
    loading.value = true
    try {
        await Promise.all([
            fetchUsers(),
            fetchBookings(),
            fetchTreeholePosts()
        ])
    } catch (error) {
        console.error('Error loading dashboard data:', error)
    } finally {
        loading.value = false
    }
}

// PDF Download functionality
const downloadPDF = () => {
    if (isDownloading.value) return

    isDownloading.value = true

    try {
        // Create PDF document
        const doc = new jsPDF('landscape', 'mm', 'a4')

        // Set font size for title
        doc.setFontSize(20)
        doc.text('User Management Report', 20, 20)

        // Add generation date
        doc.setFontSize(12)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)

        // Set font size for table
        doc.setFontSize(10)

        // Table headers
        const headers = ['Username', 'Email', 'Date of Birth', 'Role', 'Bookings', 'Posts', 'Status']
        const colWidths = [25, 50, 25, 15, 20, 15, 20]
        let x = 20
        let y = 45

        // Draw table headers
        headers.forEach((header, index) => {
            doc.rect(x, y - 5, colWidths[index], 8)
            doc.text(header, x + 2, y)
            x += colWidths[index]
        })

        // Draw table data
        y += 8
        users.value.forEach((user, rowIndex) => {
            if (y > 180) { // New page if needed
                doc.addPage()
                y = 20
            }

            x = 20
            const rowData = [
                user.username || '-',
                user.email,
                user.dob || '-',
                (user.role || 'user').toUpperCase(),
                `${getUserBookingCount(user.email)}`,
                `${getUserTreeHoleCount(user.email)}`,
                getUserActivityStatus(user.email).toUpperCase()
            ]

            rowData.forEach((data, colIndex) => {
                // Truncate long text
                const displayText = data.length > 15 ? data.substring(0, 12) + '...' : data

                doc.rect(x, y - 5, colWidths[colIndex], 8)
                doc.text(displayText, x + 2, y)
                x += colWidths[colIndex]
            })

            y += 8
        })

        // Generate filename
        const fileName = `User_Management_Report_${new Date().toISOString().split('T')[0]}.pdf`

        // Download PDF
        doc.save(fileName)

        alert('PDF downloaded successfully!')

    } catch (error) {
        console.error('Error generating PDF:', error)
        alert('Error generating PDF. Please try again.')
    } finally {
        isDownloading.value = false
    }
}

// Check admin access
onMounted(() => {
    if (!authComputed.isAdmin.value) {
        router.push('/home')
        return
    }

    loadDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
    min-height: 100vh;
    background: #ffffff;
    padding: 84px 24px 40px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

/* Page Header */
.page-header {
    text-align: center;
    margin-bottom: 40px;
}

.page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 16px 0;
}

.page-subtitle {
    font-size: 1.2rem;
    color: #666666;
    margin: 0;
}

/* Loading State */
.loading-container {
    text-align: center;
    padding: 60px 20px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f0b6c1;
    border-top: 4px solid #2c3e50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Statistics Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

.stat-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 16px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #f0b6c1, #e8a8b8);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2c3e50;
    font-size: 24px;
}

.stat-content {
    flex: 1;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 800;
    color: #2c3e50;
    margin: 0 0 4px 0;
    line-height: 1;
}

.stat-label {
    font-size: 1rem;
    color: #666666;
    margin: 0;
    font-weight: 500;
}

/* Chart Section */
.chart-section {
    margin-bottom: 40px;
}

.chart-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 24px 0;
    text-align: center;
}

.chart-container {
    max-width: 600px;
    margin: 0 auto;
}

.chart-visual {
    display: flex;
    align-items: center;
    gap: 40px;
    justify-content: center;
}

.pie-chart {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: conic-gradient(#f0b6c1 0deg calc(var(--active-percentage) * 3.6deg),
            #e9ecef calc(var(--active-percentage) * 3.6deg) 360deg);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.pie-center {
    width: 120px;
    height: 120px;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pie-label {
    font-size: 0.9rem;
    color: #666666;
    font-weight: 500;
    margin-bottom: 4px;
}

.pie-number {
    font-size: 1.8rem;
    font-weight: 800;
    color: #2c3e50;
}


.chart-details {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.detail-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
}

.active-color {
    background: #f0b6c1;
}

.inactive-color {
    background: #e9ecef;
}

.detail-info {
    display: flex;
    flex-direction: column;
}

.detail-label {
    font-size: 0.9rem;
    color: #666666;
    font-weight: 500;
}

.detail-value {
    font-size: 1.1rem;
    color: #2c3e50;
    font-weight: 600;
}

/* Content Section */
.content-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
}

.content-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 24px 0;
}

.content-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;
}

.content-stat {
    text-align: center;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
}

.content-number {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 4px;
    line-height: 1.2;
    word-wrap: break-word;
}

.content-label {
    font-size: 0.9rem;
    color: #666666;
    font-weight: 500;
}


.trend-chart {
    border-top: 1px solid #e9ecef;
    padding-top: 20px;
}

/* Bar Chart Styles */
.bar-chart-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;
}

.bar-chart-item {
    display: flex;
    align-items: center;
    gap: 16px;
}

.bar-label {
    min-width: 200px;
    font-size: 0.9rem;
    color: #2c3e50;
    font-weight: 500;
    text-align: left;
}

.bar-container {
    flex: 1;
    position: relative;
    height: 24px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    overflow: hidden;
    display: flex;
    align-items: center;
}

.bar-fill {
    height: 100%;
    background: #f0b6c1;
    transition: width 0.3s ease;
    min-width: 0;
}

.bar-value {
    position: absolute;
    right: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #2c3e50;
    z-index: 1;
}

.trend-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 16px 0;
}

.trend-placeholder {
    height: 120px;
    background: #f8f9fa;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #666666;
    gap: 8px;
}

.trend-placeholder i {
    font-size: 2rem;
    color: #f0b6c1;
}

/* Keyword Cloud Styles */
.keyword-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 20px;
    min-height: 120px;
    align-items: center;
    justify-content: center;
}

.keyword-tag {
    display: inline-block;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    text-decoration: none;
}

.keyword-tag:hover {
    transform: scale(1.1);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.keyword-size-small {
    font-size: 0.9rem;
    font-weight: 400;
}

.keyword-size-medium {
    font-size: 1.1rem;
    font-weight: 500;
}

.keyword-size-large {
    font-size: 1.4rem;
    font-weight: 600;
}

/* Table Section */
.table-section {
    margin-bottom: 40px;
}

.table-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.table-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
}

.download-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #2c3e50;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s ease;
}

.download-link:hover:not(:disabled) {
    color: #1a252f;
}

.download-link:disabled {
    color: #95a5a6;
    cursor: not-allowed;
}

.download-link i {
    font-size: 1rem;
}

.table-container {
    overflow-x: auto;
}


/* Responsive Design */
@media (max-width: 768px) {
    .admin-dashboard {
        padding: 84px 16px 40px;
    }

    .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .content-section {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .content-stats {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .user-table {
        font-size: 0.8rem;
    }

    .user-table th,
    .user-table td {
        padding: 12px 8px;
    }

    .bar-label {
        min-width: 150px;
        font-size: 0.8rem;
    }

    .bar-container {
        height: 20px;
    }

    .bar-value {
        font-size: 0.7rem;
        right: 6px;
    }

    .table-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }

    .download-link {
        align-self: flex-end;
    }

    .chart-visual {
        flex-direction: column;
        gap: 24px;
    }

}

/* User Management Table Styles */
.user-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}

.user-table th {
    background: #f8f9fa;
    color: #2c3e50;
    font-weight: 600;
    padding: 16px 12px;
    text-align: left;
    border-bottom: 2px solid #e9ecef;
    white-space: nowrap;
}

.user-table td {
    padding: 16px 12px;
    border-bottom: 1px solid #e9ecef;
    color: #333333;
    vertical-align: middle;
}

.user-table tbody tr:hover {
    background-color: #f8f9fa;
}

.role-text {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    display: inline-block;
}

.role-text.admin {
    color: #6f42c1;
}

.role-text.user {
    color: #495057;
}

.info-text {
    font-size: 0.8rem;
    font-weight: 700;
    display: inline-block;
}

.info-text.no-bookings {
    color: #721c24;
}

.info-text.low-bookings {
    color: #856404;
}

.info-text.medium-bookings {
    color: #0c5460;
}

.info-text.high-bookings {
    color: #6f42c1;
}

.info-text.no-posts {
    color: #721c24;
}

.info-text.low-posts {
    color: #856404;
}

.info-text.medium-posts {
    color: #0c5460;
}

.info-text.high-posts {
    color: #6f42c1;
}

.status-text {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    display: inline-block;
}

.status-text.active {
    color: #155724;
}

.status-text.inactive {
    color: #721c24;
}

.username-cell {
    font-weight: 600;
    color: #2c3e50;
}

.email-cell {
    font-family: monospace;
    font-size: 0.85rem;
}

.dob-cell {
    color: #666666;
}

.booking-cell,
.treehole-cell {
    text-align: center;
}

.status-cell {
    text-align: center;
}
</style>
