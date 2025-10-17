<template>
    <div class="treehole-root">
        <div class="container">
            <!-- Page Title -->
            <div class="page-header">
                <h1 class="page-title">Tree Hole</h1>
                <p class="page-subtitle">Share your thoughts anonymously in a judgment-free zone</p>
            </div>

            <!-- Add Button in Top Right Corner -->
            <button @click="goToSharePage" class="add-button">
                <span class="add-icon">+</span>
                Share Your Thoughts
            </button>

            <!-- Content Area (when viewing a specific entry) -->
            <div class="content-area" v-if="selectedEntry">
                <div class="content-header">
                    <h2 class="content-title">{{ selectedEntry.keyword }}</h2>
                </div>
                <div class="content-text">
                    {{ selectedEntry.content }}
                </div>


                <button @click="goBack" class="back-btn">← Go Back</button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading thoughts...</p>
            </div>

            <!-- Table Area (when not viewing specific entry) -->
            <div class="table-area" v-if="!selectedEntry && !loading">
                <!-- Table Header with controls -->
                <div class="table-header">
                    <h2 class="table-title">Thoughts & Stories</h2>
                    <div class="controls-box">
                        <div class="search-box">
                            <div class="search-input-wrapper">
                                <i class="pi pi-search search-icon"></i>
                                <input v-model="searchText" placeholder="Search thoughts..." class="search-input" />
                                <button v-if="searchText" @click="clearSearch" class="clear-btn">
                                    ×
                                </button>
                            </div>
                        </div>
                        <div class="sort-box">
                            <select v-model="sortBy" class="sort-select">
                                <option value="id">Sort by ID</option>
                                <option value="keyword">Sort by Keyword</option>
                                <option value="content">Sort by Content</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Thoughts Table -->
                <div class="thoughts-table-container">
                    <table class="thoughts-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Keyword</th>
                                <th>Preview</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="entry in currentPageEntries" :key="entry.id" class="thought-row">
                                <td class="thought-id-cell">{{ entry.id }}</td>
                                <td class="thought-keyword-cell">{{ entry.keyword }}</td>
                                <td class="thought-preview-cell">{{ getPreview(entry.content) }}</td>
                                <td class="thought-actions-cell">
                                    <button @click="selectEntry(entry)" class="read-btn">
                                        Read Full
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="pagination">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
                        &lt;
                    </button>
                    <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn">
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import treeholeData from '@/data/treehole-data.json'

const router = useRouter()
const route = useRoute()

// Reactive data
const selectedEntry = ref(null)
const searchText = ref('')
const sortBy = ref('id')
const currentPage = ref(1)
const itemsPerPage = 10
const thoughts = ref([])
const loading = ref(true)

// Select an entry to show content
const selectEntry = (entry) => {
    selectedEntry.value = entry
}

// Go back to table view
const goBack = () => {
    selectedEntry.value = null
}

// Go to share thoughts page
const goToSharePage = () => {
    // Store current state in localStorage before navigation
    if (selectedEntry.value) {
        localStorage.setItem('treehole_previous_state', JSON.stringify({
            fromCard: true,
            currentEntry: selectedEntry.value
        }))
    } else {
        localStorage.setItem('treehole_previous_state', JSON.stringify({
            fromCard: false,
            currentEntry: null
        }))
    }

    // Navigate to share page
    router.push('/share-thoughts')
}

// Filter and sort entries
const filteredEntries = computed(() => {
    let filtered = thoughts.value

    // Filter by search text
    if (searchText.value) {
        filtered = filtered.filter(entry =>
            entry.keyword.toLowerCase().includes(searchText.value.toLowerCase()) ||
            entry.content.toLowerCase().includes(searchText.value.toLowerCase())
        )
    }

    // Sort entries
    const sorted = filtered.sort((a, b) => {
        switch (sortBy.value) {
            case 'id':
                // Static data first (by original ID), then user posts (by creation time)
                if (!a.isUserPost && !b.isUserPost) {
                    return a.id - b.id // Static data by original ID
                } else if (a.isUserPost && b.isUserPost) {
                    const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt)
                    const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt)
                    return aTime - bTime // User posts by creation time (oldest first)
                } else if (!a.isUserPost && b.isUserPost) {
                    return -1 // Static data first
                } else {
                    return 1 // User posts after static data
                }
            case 'keyword':
                return a.keyword.localeCompare(b.keyword)
            case 'content':
                return a.content.localeCompare(b.content)
            default:
                return 0
        }
    })

    return sorted
})

