#!/usr/bin/env node

/**
 * Test script for the email service
 * Run this to test PDF ticket generation and email sending
 */

const testEmailService = async () => {
  const testData = {
    email: "amanlabh4@gmail.com", // Replace with your test email
    name: "Test User",
    eventTitle: "Summer Music Festival 2024",
    eventDate: "2024-06-15",
    eventTime: "7:00 PM",
    eventVenue: "Central Park Amphitheater, Mumbai",
    ticketNumbers: [
      "MJ-1234567890-001",
      "MJ-1234567890-002"
    ],
    qrCodes: [
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MJ-1234567890-001",
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MJ-1234567890-002"
    ],
    ticketHolderNames: ["Test User", "Jane Doe"]
  };

  try {
    console.log("🚀 Testing Email Service...");
    console.log("📧 Sending test email to:", testData.email);
    console.log("🎫 Event:", testData.eventTitle);
    console.log("📅 Date:", testData.eventDate);
    console.log("⏰ Time:", testData.eventTime);
    console.log("📍 Venue:", testData.eventVenue);
    console.log("🎟️ Tickets:", testData.ticketNumbers.length);
    console.log("");

    const response = await fetch("http://localhost:3001/send-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ Email service test successful!");
      console.log("📨 Email sent to:", result.recipient);
      console.log("🎫 Event:", result.event);
      console.log("💬 Message:", result.message);
    } else {
      console.log("❌ Email service test failed!");
      console.log("🔴 Error:", result.error);
      console.log("📊 Status:", response.status);
    }
  } catch (error) {
    console.log("❌ Failed to connect to email service!");
    console.log("🔴 Error:", error.message);
    console.log("");
    console.log("💡 Make sure the email service is running:");
    console.log("   npm run email-service");
  }
};

// Health check function
const checkHealth = async () => {
  try {
    const response = await fetch("http://localhost:3001/health");
    const result = await response.json();
    
    if (response.ok) {
      console.log("✅ Email service is healthy!");
      console.log("📊 Status:", result.status);
      console.log("🔧 Service:", result.service);
      return true;
    } else {
      console.log("❌ Email service health check failed!");
      return false;
    }
  } catch (error) {
    console.log("❌ Cannot connect to email service!");
    console.log("🔴 Error:", error.message);
    return false;
  }
};

// Main execution
const main = async () => {
  console.log("🔍 Email Service Test Script");
  console.log("==============================");
  console.log("");

  // First check if service is running
  const isHealthy = await checkHealth();
  console.log("");

  if (isHealthy) {
    await testEmailService();
  } else {
    console.log("💡 To start the email service:");
    console.log("   1. Make sure you have AWS credentials set up");
    console.log("   2. Run: npm run email-service");
    console.log("   3. Then run this test script again");
  }
};

// Run the test
main().catch(console.error); 