// Simple chat interface for the Hybrid RAG + SQL Assistant

const API_BASE_URL = 'http://localhost:4000';
let isLoading = false;

function addMessage(content, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    if (!isUser) {
        messageContent.innerHTML = `<strong>Assistant:</strong> ${content}`;
    } else {
        messageContent.innerHTML = `<strong>You:</strong> ${content}`;
    }

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setStatus(message, isError = false) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = isError ? 'error' : '';

    if (message === 'Loading...') {
        status.innerHTML = '<span class="loading"></span> Loading...';
    }
}

function setLoading(loading) {
    isLoading = loading;
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');

    sendButton.disabled = loading;
    userInput.disabled = loading;

    if (loading) {
        setStatus('Loading...');
    } else {
        setStatus('Ready');
    }
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (!message || isLoading) return;

    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';

    setLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/chat?q=${encodeURIComponent(message)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.text();

        // Add bot response to chat
        addMessage(result);

    } catch (error) {
        console.error('Error:', error);
        addMessage(`Sorry, I encountered an error: ${error.message}. Please make sure the server is running on port 4000.`);
        setStatus('Error occurred', true);
    } finally {
        setLoading(false);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Initialize the chat
document.addEventListener('DOMContentLoaded', function() {
    setStatus('Ready');

    // Focus on input
    document.getElementById('user-input').focus();

    // Check if server is running
    fetch(`${API_BASE_URL}/chat?q=test`)
        .then(response => {
            if (response.ok) {
                setStatus('Server connected');
            } else {
                setStatus('Server not responding - make sure to run "npm run start:dev"', true);
            }
        })
        .catch(() => {
            setStatus('Server not responding - make sure to run "npm run start:dev"', true);
        });
});