// Calculate total pages
const totalPages = computed(() => {
    return Math.ceil(filteredEntries.value.length / itemsPerPage)
})

// Get entries for current page
const currentPageEntries = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredEntries.value.slice(start, end)
})

// Get preview of content (first 100 characters)
const getPreview = (content) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content
}

// Clear search
const clearSearch = () => {
    searchText.value = ''
    currentPage.value = 1
}

// Fetch thoughts from Firestore and combine with static data
const fetchThoughts = async () => {
    try {
        loading.value = true
        const thoughtsRef = collection(db, 'treehole')
        const q = query(thoughtsRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)

        // Get user posts from Firestore and sort by creation time (oldest first)
        const sortedDocs = querySnapshot.docs.sort((a, b) => {
            const aTime = a.data().createdAt?.toDate?.() || new Date(a.data().createdAt)
            const bTime = b.data().createdAt?.toDate?.() || new Date(b.data().createdAt)
            return aTime - bTime // Oldest first
        })

        const userPosts = sortedDocs.map((doc, index) => ({
            id: treeholeData.length + index + 1, // Start IDs after static data, in chronological order
            keyword: doc.data().keyword,
            content: doc.data().content,
            author: doc.data().author,
            createdAt: doc.data().createdAt,
            status: doc.data().status || 'published',
            docId: doc.id, // Keep original document ID
            isUserPost: true // Mark as user-generated content
        }))

        // Combine static data with user posts
        thoughts.value = [...treeholeData, ...userPosts]

        console.log('Static data:', treeholeData.length, 'User posts:', userPosts.length, 'Total:', thoughts.value.length)
    } catch (error) {
        console.error('Error fetching thoughts:', error)
        // Fallback to static data only if Firestore fails
        thoughts.value = treeholeData
    } finally {
        loading.value = false
    }
}

// Set up real-time listener for thoughts
const setupRealtimeListener = () => {
    const thoughtsRef = collection(db, 'treehole')
    const q = query(thoughtsRef, orderBy('createdAt', 'desc'))

    onSnapshot(q, (querySnapshot) => {
        // Get user posts from Firestore and sort by creation time (oldest first)
        const sortedDocs = querySnapshot.docs.sort((a, b) => {
            const aTime = a.data().createdAt?.toDate?.() || new Date(a.data().createdAt)
            const bTime = b.data().createdAt?.toDate?.() || new Date(b.data().createdAt)
            return aTime - bTime // Oldest first
        })

        const userPosts = sortedDocs.map((doc, index) => ({
            id: treeholeData.length + index + 1, // Start IDs after static data, in chronological order
            keyword: doc.data().keyword,
            content: doc.data().content,
            author: doc.data().author,
            createdAt: doc.data().createdAt,
            status: doc.data().status || 'published',
            docId: doc.id, // Keep original document ID
            isUserPost: true // Mark as user-generated content
        }))

        // Combine static data with user posts
        thoughts.value = [...treeholeData, ...userPosts]
        loading.value = false
    }, (error) => {
        console.error('Error in real-time listener:', error)
        // Fallback to static data only if Firestore fails
        thoughts.value = treeholeData
        loading.value = false
    })
}


// Go to specific page
const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

// Reset to page 1 when search changes
watch(searchText, () => {
    currentPage.value = 1
})

// Reset to page 1 when sort changes
watch(sortBy, () => {
    currentPage.value = 1
})

// Initialize data on component mount
onMounted(() => {
    // Set up real-time listener for thoughts
    setupRealtimeListener()

    // Check if we need to restore a specific entry
    const restoreEntry = localStorage.getItem('treehole_restore_entry')
    if (restoreEntry) {
        try {
            const entry = JSON.parse(restoreEntry)
            selectedEntry.value = entry
            localStorage.removeItem('treehole_restore_entry')
        } catch (error) {
            console.error('Error restoring entry:', error)
        }
    }
})

