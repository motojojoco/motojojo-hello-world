
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Resend instance uses the secret key from Supabase environment variable (already set)
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TicketEmailData {
  email: string;
  name: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  ticketNumbers: string[];
  qrCodes: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      email, 
      name, 
      eventTitle, 
      eventDate, 
      eventTime, 
      eventVenue,
      ticketNumbers,
      qrCodes 
    }: TicketEmailData = await req.json();

    // Always use the correct sender domain
    const emailResponse = await resend.emails.send({
      from: "Motojojo Events <info@motojojo.co>",
      to: [email],
      subject: `Your tickets for ${eventTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Your Tickets are Ready!</h1>
          <p>Hello ${name},</p>
          <p>Thank you for booking tickets to ${eventTitle}. Here are your ticket details:</p>
          
          <div style="margin: 24px 0; padding: 20px; background: #f5f5f5; border-radius: 8px;">
            <h2 style="margin-top: 0; color: #333;">Event Details</h2>
            <p><strong>Event:</strong> ${eventTitle}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Time:</strong> ${eventTime}</p>
            <p><strong>Venue:</strong> ${eventVenue}</p>
          </div>

          <h2 style="color: #333;">Your Tickets</h2>
          ${ticketNumbers.map((ticketNumber, index) => `
            <div style="margin-bottom: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <p style="margin: 0;"><strong>Ticket Number:</strong> ${ticketNumber}</p>
              <div style="margin-top: 10px;">
                <img src="${qrCodes[index]}" alt="QR Code" style="width: 150px; height: 150px;">
              </div>
            </div>
          `).join('')}

          <p style="margin-top: 24px;">Please show these QR codes at the venue for entry.</p>
          <p>Have a great time!</p>
          <p>Best regards,<br>Motojojo Events Team</p>
        </div>
      `,
    });

    console.log("Ticket email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending ticket email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

