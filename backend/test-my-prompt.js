import { coordinateAgents } from './agentCoordinator.js';
import readline from 'readline';
import { getGoogleToken } from './tokenStore.js';

async function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  // Check if prompt provided as command line argument
  if (process.argv.length > 2) {
    // Single run mode with command line argument
    const userPrompt = process.argv.slice(2).join(' ');
    console.log('Using prompt from command line:', userPrompt);
    
    console.log('\nGenerating response...\n');
    
    // Check token before running
    const token = getGoogleToken('demoUser');
    if (!token) {
      console.log('⚠️  Google Calendar not connected.');
      console.log('   Connect first: http://127.0.0.1:5000/auth/google/start\n');
    }
    
    try {
      const result = await coordinateAgents(userPrompt, 'demoUser');
      console.log('\n=== GPT RESPONSE ===\n');
      console.log(result.message);
      
      if (result.calendar) {
        console.log('\n=== CALENDAR ===');
        if (result.calendar.status === 'CREATED') {
          console.log('✅ Event created:', result.calendar.eventSummary);
          console.log('🔗 Link:', result.calendar.calendarLink);
        } else if (result.calendar.authRequired) {
          console.log('🔐 Connect:', result.calendar.authUrl);
        }
      }
      
      if (result.actions && result.actions.length > 0) {
        console.log('\n=== ACTIONS TAKEN ===');
        result.actions.forEach(action => {
          console.log(`- ${action.type}: ${action.status}`);
        });
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
    process.exit(0);
  }

  // Interactive loop mode
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Interactive mode - Type "exit" or "quit" to stop\n');
  
  // Check if Google Calendar is connected
  const token = getGoogleToken('demoUser');
  if (!token) {
    console.log('⚠️  Google Calendar not connected yet.');
    console.log('   Visit: http://127.0.0.1:5000/auth/google/start\n');
  } else {
    console.log('✅ Google Calendar connected!\n');
  }

  while (true) {
    const userPrompt = await askQuestion(rl, 'Enter your prompt: ');

    // Check for exit commands
    if (!userPrompt || userPrompt.trim().toLowerCase() === 'exit' || userPrompt.trim().toLowerCase() === 'quit') {
      console.log('\nGoodbye!');
      rl.close();
      break;
    }

    // Generate response
    console.log('\nGenerating response...\n');
    try {
      const result = await coordinateAgents(userPrompt, 'demoUser');
      
      console.log('\n=== GPT RESPONSE ===\n');
      console.log(result.message);
      
      // Show calendar action if any
      if (result.calendar) {
        console.log('\n=== CALENDAR ACTION ===');
        if (result.calendar.status === 'CREATED') {
          console.log('✅ Calendar event created!');
          console.log('📅 Event:', result.calendar.eventSummary);
          console.log('🕐 Time:', result.calendar.start);
          console.log('🔗 Link:', result.calendar.calendarLink);
        } else if (result.calendar.authRequired) {
          console.log('🔐 Google Calendar needs to be connected');
          console.log('Visit:', result.calendar.authUrl);
        } else if (result.calendar.error) {
          console.log('❌ Error:', result.calendar.error);
        }
      }
      
      if (result.actions && result.actions.length > 0) {
        console.log('\n=== COORDINATED ACTIONS ===');
        result.actions.forEach(action => {
          const icon = action.status === 'success' ? '✅' : '❌';
          console.log(`${icon} ${action.type}: ${action.status}`);
        });
      }
      
      console.log('\n' + '-'.repeat(50) + '\n');
    } catch (error) {
      console.error('Error:', error.message);
      console.log('\n');
    }
  }
}

main();
