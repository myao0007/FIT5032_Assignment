<template>
    <div class="ai-floating-container" @click="goToAIConsultation">
        <div class="ai-floating-button">
            <i class="fa-solid fa-robot"></i>
        </div>
        <div class="ai-label">AI Assistant</div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToAIConsultation = () => {
    router.push('/ai-consultation')
}
</script>

<style scoped>
.ai-floating-container {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
}

.ai-floating-button {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #f0b6c1, #e8a8b8);
    color: #2c3e50;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.ai-floating-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, #e8a8b8, #d99bb0);
}

.ai-floating-button:active {
    transform: translateY(-1px);
}

.ai-floating-button i {
    font-size: 24px;
    color: #2c3e50;
}

.ai-label {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    text-align: center;
}


/* Responsive Design */
@media (max-width: 768px) {
    .ai-floating-container {
        bottom: 20px;
        right: 20px;
    }

    .ai-floating-button {
        width: 55px;
        height: 55px;
    }

    .ai-floating-button i {
        font-size: 22px;
    }

    .ai-label {
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .ai-floating-container {
        bottom: 15px;
        right: 15px;
    }

    .ai-floating-button {
        width: 50px;
        height: 50px;
    }

    .ai-floating-button i {
        font-size: 20px;
    }

    .ai-label {
        font-size: 12px;
    }
}
</style>
