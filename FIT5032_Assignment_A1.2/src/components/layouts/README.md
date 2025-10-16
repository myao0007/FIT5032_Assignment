# Layout Components

这个文件夹包含了不同的布局组件，可以在需要时切换使用。

## CardLayout.vue

卡片式布局组件，用于显示episodes列表。

## WordCloudLayout.vue

词云式布局组件，用于显示TreeHole的关键词云效果。

### 使用方法：

```vue
<template>
  <CardLayout :currentPageEpisodes="currentPageEpisodes" />
</template>

<script setup>
import CardLayout from '@/components/layouts/CardLayout.vue'
</script>
```

### Props:
- `currentPageEpisodes`: Array - 当前页的episodes数据

### 特点：
- 卡片式设计，每个episode显示为一个独立的卡片
- 悬停效果
- 圆角和阴影效果
- 响应式布局

## 如何切换布局：

1. 在 `EchoesDetailView.vue` 中导入需要的布局组件
2. 替换模板中的布局部分
3. 确保传递正确的props

### 示例（切换回卡片布局）：

```vue
<!-- 替换表格部分 -->
<CardLayout :currentPageEpisodes="currentPageEpisodes" />
```

### 示例（使用表格布局）：

```vue
<!-- 当前的表格布局 -->
<div class="episodes-table-container">
  <table class="episodes-table">
    <!-- 表格内容 -->
  </table>
</div>
```

## WordCloudLayout.vue

词云式布局组件，用于显示TreeHole的关键词云效果。

### 使用方法：

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
- `treeholeData`: Array - TreeHole数据数组
- `selectedEntry`: Object - 当前选中的条目（可选）
- `selectEntry`: Function - 选择条目的函数
- `goBack`: Function - 返回词云视图的函数

### 特点：
- 词云式设计，关键词以不同大小和颜色显示
- 点击关键词查看完整内容
- 悬停效果和动画
- 响应式布局

### 示例（切换回词云布局）：

```vue
<!-- 替换表格部分 -->
<WordCloudLayout 
  :treeholeData="treeholeData"
  :selectedEntry="selectedEntry"
  :selectEntry="selectEntry"
  :goBack="goBack"
/>
```
