# Email Service Setup Guide

This guide explains how to set up the email service for sending PDF tickets via Amazon SES when new tickets are booked.

## Overview

The email service consists of two components:
1. **Node.js Email Service** (`emailService.js`) - Generates PDF tickets and sends them via AWS SES
2. **Supabase Edge Function** (`supabase/functions/send-ticket/index.ts`) - Integrates with the booking flow

## Prerequisites

1. **AWS Account** with SES configured
2. **Node.js** (v16 or higher)
3. **Supabase Project** with edge functions enabled

## AWS SES Setup

### 1. Configure AWS SES

1. Go to AWS SES Console
2. Verify your domain (motojojo.co) or email address
3. Request production access if needed
4. Create SMTP credentials

### 2. Set Environment Variables

Create a `.env` file in your project root:

```bash
# AWS SES Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=ap-south-1

# Email Service Configuration
EMAIL_SERVICE_URL=http://localhost:3001
RESEND_API_KEY=your_resend_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

## Running the Email Service

### Development Mode

1. Start the email service:
```bash
npm run email-service
```

2. The service will run on `http://localhost:3001`

### Production Deployment

For production, you can deploy the email service to:
- AWS EC2
- AWS Lambda
- Vercel
- Railway
- Heroku

## How It Works

### 1. Booking Flow Integration

When a user books tickets:

1. **Razorpay Payment** → `RazorpayButton.tsx`
2. **Cart Checkout** → `bookingService.ts`
3. **Ticket Generation** → Creates tickets in database
4. **Email Trigger** → Calls Supabase edge function
5. **PDF Generation** → Node.js service generates PDF
6. **Email Delivery** → AWS SES sends email with PDF attachment

### 2. Email Service Endpoints

#### POST `/send-ticket`
Sends PDF tickets via email

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "eventTitle": "Summer Music Festival",
  "eventDate": "2024-06-15",
  "eventTime": "7:00 PM",
  "eventVenue": "Central Park, Mumbai",
  "ticketNumbers": ["MJ-1234567890-001", "MJ-1234567890-002"],
  "qrCodes": ["https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MJ-1234567890-001"],
  "ticketHolderNames": ["John Doe", "Jane Doe"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket email sent successfully",
  "recipient": "user@example.com",
  "event": "Summer Music Festival"
}
```

#### GET `/health`
Health check endpoint

**Response:**
```json
{
  "status": "OK",
  "service": "Email Service"
}
```

### 3. PDF Ticket Features

The generated PDF includes:
- **Event Details**: Title, date, time, venue
- **Individual Tickets**: Each with unique QR code
- **Attendee Names**: For multiple tickets
- **Professional Design**: Motojojo branding
- **Important Information**: Entry instructions
- **Print Optimized**: Ready for printing

## Configuration Options

### Email Service Configuration

You can customize the email service by modifying `emailService.js`:

```javascript
// PDF Generation Settings
const pdfOptions = {
  format: 'A4',
  printBackground: true,
  margin: {
    top: '20px',
    right: '20px',
    bottom: '20px',
    left: '20px'
  }
};

// Email Settings
const emailSettings = {
  from: 'Motojojo Events <info@motojojo.co>',
  subject: `Your tickets for ${eventTitle}`,
  // ... other settings
};
```

### Supabase Edge Function Configuration

Configure the edge function in `supabase/functions/send-ticket/index.ts`:

```typescript
// Environment variables
const EMAIL_SERVICE_URL = Deno.env.get("EMAIL_SERVICE_URL") || "http://localhost:3001";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
```

## Testing

### 1. Test Email Service Locally

```bash
# Start the service
npm run email-service

# Test with curl
curl -X POST http://localhost:3001/send-ticket \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "eventTitle": "Test Event",
    "eventDate": "2024-12-25",
    "eventTime": "7:00 PM",
    "eventVenue": "Test Venue, Test City",
    "ticketNumbers": ["TEST-001"],
    "qrCodes": ["https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TEST-001"],
    "ticketHolderNames": ["Test User"]
  }'
```

### 2. Test Supabase Edge Function

```bash
# Deploy the function
supabase functions deploy send-ticket

# Test via Supabase dashboard or API
```

## Troubleshooting

### Common Issues

1. **AWS SES Not Sending Emails**
   - Check AWS credentials
   - Verify domain/email in SES
   - Check SES sending limits

2. **PDF Generation Fails**
   - Ensure Puppeteer is installed
   - Check system dependencies
   - Verify HTML template

3. **Email Service Not Responding**
   - Check if service is running
   - Verify port configuration
   - Check logs for errors

### Logs

The email service provides detailed logging:

```bash
# Service startup
Email service running on port 3001
Ready to send ticket emails with PDF attachments via AWS SES

# Successful email
Ticket email sent successfully to user@example.com for event: Summer Music Festival

# Error logging
Error sending ticket email: [error details]
```

## Security Considerations

1. **AWS Credentials**: Store securely, never commit to version control
2. **CORS**: Configure properly for production
3. **Rate Limiting**: Implement to prevent abuse
4. **Input Validation**: Validate all email inputs
5. **Error Handling**: Don't expose sensitive information in errors

## Monitoring

### Health Checks

Monitor the service health:

```bash
curl http://localhost:3001/health
```

### Email Delivery Tracking

Track email delivery via AWS SES console:
- Bounce rates
- Complaint rates
- Delivery rates

## Cost Optimization

1. **AWS SES**: Very cost-effective for email delivery
2. **Puppeteer**: Consider using headless Chrome in production
3. **Caching**: Cache generated PDFs for repeated requests
4. **Batch Processing**: Process multiple emails in batches

## Support

For issues or questions:
- Check the logs for error details
- Verify AWS SES configuration
- Test with minimal data first
- Contact support at support@motojojo.co 