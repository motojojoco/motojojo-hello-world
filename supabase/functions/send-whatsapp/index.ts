
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from 'npm:twilio';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppMessage {
  to: string;
  eventTitle: string;
  ticketCount: number;
  date: string;
  time: string;
  venue: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { to, eventTitle, ticketCount, date, time, venue } = await req.json() as WhatsAppMessage;

    // Initialize Twilio client
    const client = new Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID')!,
      Deno.env.get('TWILIO_AUTH_TOKEN')!
    );

    // Format the message
    const message = `🎫 Your Motojojo Event Tickets!\n\n` +
      `Event: ${eventTitle}\n` +
      `Tickets: ${ticketCount}\n` +
      `Date: ${date}\n` +
      `Time: ${time}\n` +
      `Venue: ${venue}\n\n` +
      `Thank you for booking with Motojojo! Your tickets will be sent to your email.`;

    // Send WhatsApp message
    const messageResponse = await client.messages.create({
      body: message,
      from: Deno.env.get('TWILIO_PHONE_NUMBER'),
      to: `whatsapp:${to}`  // Format the number with WhatsApp prefix
    });

    console.log('WhatsApp message sent:', messageResponse.sid);

    return new Response(
      JSON.stringify({ success: true, messageSid: messageResponse.sid }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})
