# Host & Attendance Management System

## Overview

The Host & Attendance Management System is a comprehensive solution for managing event hosts, tracking attendance, and providing real-time attendance statistics. This system allows admins to invite hosts, hosts to manage attendance for their assigned events, and provides detailed reporting capabilities.

## Features

### 1. Host Management
- **Host Invitations**: Admins can invite users to become hosts via email
- **Host Profiles**: Dedicated host profiles with contact information and bio
- **Host Login**: Separate login system for hosts with role-based access
- **Host Permissions**: Granular permissions for different host capabilities

### 2. Attendance Tracking
- **Real-time Marking**: Mark attendees as present or absent in real-time
- **QR Code Scanning**: Scan ticket QR codes for quick attendance marking
- **Manual Entry**: Manual ticket number entry for attendance marking
- **Attendance Records**: Comprehensive tracking of all attendance data
- **Notes Support**: Add notes when marking attendance

### 3. Event Management
- **Host-Event Assignment**: Assign hosts to specific events
- **Event Permissions**: Control what hosts can do for each event
- **Event Dashboard**: Hosts can view and manage their assigned events

### 4. Reporting & Analytics
- **Attendance Statistics**: Real-time attendance rates and statistics
- **City-wise Tracking**: Track attendance by city
- **Host Performance**: Monitor host performance and event management
- **Export Capabilities**: Export attendance data for analysis

## Database Schema

### Tables

