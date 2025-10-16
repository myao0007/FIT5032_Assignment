# Layout Components

This folder contains different layout components that can be switched as needed.

## CardLayout.vue

Card layout component for displaying episodes list.

## WordCloudLayout.vue

Word cloud layout component for displaying TreeHole keyword cloud effects.

### Usage:

```vue
<template>
  <CardLayout :currentPageEpisodes="currentPageEpisodes" />
</template>

<script setup>
import CardLayout from '@/components/layouts/CardLayout.vue'
</script>
```

### Props:
- `currentPageEpisodes`: Array - Current page episodes data

### Features:
- Card design, each episode displayed as an independent card
- Hover effects
- Rounded corners and shadow effects
- Responsive layout

## How to Switch Layouts:

1. Import the required layout component in `EchoesDetailView.vue`
2. Replace the layout part in the template
3. Ensure correct props are passed

### Example (Switch back to card layout):

```vue
<!-- Replace table section -->
<CardLayout :currentPageEpisodes="currentPageEpisodes" />
```

### Example (Using table layout):

```vue
<!-- Current table layout -->
<div class="episodes-table-container">
  <table class="episodes-table">
    <!-- Table content -->
  </table>
</div>
```

## WordCloudLayout.vue

Word cloud layout component for displaying TreeHole keyword cloud effects.

### Usage:

```vue
<template>
  <WordCloudLayout 
    :treeholeData="treeholeData"
    :selectedEntry="selectedEntry"
    :selectEntry="selectEntry"
    :goBack="goBack"
  />
</template>

<script setup>
import WordCloudLayout from '@/components/layouts/WordCloudLayout.vue'
</script>
```

### Props:
- `treeholeData`: Array - TreeHole data array
- `selectedEntry`: Object - Currently selected entry (optional)
- `selectEntry`: Function - Function to select entry
- `goBack`: Function - Function to return to word cloud view

### Features:
- Word cloud design, keywords displayed in different sizes and colors
- Click keywords to view full content
- Hover effects and animations
- Responsive layout

### Example (Switch back to word cloud layout):

```vue
<!-- Replace table section -->
<WordCloudLayout 
  :treeholeData="treeholeData"
  :selectedEntry="selectedEntry"
  :selectEntry="selectEntry"
  :goBack="goBack"
/>
```