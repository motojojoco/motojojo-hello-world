-- Add attendance tracking fields to tickets table
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS attended BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS attended_at TIMESTAMP WITH TIME ZONE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_tickets_attended ON tickets(attended);
CREATE INDEX IF NOT EXISTS idx_tickets_attended_at ON tickets(attended_at);

-- Add comment to explain the fields
COMMENT ON COLUMN tickets.attended IS 'Whether the ticket holder attended the event';
COMMENT ON COLUMN tickets.attended_at IS 'Timestamp when the ticket was marked as attended'; 