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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Tickets - ${eventTitle}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #6A0DAD 0%, #8B5CF6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🎫 Your Tickets Are Ready!</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for booking with Motojojo Events</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Hello <strong>${name}</strong>,<br><br>
                Your tickets for <strong>${eventTitle}</strong> have been successfully booked! Here are all the details you need:
              </p>
              
              <!-- Event Details Card -->
              <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #6A0DAD;">
                <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">📅 Event Details</h2>
                <div style="display: grid; gap: 12px;">
                  <div style="display: flex; align-items: center;">
                    <span style="font-weight: 600; color: #6A0DAD; min-width: 80px;">Event:</span>
                    <span style="color: #333;">${eventTitle}</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="font-weight: 600; color: #6A0DAD; min-width: 80px;">Date:</span>
                    <span style="color: #333;">${eventDate}</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="font-weight: 600; color: #6A0DAD; min-width: 80px;">Time:</span>
                    <span style="color: #333;">${eventTime}</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="font-weight: 600; color: #6A0DAD; min-width: 80px;">Venue:</span>
                    <span style="color: #333;">${eventVenue}</span>
                  </div>
                </div>
              </div>

              <!-- Tickets Section -->
              <h2 style="color: #333; margin: 30px 0 20px 0; font-size: 20px; font-weight: 600;">🎟️ Your Tickets</h2>
              ${ticketNumbers.map((ticketNumber, index) => `
                <div style="background: #ffffff; border: 2px solid #e9ecef; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                      <p style="margin: 0; font-weight: 600; color: #333; font-size: 14px;">Ticket #${index + 1}</p>
                      <p style="margin: 5px 0 0 0; color: #6c757d; font-size: 12px; font-family: monospace;">${ticketNumber}</p>
                    </div>
                    <div style="background: #6A0DAD; color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                      CONFIRMED
                    </div>
                  </div>
                  <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <img src="${qrCodes[index]}" alt="QR Code for ${ticketNumber}" style="width: 120px; height: 120px; border-radius: 8px;">
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #6c757d;">Scan this QR code at the venue for entry</p>
                  </div>
                </div>
              `).join('')}

              <!-- Important Notes -->
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">⚠️ Important Information</h3>
                <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px; line-height: 1.5;">
                  <li>Please arrive at least 30 minutes before the event starts</li>
                  <li>Show your QR code at the entrance for entry</li>
                  <li>Keep this email safe - you'll need it for entry</li>
                  <li>Each QR code can only be used once</li>
                </ul>
              </div>

              <!-- Contact Info -->
              <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">
                  Need help? Contact us at <a href="mailto:support@motojojo.co" style="color: #6A0DAD; text-decoration: none;">support@motojojo.co</a>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #343a40; padding: 30px; text-align: center;">
              <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Motojojo Events</p>
              <p style="color: #adb5bd; margin: 0; font-size: 14px;">Creating unforgettable experiences</p>
              <div style="margin-top: 20px;">
                <a href="https://motojojo.co" style="color: #6A0DAD; text-decoration: none; font-size: 14px;">Visit our website</a>
              </div>
            </div>
          </div>
        </body>
        </html>
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