// Generate different classes for word cloud effect - colorful (60 items)
const getKeywordClass = (id) => {
    const classes = [
        'size-large color-blue',      // 1
        'size-medium color-orange',   // 2
        'size-small color-pink',      // 3
        'size-large color-green',     // 4
        'size-medium color-purple',   // 5
        'size-small color-red',       // 6
        'size-large color-teal',      // 7
        'size-medium color-indigo',   // 8
        'size-small color-yellow',    // 9
        'size-large color-gray',      // 10
        'size-medium color-blue',     // 11
        'size-small color-orange',    // 12
        'size-large color-pink',      // 13
        'size-medium color-green',    // 14
        'size-small color-purple',    // 15
        'size-large color-red',       // 16
        'size-medium color-teal',     // 17
        'size-small color-indigo',    // 18
        'size-large color-yellow',    // 19
        'size-medium color-gray',     // 20
        'size-small color-blue',      // 21
        'size-large color-orange',    // 22
        'size-medium color-pink',     // 23
        'size-small color-green',     // 24
        'size-large color-purple',    // 25
        'size-medium color-red',      // 26
        'size-small color-teal',      // 27
        'size-large color-indigo',    // 28
        'size-medium color-yellow',   // 29
        'size-small color-gray',      // 30
        'size-large color-blue',      // 31
        'size-medium color-orange',   // 32
        'size-small color-pink',      // 33
        'size-large color-green',     // 34
        'size-medium color-purple',   // 35
        'size-small color-red',       // 36
        'size-large color-teal',      // 37
        'size-medium color-indigo',   // 38
        'size-small color-yellow',    // 39
        'size-large color-gray',      // 40
        'size-medium color-blue',     // 41
        'size-small color-orange',    // 42
        'size-large color-pink',      // 43
        'size-medium color-green',    // 44
        'size-small color-purple',    // 45
        'size-large color-red',       // 46
        'size-medium color-teal',     // 47
        'size-small color-indigo',    // 48
        'size-large color-yellow',    // 49
        'size-medium color-gray',     // 50
        'size-small color-blue',      // 51
        'size-large color-orange',    // 52
        'size-medium color-pink',     // 53
        'size-small color-green',     // 54
        'size-large color-purple',    // 55
        'size-medium color-red',      // 56
        'size-small color-teal',      // 57
        'size-large color-indigo',    // 58
        'size-medium color-yellow',   // 59
        'size-small color-gray'       // 60
    ]

    return classes[id - 1] || 'size-medium color-blue'
}

onMounted(() => {
    // Check if we need to restore a specific entry from share page
    const restoreEntry = localStorage.getItem('treehole_restore_entry')
    if (restoreEntry) {
        try {
            const entry = JSON.parse(restoreEntry)
            selectedEntry.value = entry
            // Clear the restore flag after use
            localStorage.removeItem('treehole_restore_entry')
        } catch (error) {
            console.error('Error parsing restore entry:', error)
            localStorage.removeItem('treehole_restore_entry')
        }
    }
})
</script>

<style>
/* Global styles to prevent white bars */
body {
    margin: 0 !important;
    padding: 0 !important;
    background: linear-gradient(135deg, #f8d7da 0%, #f0b6c1 25%, #e8a8b8 50%, #e0a0b0 75%, #d898a8 100%) !important;
}

#app {
    padding: 0 !important;
    margin: 0 !important;
    max-width: none !important;
}
</style>

<style scoped>
.treehole-root {
    --nav-h: 64px;
    min-height: 100vh;
    padding: 84px 24px 0;
    background: linear-gradient(135deg, #f8d7da 0%, #f0b6c1 25%, #e8a8b8 50%, #e0a0b0 75%, #d898a8 100%);
    /* Smooth transitions to reduce page jumping */
    transition: all 0.2s ease;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    min-height: 600px;
    position: relative;
}

/* Page Header */
.page-header {
    text-align: center;
    margin-bottom: 60px;
    position: relative;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: #2c3e50;
    margin: 0 0 16px 0;
}

.page-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin: 0 0 20px 0;
}