#### 1. `hosts`
Stores host profile information
```sql
- id (UUID, Primary Key)
- user_id (VARCHAR, Foreign Key to users.id)
- host_name (VARCHAR, Required)
- phone (VARCHAR, Optional)
- city (VARCHAR, Optional)
- bio (TEXT, Optional)
- is_active (BOOLEAN, Default: true)
- is_verified (BOOLEAN, Default: false)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. `host_invitations`
Manages host invitation system
```sql
- id (UUID, Primary Key)
- email (VARCHAR, Required)
- invited_by (VARCHAR, Foreign Key to users.id)
- invitation_token (VARCHAR, Unique)
- status (VARCHAR, 'pending'|'accepted'|'expired')
- expires_at (TIMESTAMP, Required)
- created_at (TIMESTAMP)
- accepted_at (TIMESTAMP, Optional)
```

#### 3. `attendance_records`
Tracks attendance for events
```sql
- id (UUID, Primary Key)
- ticket_id (VARCHAR, Foreign Key to tickets.id)
- event_id (VARCHAR, Foreign Key to events.id)
- user_id (VARCHAR, Foreign Key to users.id)
- host_id (VARCHAR, Foreign Key to hosts.id)
- status (VARCHAR, 'present'|'absent')
- marked_at (TIMESTAMP)
- notes (TEXT, Optional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 4. `host_events`
Links hosts to events they can manage
```sql
- id (UUID, Primary Key)
- host_id (VARCHAR, Foreign Key to hosts.id)
- event_id (VARCHAR, Foreign Key to events.id)
- permissions (JSONB, Default permissions)
- created_at (TIMESTAMP)
```

### Views

#### 1. `host_dashboard_view`
Provides aggregated data for host dashboard
```sql
- host_id, host_name, city, email
- total_events, total_tickets
- present_tickets, absent_tickets
```

#### 2. `attendance_summary_view`
Provides attendance statistics by event
```sql
- event_id, event_title, event_city, event_date
- host_name, total_tickets, present_count, absent_count
- attendance_rate
```

## API Functions

### 1. `create_host_invitation(email, invited_by_user_id)`
Creates a new host invitation
- **Parameters**: Email address, Admin user ID
- **Returns**: JSON with success status and invitation token
- **Permissions**: Admin only

### 2. `accept_host_invitation(token, user_id, host_name, phone, city, bio)`
Accepts a host invitation and creates host profile
- **Parameters**: Invitation token, User ID, Host details
- **Returns**: JSON with success status and message
- **Permissions**: Authenticated users with valid invitation

### 3. `mark_attendance(ticket_id, event_id, status, notes)`
Marks attendance for a ticket
- **Parameters**: Ticket ID, Event ID, Status, Optional notes
- **Returns**: JSON with success status and message
- **Permissions**: Host assigned to the event

### 4. `get_attendance_stats(event_id, city)`
Returns attendance statistics
- **Parameters**: Optional event ID, Optional city filter
- **Returns**: JSON with attendance statistics
- **Permissions**: Host (for their events) or Admin (for all events)

## User Roles

### 1. Admin
- Can invite hosts
- Can assign hosts to events
- Can view all attendance data
- Can manage host permissions
- Can access comprehensive reports

### 2. Host
- Can mark attendance for assigned events
- Can view attendance statistics for their events
- Can manage their host profile
- Can view event tickets and bookings

### 3. User
- Regular event attendees
- Can view their own tickets and attendance status

## Setup Instructions

### 1. Database Setup
Run the SQL script `host_attendance_management.sql` in your Supabase SQL Editor:

```bash
# Copy the contents of host_attendance_management.sql
# Paste and execute in Supabase SQL Editor
```

### 2. Frontend Setup
The system includes the following new components and pages:

#### Pages
- `/host/login` - Host login page
- `/host/dashboard` - Host dashboard
- `/host/invitation` - Host invitation acceptance page

#### Components
- `QRCodeScanner` - QR code scanner for attendance marking
- Updated `AdminDashboard` with host management tab
- Updated `ProtectedRoute` with host-only protection

#### Services
- `hostService.ts` - All host-related API functions
- Updated `use-auth.tsx` with host role support

### 3. Environment Configuration
Ensure your Supabase configuration includes the necessary environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage Guide

### For Admins

#### 1. Inviting Hosts
1. Navigate to Admin Dashboard
2. Go to "Host Management" tab
3. Click "Invite Host"
4. Enter the email address
5. Send invitation

#### 2. Assigning Hosts to Events
1. In the Host Management tab
2. View existing hosts
3. Assign hosts to specific events
4. Set appropriate permissions

#### 3. Monitoring Attendance
1. View attendance statistics in the Overview tab
2. Export attendance reports
3. Monitor host performance

### For Hosts

#### 1. Accepting Invitation
1. Click the invitation link in email
2. Fill out host profile form
3. Submit to become a host

#### 2. Logging In
1. Go to `/host/login`
2. Use your credentials
3. Access host dashboard

#### 3. Marking Attendance
1. Select an event from your dashboard
2. Use QR code scanner or manual entry
3. Mark attendees as present/absent
4. Add notes if needed

#### 4. Viewing Reports
1. Check attendance statistics
2. View event-specific reports
3. Monitor attendance rates

## Security Features

### 1. Row Level Security (RLS)
- Hosts can only access their assigned events
- Admins can access all data
- Users can only see their own information

### 2. Role-Based Access Control
- Strict role checking for all operations
- Separate authentication flows for different roles
- Protected routes with role validation

### 3. Invitation System
- Secure invitation tokens
- Time-limited invitations
- Email verification required

## Real-time Features

### 1. Live Updates
- Real-time attendance updates
- Live dashboard statistics
- Instant notification of changes

### 2. WebSocket Integration
- Supabase real-time subscriptions
- Automatic data synchronization
- Live attendance tracking

## Performance Optimizations

### 1. Database Indexes
- Optimized queries for attendance lookups
- Indexed foreign key relationships
- Efficient date-based queries

### 2. Caching
- React Query for data caching
- Optimistic updates for better UX
- Efficient re-rendering

## Troubleshooting

### Common Issues

#### 1. Host Invitation Not Working
- Check if the invitation token is valid
- Verify the invitation hasn't expired
- Ensure the email matches the invitation

#### 2. Attendance Marking Fails
- Verify the host is assigned to the event
- Check if the ticket exists for the event
- Ensure proper permissions

#### 3. QR Code Scanner Issues
- Check camera permissions
- Ensure HTTPS for camera access
- Verify browser compatibility

### Error Messages

#### Database Errors
- `Only admins can invite hosts` - User doesn't have admin role
- `Invalid or expired invitation` - Invitation token is invalid
- `No permission to manage this event` - Host not assigned to event

#### Frontend Errors
- `Host profile not found` - User needs to complete host setup
- `Access denied` - Insufficient permissions
- `Camera access denied` - Browser camera permissions required

## Future Enhancements

### 1. Advanced Features
- Bulk attendance marking
- Advanced reporting and analytics
- Mobile app integration
- Offline attendance tracking

### 2. Integration Possibilities
- SMS notifications for attendance
- Email confirmations
- Calendar integration
- Payment processing integration

### 3. Analytics Improvements
- Predictive attendance modeling
- Host performance metrics
- Event success indicators
- Revenue impact analysis

## Support

For technical support or questions about the Host & Attendance Management System:

1. Check the troubleshooting section above
2. Review the database schema and API documentation
3. Test with sample data to verify functionality
4. Contact the development team for complex issues

## License

This system is part of the Motojojo Events platform and follows the same licensing terms as the main application. 