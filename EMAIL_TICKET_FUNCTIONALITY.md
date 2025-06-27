# Email Ticket Functionality

This document explains how the email ticket sending functionality works in the Motojojo Events application.

## Overview

When users book tickets for events, they automatically receive their tickets via email. The system also supports resending tickets if needed.

## How It Works

### 1. Automatic Email Sending

Tickets are automatically sent via email in two scenarios:

#### A. Razorpay Payment Flow
- When users complete payment through Razorpay
- Email is sent immediately after successful payment and ticket generation
- Located in: `src/components/ui/RazorpayButton.tsx`

#### B. Cart Checkout Flow
- When users checkout from their cart
- Email is sent after successful booking creation
- Located in: `src/services/bookingService.ts` - `createBookingFromCart` function

### 2. Manual Email Resending

Users can resend their tickets via email in two ways:

#### A. From Booking Cards
- "Resend Email" button on each booking card in the Profile page
- Located in: `src/pages/Profile.tsx`

#### B. From Ticket Dialog
- "Resend Email" button in the ticket viewing dialog
- Located in: `src/pages/Profile.tsx`

## Email Template

The email template is located in: `supabase/functions/send-ticket/index.ts`

### Features:
- Professional HTML design with Motojojo branding
- Event details section
- Individual ticket cards with QR codes
- Important information and instructions
- Contact information
- Responsive design

### Email Content Includes:
- Event title, date, time, and venue
- Ticket numbers and QR codes
- Entry instructions
- Contact information
- Branding and styling

## Technical Implementation

### Supabase Edge Function
- Function name: `send-ticket`
- Uses Resend email service
- Handles CORS and error responses
- Generates professional HTML emails

### Frontend Integration
- Uses Supabase client to invoke the edge function
- Handles success and error states
- Shows toast notifications to users
- Graceful error handling (doesn't break booking flow)

### Data Flow
1. User completes booking/payment
2. Tickets are generated with QR codes
3. Event details are fetched
4. Email function is invoked with ticket data
5. User receives email with tickets
6. Success notification is shown

## Error Handling

- Email sending failures don't break the booking process
- Users are notified if email sending fails
- Retry functionality available through "Resend Email" buttons
- Detailed error logging for debugging

## Configuration

### Environment Variables Required:
- `RESEND_API_KEY` - API key for Resend email service
- Supabase project configuration

### Email Settings:
- From: "Motojojo Events <info@motojojo.co>"
- Subject: "Your tickets for [Event Title]"
- HTML template with responsive design

## User Experience

### Success Flow:
1. User books tickets
2. Payment is processed
3. Tickets are generated
4. Email is sent automatically
5. User sees success message mentioning email
6. User can view tickets in profile
7. User can resend email if needed

### Email Features:
- Professional design matching brand
- Clear event information
- Easy-to-scan QR codes
- Important instructions
- Contact information for support

## Testing

To test the email functionality:
1. Complete a booking through Razorpay or cart checkout
2. Check the provided email address for the ticket email
3. Use the "Resend Email" button to test manual resending
4. Verify QR codes are generated and included

## Future Enhancements

Potential improvements:
- Email templates for different event types
- SMS notifications as backup
- Calendar integration (add to calendar)
- Social sharing options
- Email tracking and analytics 