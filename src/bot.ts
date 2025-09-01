import { Bot, Context, session, SessionFlavor } from 'grammy';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Import command handlers
import { 
  onboardCommand, 
  myStatusCommand, 
  commitCommand,
  assignTaskCommand,
  updateTaskStatusCommand
} from './commands/volunteers';

import { 
  requireAdmin,
  adminLoginCommand,
  listVolunteersCommand,
  addVolunteerCommand,
  removeVolunteerCommand,
  addVolunteerWithStatusCommand
} from './commands/admins';

import {
  createEventCommand,
  handleEventWizard,
  handleFinalizationConfirmation,
  finalizeEventCommand,
  listEventsCommand,
  eventDetailsCommand,
  listEventsWithTasksCommand,
  cancelCommand
} from './commands/events';

import { markInactiveVolunteers, checkAndPromoteVolunteers } from './utils';

// Validate required environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is required. Please check your .env file.');
  process.exit(1);
}

// Create bot instance
const bot = new Bot(BOT_TOKEN);

// Error handling
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Help message function
const getHelpMessage = () => {
  return `🤖 **Volunteer Management Bot**

Welcome! I help manage volunteer onboarding, event planning, and admin tasks.

**For Volunteers:**
• \`/onboard\` - Learn about the volunteer program
• \`/my_status\` - Check your volunteer status
• \`/commit <task_id>\` - Sign up for event tasks

**For Admins:**
• \`/admin_login <secret>\` - Authenticate as admin
• \`/list_volunteers\` - View all volunteers
• \`/add_volunteer @handle "Name"\` - Add new volunteer
• \`/remove_volunteer @handle\` - Remove volunteer
• \`/add_volunteer_with_status @handle "Name" <status>\` - Add volunteer with status
• \`/create_event\` - Create new event (interactive with task selection)
• \`/assign_task <task_id> @volunteer\` - Assign tasks to volunteers
• \`/update_task_status <task_id> <status>\` - Update task status
• \`/finalize_event <event_id>\` - Publish event
• \`/list_events\` - View all events (summary)
• \`/list_events_with_tasks\` - View events with task IDs for reference
• \`/event_details <event_id>\` - View detailed event information

**General:**
• \`/start\` - Show welcome message
• \`/help\` - Show this help message
• \`/cancel\` - Cancel current operation

Let's get started! 🚀`;
};

// Start command
bot.command('start', async (ctx) => {
  await ctx.reply(getHelpMessage(), { parse_mode: 'Markdown' });
});

// Help command
bot.command('help', async (ctx) => {
  await ctx.reply(getHelpMessage(), { parse_mode: 'Markdown' });
});

// Volunteer commands
bot.command('onboard', onboardCommand);
bot.command('my_status', myStatusCommand);
bot.command('commit', commitCommand);

// Admin authentication
bot.command('admin_login', adminLoginCommand);

// Admin commands (with authentication middleware)
bot.command('list_volunteers', requireAdmin, listVolunteersCommand);
bot.command('add_volunteer', requireAdmin, addVolunteerCommand);
bot.command('remove_volunteer', requireAdmin, removeVolunteerCommand);
bot.command('assign_task', requireAdmin, assignTaskCommand);
bot.command('add_volunteer_with_status', requireAdmin, addVolunteerWithStatusCommand);
bot.command('update_task_status', updateTaskStatusCommand);
bot.command('create_event', requireAdmin, createEventCommand);
bot.command('finalize_event', requireAdmin, finalizeEventCommand);
bot.command('list_events', requireAdmin, listEventsCommand);
bot.command('list_events_with_tasks', requireAdmin, listEventsWithTasksCommand);
bot.command('event_details', requireAdmin, eventDetailsCommand);

// Utility commands
bot.command('cancel', cancelCommand);

// Handle text messages for interactive wizards
bot.on('message:text', async (ctx) => {
  // Handle event creation wizard
  await handleEventWizard(ctx);
  
  // Handle finalization confirmation
  await handleFinalizationConfirmation(ctx);
});

// Periodic maintenance tasks
const runMaintenanceTasks = async () => {
  console.log('🔧 Running maintenance tasks...');
  
  try {
    // Mark inactive volunteers
    await markInactiveVolunteers();
    
    // Check for volunteer promotions
    await checkAndPromoteVolunteers(bot);
    
    console.log('✅ Maintenance tasks completed');
  } catch (error) {
    console.error('❌ Error running maintenance tasks:', error);
  }
};

// Run maintenance tasks every hour
setInterval(runMaintenanceTasks, 60 * 60 * 1000);

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  bot.stop();
});

process.once('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  bot.stop();
});

// Set up bot commands for auto-completion
const setupBotCommands = async () => {
  try {
    await bot.api.setMyCommands([
      { command: 'start', description: 'Show welcome message and help' },
      { command: 'help', description: 'Show all available commands' },
      { command: 'onboard', description: 'Learn about the volunteer program' },
      { command: 'my_status', description: 'Check your volunteer status' },
      { command: 'commit', description: 'Sign up for event tasks' },
      { command: 'admin_login', description: 'Authenticate as admin' },
      { command: 'list_volunteers', description: 'View all volunteers (admin)' },
      { command: 'add_volunteer', description: 'Add new volunteer (admin)' },
      { command: 'remove_volunteer', description: 'Remove volunteer (admin)' },
      { command: 'add_volunteer_with_status', description: 'Add volunteer with status (admin)' },
      { command: 'create_event', description: 'Create new event with task selection (admin)' },
      { command: 'assign_task', description: 'Assign tasks to volunteers (admin)' },
      { command: 'update_task_status', description: 'Update task status' },
      { command: 'finalize_event', description: 'Publish event (admin)' },
      { command: 'list_events', description: 'View upcoming events (admin)' },
      { command: 'list_events_with_tasks', description: 'View events with task IDs (admin)' },
      { command: 'event_details', description: 'View detailed event information (admin)' },
      { command: 'cancel', description: 'Cancel current operation' }
    ]);
    console.log('✅ Bot commands registered for auto-completion');
  } catch (error) {
    console.error('❌ Failed to set bot commands:', error);
  }
};

// Start the bot
const startBot = async () => {
  try {
    console.log('🚀 Starting Telegram Volunteer Bot...');
    
    // Set up command auto-completion
    await setupBotCommands();
    
    // Run initial maintenance check
    await runMaintenanceTasks();
    
    // Start polling for updates
    await bot.start();
    
    console.log('✅ Bot is running successfully!');
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
};

// Start the bot
startBot();
