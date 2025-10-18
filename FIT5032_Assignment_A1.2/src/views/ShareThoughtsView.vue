<template>
    <div class="share-thoughts-root">
        <div class="container">
            <!-- Page Header -->
            <div class="page-header">
                <h1 class="page-title">Share Your Thoughts</h1>
                <p class="page-subtitle">Share your feelings and experiences with the community</p>
            </div>

            <!-- Share Form -->
            <div class="form-container">
                <form @submit.prevent="submitThought">
                    <div class="form-group">
                        <label for="keyword">Keyword:</label>
                        <input type="text" id="keyword" v-model="formData.keyword"
                            placeholder="Enter your keyword or phrase" required />
                    </div>

                    <div class="form-group">
                        <label for="content">Your Thoughts:</label>
                        <textarea id="content" v-model="formData.content"
                            placeholder="Share your thoughts and feelings..." rows="8" required></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="button" @click="goBack" class="cancel-btn"
                            :disabled="isSubmitting">Cancel</button>
                        <button type="submit" class="submit-btn" :disabled="isSubmitting">
                            <span v-if="isSubmitting">Sharing...</span>
                            <span v-else>Share</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { db } from '@/firebase/config.js'
import { authComputed } from '@/store/userAuth.js'

const router = useRouter()
const route = useRoute()

// Form data
const formData = ref({
    keyword: '',
    content: ''
})

// Loading state
const isSubmitting = ref(false)

// Submit function
const submitThought = async () => {
    if (!formData.value.keyword.trim() || !formData.value.content.trim()) {
        alert('Please fill in both keyword and content fields.')
        return
    }

    if (!authComputed.isAuthenticated.value) {
        alert('Please log in to share your thoughts.')
        return
    }

    isSubmitting.value = true

    try {
        // Step 1: Content moderation
        console.log('Starting content moderation...')
        const functions = getFunctions()
        const moderateContent = httpsCallable(functions, 'moderateTreeHoleContent')

        const moderationResult = await moderateContent({
            content: formData.value.content.trim(),
            userId: authComputed.user.value?.uid || 'anonymous'
        })

        console.log('Content moderation result:', moderationResult.data)

        // Step 2: Handle moderation result
        if (moderationResult.data.action === 'rejected') {
            alert(`Your post was not approved: ${moderationResult.data.reason}`)
            isSubmitting.value = false
            return
        } else if (moderationResult.data.action === 'needs_revision') {
            const suggestions = moderationResult.data.suggestions.join('\n• ')
            const userChoice = confirm(
                `Your post needs minor adjustments:\n\n• ${suggestions}\n\nWould you like to revise it or submit anyway?`
            )

            if (!userChoice) {
                isSubmitting.value = false
                return
            }
        }

        // Step 3: Save to Firestore if approved
        const docRef = await addDoc(collection(db, 'treehole'), {
            keyword: formData.value.keyword.trim(),
            content: formData.value.content.trim(),
            author: authComputed.userEmail.value,
            createdAt: serverTimestamp(),
            moderationStatus: moderationResult.data.action,
            riskLevel: moderationResult.data.riskLevel
        })

        console.log('Tree Hole post saved with ID:', docRef.id)

        // Show appropriate success message
        if (moderationResult.data.action === 'approved') {
            alert('Thank you for sharing your thoughts! Your post has been published.')
        } else {
            alert('Thank you for sharing your thoughts! Your post has been submitted for review.')
        }

        // Clear form
        formData.value.keyword = ''
        formData.value.content = ''

        // Go back to Tree Hole page
        goBack()
    } catch (error) {
        console.error('Error saving Tree Hole post:', error)
        if (error.message.includes('moderateTreeHoleContent')) {
            alert('Content moderation service is temporarily unavailable. Please try again later.')
        } else {
            alert('Sorry, there was an error saving your thoughts. Please try again.')
        }
    } finally {
        isSubmitting.value = false
    }
}

// Go back to previous page or Tree Hole page
const goBack = () => {
    // Check if user came from a specific card view using localStorage
    const savedState = localStorage.getItem('treehole_previous_state')
    if (savedState) {
        try {
            const state = JSON.parse(savedState)
            if (state.fromCard && state.currentEntry) {
                // Set a flag to restore the card view
                localStorage.setItem('treehole_restore_entry', JSON.stringify(state.currentEntry))
            }
        } catch (error) {
            console.error('Error parsing saved state:', error)
        }
    }

    // Always go back to Tree Hole page
    router.push('/treehole')
}
</script>

<style>
/* Override global styles for this page */
body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
}

#app {
    padding: 0 !important;
    margin: 0 !important;
    max-width: none !important;
}

/* Ensure no pink background anywhere */
html,
body,
#app,
.share-thoughts-root {
    background: white !important;
}

/* Override main.css styles */
@media (min-width: 1024px) {
    body {
        display: block !important;
        place-items: unset !important;
    }

    #app {
        display: block !important;
        grid-template-columns: none !important;
        padding: 0 !important;
    }
}
</style>

<style scoped>
.share-thoughts-root {
    --nav-h: 64px;
    min-height: calc(100vh - var(--nav-h));
    padding: 84px 24px 0;
    background: white;
    margin-bottom: 0;
}

.container {
    max-width: 600px;
    margin: 0 auto;
}

/* Page Header */
.page-header {
    text-align: center;
    margin-bottom: 60px;
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
    margin: 0;
}

/* Form Container */
.form-container {
    background: #f8f9fa;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 25px;
}

.form-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: #333;
    font-size: 1.1rem;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #2c3e50;
}

.form-group textarea {
    resize: vertical;
    min-height: 150px;
    line-height: 1.6;
}

.form-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 30px;
}

.cancel-btn {
    background: #f5f5f5;
    color: #666;
    border: none;
    padding: 12px 24px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: background 0.3s ease;
}

.cancel-btn:hover {
    background: #e0e0e0;
}

.submit-btn {
    background: #2c3e50;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: background 0.3s ease;
}

.submit-btn:hover {
    background: #1a252f;
}

/* Responsive Design */
@media (max-width: 768px) {
    .page-title {
        font-size: 2rem;
    }

    .form-container {
        padding: 30px 20px;
    }

    .form-actions {
        flex-direction: column;
    }

    .cancel-btn,
    .submit-btn {
        width: 100%;
    }
}
</style>
