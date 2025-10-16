# 事件预约功能 (Event Booking Feature)

## 🎯 功能概述

这个预约系统允许用户预约 SheTalks 社区的活动。用户可以在事件详情页面点击"Book This Event"按钮，填写预约表单，并确认预约。

## 🚀 主要功能

### 1. 预约按钮
- 在 `EventDetailView.vue` 中添加了"Book This Event"按钮
- 点击后跳转到预约页面 (`/booking/:id`)

### 2. 预约页面 (`BookingView.vue`)
- **FullCalendar.io 集成**: 显示事件在日历中的位置
- **事件详情卡片**: 显示事件的基本信息
- **预约表单**: 收集用户信息
  - 姓名 (必填)
  - 邮箱 (必填)
  - 电话 (可选)
  - 特殊要求 (可选)
  - 同意条款 (必填)

### 3. 预约逻辑 (`BookingService.js`)
- **数据验证**: 验证表单数据格式
- **重复预约检查**: 防止用户重复预约同一事件
- **容量检查**: 检查事件是否还有空位
- **数据存储**: 将预约数据保存到 Firestore

### 4. FullCalendar.io API 集成
- **EventCalendar.vue 组件**: 显示事件在日历中的位置
- **事件点击**: 用户可以点击日历中的事件
- **响应式设计**: 适配移动设备

## 📁 文件结构

```
src/
├── views/
│   ├── EventDetailView.vue          # 事件详情页面 (添加预约按钮)
│   ├── BookingView.vue              # 预约页面
│   └── BookingSuccessView.vue       # 预约成功页面
├── components/
│   └── EventCalendar.vue            # FullCalendar 组件
├── services/
│   └── bookingService.js            # 预约服务
└── router/
    └── index.js                     # 路由配置
```

## 🔧 技术实现

### 路由配置
```javascript
{ path: '/booking/:id', name: 'booking', component: BookingView }
```

### 预约数据模型
```javascript
{
  eventId: number,
  eventTitle: string,
  eventDate: string,
  eventTime: string,
  eventLocation: string,
  attendeeInfo: {
    name: string,
    email: string,
    phone: string
  },
  notes: string,
  status: 'confirmed',
  createdAt: Date
}
```

### FullCalendar 配置
```javascript
const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  selectable: false,        // 禁用选择功能
  editable: false,         // 禁用编辑功能
  events: [eventData]      // 显示事件
}
```

## 🎨 用户体验

### 预约流程
1. 用户在事件详情页面点击"Book This Event"
2. 跳转到预约页面，看到日历和事件详情
3. 填写预约表单
4. 点击"Confirm Booking"确认预约
5. 系统验证数据并保存到 Firestore
6. 显示成功消息并跳转

### 验证机制
- **表单验证**: 必填字段检查
- **邮箱格式**: 正则表达式验证
- **重复预约**: 检查用户是否已预约
- **容量限制**: 检查事件是否已满

## 🔒 安全特性

- **数据验证**: 前后端双重验证
- **重复预约防护**: 防止同一用户重复预约
- **容量控制**: 限制每个事件的最大参与人数
- **错误处理**: 完善的错误提示和处理

## 📱 响应式设计

- **移动端适配**: 表单和日历在移动设备上优化显示
- **触摸友好**: 按钮和输入框适合触摸操作
- **加载状态**: 提交时显示加载动画

## 🚀 部署说明

1. **安装依赖**:
   ```bash
   npm install @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
   ```

2. **Firebase 配置**: 确保 Firestore 数据库已配置

3. **路由配置**: 预约页面路由已添加到 `router/index.js`

## 🎯 使用 FullCalendar.io API

这个实现使用了 FullCalendar.io API 的以下功能：
- **事件显示**: 在日历中显示事件
- **交互功能**: 用户点击事件时的处理
- **视图切换**: 月视图和周视图
- **响应式**: 适配不同屏幕尺寸

**注意**: 这个实现没有使用复杂的时间段选择功能，而是简单地显示固定时间的事件，符合"事件时间是固定的"这一需求。

## 🔄 未来扩展

- **邮件通知**: 发送预约确认邮件
- **预约管理**: 用户查看和管理自己的预约
- **等待列表**: 当事件满员时的等待机制
- **取消预约**: 允许用户取消预约

