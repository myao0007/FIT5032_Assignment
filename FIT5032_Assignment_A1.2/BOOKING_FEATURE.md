# Event Booking Feature

## 🎯 Feature Overview

This booking system allows users to book SheTalks community events. Users can click the "Book This Event" button on event detail pages, fill out booking forms, and confirm bookings.

## 🚀 Main Features

### 1. Booking Button
- Added "Book This Event" button in `EventDetailView.vue`
- Clicking navigates to booking page (`/booking/:id`)

### 2. Booking Page (`BookingView.vue`)
- **FullCalendar.io Integration**: Shows event position in calendar
- **Event Detail Card**: Displays basic event information
- **Booking Form**: Collects user information
  - Name (required)
  - Email (required)
  - Phone (optional)
  - Special Requirements (optional)
  - Agree to Terms (required)

### 3. Booking Logic (`BookingService.js`)
- **Data Validation**: Validates form data format
- **Duplicate Booking Check**: Prevents users from booking the same event twice
- **Capacity Check**: Checks if event has available spots
- **Data Storage**: Saves booking data to Firestore

### 4. FullCalendar.io API Integration
- **EventCalendar.vue Component**: Shows event position in calendar
- **Event Clicking**: Users can click events in calendar
- **Responsive Design**: Adapts to mobile devices

## 📁 File Structure

```
src/
├── views/
│   ├── EventDetailView.vue          # Event detail page (added booking button)
│   ├── BookingView.vue              # Booking page
│   └── BookingSuccessView.vue       # Booking success page
├── components/
│   └── EventCalendar.vue            # FullCalendar component
├── services/
│   └── bookingService.js            # Booking service
└── router/
    └── index.js                     # Route configuration
```

## 🔧 Technical Implementation

### Route Configuration
```javascript
{ path: '/booking/:id', name: 'booking', component: BookingView }
```

### Booking Data Model
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

### FullCalendar Configuration
```javascript
const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  selectable: false,        // Disable selection
  editable: false,         // Disable editing
  events: [eventData]      // Display events
}
```

## 🎨 User Experience

### Booking Process
1. User clicks "Book This Event" on event detail page
2. Navigate to booking page, see calendar and event details
3. Fill out booking form
4. Click "Confirm Booking" to confirm booking
5. System validates data and saves to Firestore
6. Display success message and navigate

### Validation Mechanism
- **Form Validation**: Required field checks
- **Email Format**: Regular expression validation
- **Duplicate Booking**: Check if user already booked
- **Capacity Limit**: Check if event is full

## 🔒 Security Features

- **Data Validation**: Frontend and backend dual validation
- **Duplicate Booking Protection**: Prevent same user from booking twice
- **Capacity Control**: Limit maximum participants per event
- **Error Handling**: Complete error prompts and handling

## 📱 Responsive Design

- **Mobile Adaptation**: Forms and calendar optimized for mobile devices
- **Touch Friendly**: Buttons and input fields suitable for touch operation
- **Loading State**: Display loading animation when submitting

## 🚀 Deployment Instructions

1. **Install Dependencies**:
   ```bash
   npm install @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
   ```

2. **Firebase Configuration**: Ensure Firestore database is configured

3. **Route Configuration**: Booking page routes added to `router/index.js`

## 🎯 Using FullCalendar.io API

This implementation uses the following FullCalendar.io API features:
- **Event Display**: Display events in calendar
- **Interaction Features**: Handle user clicking events
- **View Switching**: Month and week views
- **Responsive**: Adapt to different screen sizes

**Note**: This implementation doesn't use complex time slot selection features, but simply displays fixed-time events, meeting the requirement that "event times are fixed".

## 🔄 Future Extensions

- **Email Notifications**: Send booking confirmation emails
- **Booking Management**: Users view and manage their bookings
- **Waitlist**: Waiting mechanism when events are full
- **Cancel Booking**: Allow users to cancel bookings