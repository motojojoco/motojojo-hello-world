# Motojojo Events Platform

A comprehensive event management platform built with React, TypeScript, and Supabase, featuring ticket booking, QR code scanning, and automated email delivery with PDF tickets.

## 🚀 Features

### Core Features
- **Event Management**: Create, manage, and display events
- **Ticket Booking**: Secure payment processing with Razorpay
- **QR Code Tickets**: Unique QR codes for each ticket
- **Real-time Updates**: Live booking and attendance tracking
- **User Authentication**: Secure user management with Supabase Auth

### Email & PDF Features
- **Automated Email Delivery**: Sends PDF tickets via Amazon SES when tickets are booked
- **Professional PDF Tickets**: Beautiful, print-ready ticket designs
- **Multiple Ticket Support**: Individual tickets for each attendee
- **QR Code Integration**: QR codes embedded in PDF tickets
- **Fallback Email System**: HTML emails via Resend as backup

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching

### Backend
- **Supabase** for database and authentication
- **Supabase Edge Functions** for serverless functions
- **Node.js** for email service
- **AWS SES** for email delivery
- **Puppeteer** for PDF generation

### Payment & Integration
- **Razorpay** for payment processing
- **QR Code API** for ticket generation
- **Resend** for fallback email delivery

## 📧 Email Service Setup

The platform includes an automated email service that sends PDF tickets when users book events.

### Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp env.template .env
   # Edit .env with your AWS SES and other credentials
   ```

3. **Start the Email Service**
   ```bash
   npm run email-service
   ```

4. **Test the Email Service**
   ```bash
   npm run test-email
   ```

### AWS SES Configuration

1. **Verify your domain** in AWS SES Console
2. **Create SMTP credentials** for sending emails
3. **Set environment variables**:
   ```bash
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=ap-south-1
   ```

### Email Service Features

- **PDF Generation**: Creates professional PDF tickets with QR codes
- **Multiple Tickets**: Supports multiple tickets per booking
- **Attendee Names**: Individual names for each ticket
- **Professional Design**: Motojojo branding and styling
- **Print Optimized**: Ready for printing at venues

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- AWS Account with SES configured
- Supabase Project
- Razorpay Account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mojo-event-verse1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.template .env
   # Edit .env with your credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Start email service** (in another terminal)
   ```bash
   npm run email-service
   ```

## 📁 Project Structure

```
mojo-event-verse1/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── hooks/              # Custom hooks
│   └── store/              # State management
├── supabase/
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
├── emailService.js         # Email service with PDF generation
├── test-email-service.js   # Email service test script
└── EMAIL_SERVICE_SETUP.md  # Detailed email setup guide
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# AWS SES Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1

# Email Service
EMAIL_SERVICE_URL=http://localhost:3001
RESEND_API_KEY=your_resend_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

### Supabase Setup

1. **Create a new Supabase project**
2. **Run migrations** from `supabase/migrations/`
3. **Deploy edge functions**:
   ```bash
   supabase functions deploy send-ticket
   ```

## 📧 Email Service API

### Endpoints

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
  "ticketNumbers": ["MJ-1234567890-001"],
  "qrCodes": ["https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MJ-1234567890-001"],
  "ticketHolderNames": ["John Doe"]
}
```

#### GET `/health`
Health check endpoint

## 🧪 Testing

### Test Email Service
```bash
npm run test-email
```

### Test Supabase Functions
```bash
supabase functions serve
# Test via Supabase dashboard
```

## 📚 Documentation

- [Email Service Setup Guide](EMAIL_SERVICE_SETUP.md)
- [Ticket Preview Functionality](TICKET_PREVIEW_FUNCTIONALITY.md)
- [Email Ticket Functionality](EMAIL_TICKET_FUNCTIONALITY.md)

## 🚀 Deployment

### Frontend
Deploy to Vercel, Netlify, or any static hosting service.

### Email Service
Deploy to:
- AWS EC2
- AWS Lambda
- Vercel
- Railway
- Heroku

### Supabase
Deploy edge functions:
```bash
supabase functions deploy send-ticket
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@motojojo.co
- Documentation: Check the docs folder
- Issues: Create an issue on GitHub

## 🔄 Recent Updates

- ✅ Added PDF ticket generation with AWS SES
- ✅ Integrated email service with booking flow
- ✅ Enhanced ticket design with QR codes
- ✅ Added comprehensive testing scripts
- ✅ Improved error handling and logging
