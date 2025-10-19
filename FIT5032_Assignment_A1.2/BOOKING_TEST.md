# Booking Functionality Testing Guide

## 🧪 Testing Steps

### 1. Start Application
```bash
npm run dev
```
Access: http://localhost:5173

### 2. Test Booking Functionality

#### Step 1: Access Event Page
1. Navigate to `/live` page
2. Click any event to enter event detail page

#### Step 2: Click Booking Button
1. On event detail page, find "Book This Event" button
2. Click button, should navigate to booking page (`/booking/:id`)

#### Step 3: Fill Booking Form
1. View FullCalendar calendar display
2. Fill out booking form:
   - **Name**: Enter your name
   - **Email**: Enter valid email address
   - **Phone**: Optional, enter phone number
   - **Special Requirements**: Optional, enter any special requirements
   - **Agree to Terms**: Must be checked

#### Step 4: Submit Booking
1. Click "Confirm Booking" button
2. System should display loading state
3. Show confirmation message after successful booking

## 🔍 Function Verification

### FullCalendar.io API Integration
- ✅ Calendar correctly displays events
- ✅ Events display at correct date and time
- ✅ Calendar views can be switched (month/week view)
- ✅ Clicking events has response

### Booking Form
- ✅ Required field validation
- ✅ Email format validation
- ✅ Form submission handling
- ✅ Loading state display

### Data Validation
- ✅ Duplicate booking check
- ✅ Event capacity check
- ✅ Data format validation

## 🐛 Common Issues

### Issue 1: FullCalendar Not Displaying
**Solution**: Check console for JavaScript errors

### Issue 2: Booking Submission Failed
**Solution**: 
1. Check Firestore connection
2. Check network connection
3. View browser console errors

### Issue 3: Route Navigation Failed
**Solution**: Check if route configuration is correct

## 📊 Test Data

### Test Events
- **Event 1**: Reconnecting with Yourself – Healing Workshop
  - Date: Oct 23, 2025
  - Time: 7:00 pm – 9:00 pm
  - Location: 1 St Heliers St, Abbotsford VIC 3067

### Test User Information
- **Name**: Test User
- **Email**: test@example.com
- **Phone**: +61 123 456 789

## 🎯 Expected Results

1. **Booking Button**: Visible on event detail page
2. **Booking Page**: Loads correctly, displays calendar and form
3. **FullCalendar**: Shows event on correct date
4. **Form Submission**: Successfully saves to Firestore
5. **Success Message**: Displays booking confirmation information

## 🔧 Debug Information

### Console Logs
Booking functionality will output the following information in console:
- `Booking data:` - Booking data
- `Booking created with ID:` - Booking ID
- `Event clicked:` - Information when clicking events

### Firestore Data
Booking data will be saved to `bookings` collection, containing:
- `eventId`: Event ID
- `eventTitle`: Event title
- `attendeeInfo`: Attendee information
- `status`: Booking status
- `createdAt`: Creation time

## 🚀 Deployment Testing

### Local Testing
1. Ensure Firebase project is configured
2. Ensure Firestore database is enabled
3. Test if booking functionality works normally

### Production Environment Testing
1. Deploy to Firebase Hosting
2. Test booking functionality
3. Verify data is correctly saved

## 📝 Test Report Template

```
Test Date: [Date]
Test Personnel: [Name]
Test Environment: [Local/Production]

Function Testing:
- [ ] Booking button display
- [ ] Booking page loading
- [ ] FullCalendar display
- [ ] Form validation
- [ ] Booking submission
- [ ] Success message display

Issue Records:
- [Issue Description]
- [Solution]

Overall Evaluation:
[Pass/Fail]
```

## 🎉 Success Criteria

Booking functionality is considered successfully implemented when:
1. Users can click booking button
2. Booking page loads correctly and displays calendar
3. FullCalendar correctly displays events
4. Users can fill and submit booking form
5. Booking data correctly saves to Firestore
6. Users receive booking confirmation message