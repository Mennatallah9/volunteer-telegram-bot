# Telegram Volunteer Management Bot

A comprehensive Telegram bot built with grammY and Supabase for managing volunteer onboarding, probation tracking, event planning, and admin management.

## Features

### 🎯 Volunteer Management
- **Probation System**: New volunteers must complete 3 commitments within 3 months
- **Automatic Promotion**: Volunteers are automatically promoted to full status when criteria are met
- **Status Tracking**: Track volunteer progress and commitments
- **Inactivity Detection**: Automatically flag volunteers inactive after 3 months

### 📅 Event Management
- **Interactive Event Creation**: Step-by-step wizard for creating events
- **Role Assignment**: Automatic role creation based on event format
- **Format Support**: Workshop, Panel, Online, and In-person events
- **Publishing**: Finalize and publish events (with mock Meetup integration)

### 🔐 Admin System
- **Secure Authentication**: Admin login with secret key
- **Role-based Access**: Protected admin commands
- **Volunteer Management**: Add, remove, and manage volunteers
- **Event Oversight**: Create and manage events

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ 
- Telegram Bot Token (from @BotFather)
- Supabase account and project

### 2. Installation

```bash
# Clone and install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 3. Environment Configuration

Edit `.env` file with your credentials:

```env
# Get from @BotFather on Telegram
BOT_TOKEN=your_telegram_bot_token_here

# From your Supabase project settings
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Set a secure password for admin authentication
ADMIN_SECRET=your_admin_secret_password

# Optional: Channel ID for volunteer promotion broadcasts
VOLUNTEER_CHANNEL_ID=your_volunteer_channel_id
```

### 4. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase_schema.sql`
4. Execute the SQL to create all tables and indexes

### 5. Running the Bot

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

## Commands Reference

### Volunteer Commands
- `/start` - Welcome message and help
- `/onboard` - Learn about the volunteer program
- `/my_status` - Check your volunteer status and progress
- `/commit <event_id> <role>` - Sign up for a role in an event

### Admin Commands
- `/admin_login <secret>` - Authenticate as admin (one-time setup)
- `/list_volunteers` - View all volunteers and their status
- `/add_volunteer @handle "Full Name"` - Manually add a volunteer
- `/remove_volunteer @handle` - Remove a volunteer
- `/create_event` - Interactive event creation wizard
- `/assign_role <event_id> <role> @volunteer` - Assign volunteer to role
- `/finalize_event <event_id>` - Publish event to Meetup (mock)
- `/list_events` - View all events
- `/event_details <event_id>` - View detailed event information

### Utility Commands
- `/help` - Show help message
- `/cancel` - Cancel current interactive operation

## Event Formats & Required Roles

### Panel Discussion
- Moderator
- Date Confirmation
- Speaker Confirmation
- Pre-event Marketing
- Post-event Marketing

### Workshop
- Facilitator
- Date Confirmation
- Pre-event Marketing
- Post-event Marketing

### Online Events
- Date Confirmation
- Pre-event Marketing
- Post-event Marketing

### In-person Events
- Venue Confirmation
- Date Confirmation
- Pre-event Marketing
- Post-event Marketing

## Volunteer Progression

1. **Probation** (New volunteers)
   - Must complete 3 commitments within 3 months
   - Can sign up for any available roles

2. **Full Volunteer** (Promoted automatically)
   - Completed probation requirements
   - Celebration broadcast sent to volunteer channel
   - Full access to all opportunities

3. **Inactive** (Automatically flagged)
   - No activity for more than 3 months
   - Can be reactivated by admin

## Database Schema

The bot uses 4 main tables:
- **volunteers** - Volunteer information and status
- **events** - Event details and scheduling
- **event_roles** - Role assignments for events
- **admins** - Admin authentication and permissions

See `supabase_schema.sql` for complete schema details.

## Development

### Project Structure
```
src/
├── bot.ts              # Main bot entry point
├── db.ts               # Supabase client and database operations
├── utils.ts            # Helper functions and utilities
└── commands/
    ├── volunteers.ts   # Volunteer-related commands
    ├── admins.ts       # Admin commands and authentication
    └── events.ts       # Event management commands
```

### Building
```bash
npm run build
```

### Watching for Changes
```bash
npm run watch
```

## Maintenance

The bot automatically runs maintenance tasks every hour:
- Check for volunteer promotions
- Mark inactive volunteers
- Send celebration broadcasts

## Security Notes

- Admin secret should be kept secure and shared only with trusted admins
- Supabase RLS (Row Level Security) can be configured for additional protection
- Bot token should never be committed to version control

## Support

For issues or feature requests, please check the bot logs and Supabase dashboard for debugging information.
