<template>
    <div class="treehole-root">
        <div class="container">
        <!-- Page Title -->
        <div class="page-header">
            <h1 class="page-title">Tree Hole</h1>
            <p class="page-subtitle">Click on any keyword to read someone's thoughts</p>
        </div>

        <!-- Add Button in Top Right Corner -->
        <button @click="goToSharePage" class="add-button">
            <span class="add-icon">+</span>
            Share Your Thoughts
        </button>

        <!-- Keywords Area - Horizontal Flow Style -->
        <div class="keywords-area" v-if="!selectedEntry">
            <div 
                v-for="entry in treeholeData" 
                :key="entry.id"
                class="keyword-item flow-item"
                :class="getKeywordClass(entry.id)"
                @click="selectEntry(entry)"
            >
                {{ entry.keyword }}
            </div>
        </div>

            <!-- Content Area -->
            <div class="content-area" v-if="selectedEntry">
                <div class="content-header">
                    <h2 class="content-title">{{ selectedEntry.keyword }}</h2>
                </div>
                <div class="content-text">
                    {{ selectedEntry.content }}
                </div>
                <button @click="goBack" class="back-btn">← Go Back</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import treeholeData from '@/data/treehole-data.json'

const router = useRouter()
const route = useRoute()

// Reactive data
const selectedEntry = ref(null)

// Select an entry to show content
const selectEntry = (entry) => {
    selectedEntry.value = entry
}

// Go back to keywords view
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

// No need for position generation with flow layout

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

<style scoped>
.treehole-root {
    --nav-h: 64px;
    min-height: calc(100vh - var(--nav-h));
    padding: 84px 24px 24px;
    background: white;
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
    color: #262c67;
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
    color: #262c67;
    border: none;
    padding: 0;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;
    z-index: 1000;
}

.add-button:hover {
    color: #1a1f4a;
    opacity: 0.8;
}

.add-icon {
    font-size: 1.1rem;
    font-weight: 900;
}

/* Keywords Area - Natural Flow Style */
.keywords-area {
    width: 100%;
    background: white;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    align-items: baseline;
    justify-content: flex-start;
    line-height: 2.4;
    text-align: left;
    align-content: flex-start;
}

.flow-item {
    display: inline-block;
    padding: 2px 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    margin: 2px 1px;
    vertical-align: baseline;
}

/* Different sizes for natural flow layout */
.size-large {
    font-size: 1.4rem;
    margin-top: -2px;
}

.size-medium {
    font-size: 1.1rem;
    margin-top: 1px;
}

.size-small {
    font-size: 0.85rem;
    margin-top: 3px;
}

/* Different colors - only text colors */
.color-blue {
    color: #1976d2;
}

.color-orange {
    color: #f57c00;
}

.color-pink {
    color: #c2185b;
}

.color-green {
    color: #388e3c;
}

.color-purple {
    color: #7b1fa2;
}

.color-red {
    color: #d32f2f;
}

.color-teal {
    color: #00796b;
}

.color-indigo {
    color: #303f9f;
}

.color-yellow {
    color: #f9a825;
}

.color-gray {
    color: #616161;
}

/* Hover effects for flow items */
.flow-item:hover {
    transform: scale(1.05);
    opacity: 0.8;
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
    color: #262c67;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 700;
    transition: opacity 0.3s ease;
    display: inline-block;
    position: absolute;
    bottom: 20px;
    right: 20px;
}

.back-btn:hover {
    opacity: 0.7;
}

.content-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #262c67;
    margin: 0;
    line-height: 1.3;
    text-align: center;
}

.content-text {
    font-size: 1.3rem;
    line-height: 1.8;
    color: #333;
    text-align: justify;
    margin-bottom: 60px;
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
</style>
