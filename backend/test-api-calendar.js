/**
 * Test calendar via API (server must be running)
 * 
 * Usage:
 *   1. Start server: npm start
 *   2. Run this: node backend/test-api-calendar.js
 */

async function testCalendarViaAPI() {
  const prompts = [
    "Schedule a meeting tomorrow at 2pm",
    "Create a calendar event for Friday at 3pm"
  ];

  for (const prompt of prompts) {
    console.log(`\n📤 Sending: "${prompt}"`);
    console.log('─'.repeat(50));

    try {
      const response = await fetch('http://127.0.0.1:5000/chatRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: prompt,
          email: 'test@example.com'
        })
      });

      const result = await response.json();
      
      console.log('✅ Response:');
      console.log(JSON.stringify(result, null, 2));

      if (result.calendar) {
        if (result.calendar.status === 'CREATED') {
          console.log('\n🎉 Calendar event created!');
          console.log('📅 Link:', result.calendar.calendarLink);
        } else if (result.calendar.authRequired) {
          console.log('\n🔐 Auth required:');
          console.log('Visit:', result.calendar.authUrl);
        }
      }

    } catch (error) {
      console.error('❌ Error:', error.message);
    }

    console.log('\n' + '='.repeat(50));
  }
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ Node.js 18+ required for fetch API');
  console.log('Or install node-fetch: npm install node-fetch');
  process.exit(1);
}

testCalendarViaAPI();