/* Add Button - Fixed Top Right Position */
.add-button {
    position: fixed;
    top: 100px;
    right: 30px;
    background: none;
    color: #2c3e50;
    border: none;
    padding: 0;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    z-index: 1000;
}

.add-button:hover {
    color: #1a252f;
    opacity: 0.8;
}

.add-icon {
    font-size: 1.1rem;
    font-weight: 900;
}

/* Table Area Styles */
.table-area {
    margin-top: 40px;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.table-title {
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
}

.controls-box {
    display: flex;
    align-items: center;
    gap: 16px;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 8px;
}

.sort-box {
    display: flex;
    align-items: center;
    gap: 8px;
}

.sort-select {
    padding: 12px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    color: #333;
    cursor: pointer;
    transition: border-color 0.2s ease;
}

.sort-select:focus {
    outline: none;
    border-color: #2c3e50;
    box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.1);
}

.sort-select:hover {
    border-color: #2c3e50;
}


.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 300px;
}

.search-icon {
    position: absolute;
    left: 12px;
    color: #666;
    font-size: 14px;
    z-index: 1;
}

.search-input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    transition: border-color 0.2s ease;
}

.search-input:focus {
    outline: none;
    border-color: #2c3e50;
    box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.1);
}

.clear-btn {
    position: absolute;
    right: 8px;
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 18px;
    padding: 4px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-btn:hover {
    color: #333;
}

/* Thoughts Table Styles */
.thoughts-table-container {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
}

.thoughts-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.thoughts-table thead {
    background: #f8f9fa;
}

.thoughts-table th {
    padding: 16px 20px;
    text-align: left;
    font-weight: 600;
    color: #2c3e50;
    border-bottom: 2px solid #e9ecef;
    font-size: 15px;
}

.thoughts-table tbody tr {
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s ease;
}

.thoughts-table tbody tr:hover {
    background-color: #f8f9fa;
}

.thoughts-table tbody tr:last-child {
    border-bottom: none;
}

.thought-row {
    cursor: pointer;
}

.thought-id-cell {
    padding: 16px 20px;
    color: #666;
    font-weight: 500;
    text-align: center;
    min-width: 60px;
}

.thought-keyword-cell {
    padding: 16px 20px;
    font-weight: 600;
    color: #2c3e50;
    font-size: 15px;
    line-height: 1.4;
    max-width: 200px;
}

.thought-preview-cell {
    padding: 16px 20px;
    color: #555;
    line-height: 1.5;
    max-width: 400px;
}

.thought-actions-cell {
    padding: 16px 20px;
    text-align: center;
    min-width: 100px;
}

.read-btn {
    background: #2c3e50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.read-btn:hover {
    background: #1a1f4a;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
    padding: 16px 0;
}

.page-btn {
    background: white;
    border: 1px solid #ddd;
    color: #666;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
    background: #f0f0f0;
    color: #333;
    border-color: #ccc;
}

.page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.page-info {
    color: #666;
    font-size: 14px;
    font-weight: 500;
}


/* Content Area */
.content-area {
    max-width: 1000px;
    margin: 0 auto;
    padding: 50px;
    background: #f8f9fa;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    position: relative;
    min-height: 400px;
}

.content-header {
    margin-bottom: 30px;
}

.back-btn {
    background: none;
    color: #2c3e50;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 700;
    transition: all 0.2s ease;
    display: inline-block;
    position: absolute;
    bottom: 20px;
    right: 20px;
}

.back-btn:hover {
    color: #1a252f;
    opacity: 0.8;
}

.content-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    line-height: 1.3;
    text-align: center;
}

.content-text {
    font-size: 1.3rem;
    line-height: 1.8;
    color: #333;
    text-align: justify;
    margin-bottom: 30px;
}


/* Responsive Design */
@media (max-width: 768px) {
    .page-title {
        font-size: 2rem;
    }

    .keyword-item {
        font-size: 0.9rem;
        padding: 10px 16px;
        max-width: 150px;
    }

    .content-area {
        padding: 30px 20px;
    }

    .content-title {
        font-size: 1.5rem;
    }
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

.loading-container p {
    color: #666666;
    font-size: 1.1rem;
}
</style>
