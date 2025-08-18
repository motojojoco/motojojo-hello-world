import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all events that are completed (past date and time)
    const now = new Date().toISOString()
    
    const { data: completedEvents, error: eventsError } = await supabase
      .from('events')
      .select('id, date, time')
      .lt('date', now.split('T')[0]) // Events with date before today
    
    if (eventsError) {
      throw new Error(`Error fetching completed events: ${eventsError.message}`)
    }

    if (!completedEvents || completedEvents.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No completed events found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let totalTicketsUpdated = 0
    const results = []

    // Process each completed event
    for (const event of completedEvents) {
      // Check if event is actually completed (considering time)
      const eventDateTime = new Date(event.date)
      if (event.time) {
        const [hours, minutes] = event.time.split(':').map(Number)
        eventDateTime.setHours(hours, minutes, 0, 0)
      } else {
        // If no time provided, assume end of day
        eventDateTime.setHours(23, 59, 59, 999)
      }

      // Add 4 hours to consider event "completed" after reasonable duration
      const eventEndTime = new Date(eventDateTime.getTime() + (4 * 60 * 60 * 1000))
      
      if (new Date() > eventEndTime) {
        // Get all bookings for this event
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('id')
          .eq('event_id', event.id)
        
        if (bookingsError) {
          console.error(`Error fetching bookings for event ${event.id}:`, bookingsError)
          continue
        }

        if (bookings && bookings.length > 0) {
          const bookingIds = bookings.map(booking => booking.id)
          
          // Update all tickets for these bookings to mark as attended
          const { data: updatedTickets, error: updateError } = await supabase
            .from('tickets')
            .update({
              attended: true,
              attended_at: new Date().toISOString()
            })
            .in('booking_id', bookingIds)
            .eq('attended', false) // Only update tickets that haven't been marked as attended
            .select('id')
          
          if (updateError) {
            console.error(`Error marking tickets as attended for event ${event.id}:`, updateError)
            results.push({
              eventId: event.id,
              success: false,
              error: updateError.message
            })
          } else {
            const ticketsUpdated = updatedTickets?.length || 0
            totalTicketsUpdated += ticketsUpdated
            results.push({
              eventId: event.id,
              success: true,
              ticketsUpdated
            })
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Attendance marking completed',
        totalTicketsUpdated,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in mark-attended function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 