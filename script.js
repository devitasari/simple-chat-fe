const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Call the API
  try {
    // Replace 'YOUR_API_ENDPOINT' with your actual API URL
    const response = await fetch('http://localhost:3000/generate-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other necessary headers, like an API key
        // 'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({ prompt: userMessage }),
    });

    if (!response.ok) {
      // Handle HTTP errors like 404 or 500
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      appendMessage('bot', `Error: ${response.status} - ${errorData.message || 'Something went wrong'}`);
      return;
    }

    const data = await response.json();
    // Assuming the API returns a JSON object with a 'reply' field
    // e.g., { "reply": "This is the bot's response." }
    appendMessage('bot', data.output || 'Bot did not provide a valid reply.');

  } catch (error) {
    // Handle network errors or other issues with the fetch call
    console.error('API call failed:', error);
    appendMessage('bot', 'Sorry, I couldn\'t connect to the server. Please try again later.');
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
