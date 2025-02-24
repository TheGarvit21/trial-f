// Your Gemini API Key - Replace with your actual API key
const API_KEY = 'AIzaSyDxEpZ1tJ5TqzZp-Ut14KCn3ANLFpbzB0k';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

let isDarkMode = true; // Set dark mode as default
document.body.setAttribute('data-theme', 'dark'); // Set dark theme by default

// Modify the theme toggle icon to show sun initially
document.querySelector('.theme-toggle i').className = 'fas fa-sun';
document.querySelector('.theme-toggle').innerHTML = `
    <i class="fas fa-sun"></i>
    Light mode
`;

// Theme toggle functionality
document.querySelector('.theme-toggle').addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    const themeButton = document.querySelector('.theme-toggle');
    const icon = themeButton.querySelector('i');
    
    if (isDarkMode) {
        icon.className = 'fas fa-sun';
        themeButton.innerHTML = `
            <i class="fas fa-sun"></i>
            Light mode
        `;
    } else {
        icon.className = 'fas fa-moon';
        themeButton.innerHTML = `
            <i class="fas fa-moon"></i>
            Dark mode
        `;
    }
    
    gsap.to(icon, {
        rotation: '+=180',
        duration: 0.5,
        ease: "power2.inOut"
    });
});

// Auto-resize textarea
const textarea = document.getElementById('userInput');
textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
});

// Send message functionality
document.getElementById('sendBtn').addEventListener('click', sendMessage);
textarea.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Add these variables at the top of the file
let currentFile = null;
let isSpeakingResponse = false;
const speechSynthesis = window.speechSynthesis;
let wasVoiceInput = false;

// Add these variables at the top
let isTyping = false;
let currentMessageTl = null;

// Add these variables at the top
let currentConversationId = null;

// Add these variables at the top
let uploadedFile = null;
let fileContent = null;

// Add these variables at the top of the file
let recognition = null;
let isListening = false;

// Add file handling functions
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    currentFile = file;
    showFilePreview(file);

    // Read file content
    if (file.type.startsWith('image/')) {
        processImage(file);
    } else if (file.type === 'application/pdf') {
        processPDF(file);
    } else if (file.type === 'text/plain') {
        processTextFile(file);
    }
}

function showFilePreview(file) {
    const preview = document.querySelector('.file-preview');
    preview.innerHTML = `
        <div class="file-item">
            <i class="fas ${getFileIcon(file.type)}"></i>
            <span>${file.name}</span>
            <i class="fas fa-times remove-file" onclick="removeFile()"></i>
        </div>
    `;
}

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fa-image';
    if (fileType === 'application/pdf') return 'fa-file-pdf';
    if (fileType === 'text/plain') return 'fa-file-text';
    return 'fa-file';
}

function removeFile() {
    currentFile = null;
    document.querySelector('.file-preview').innerHTML = '';
    document.getElementById('fileInput').value = '';
}

async function processImage(file) {
    try {
        // Convert image to base64
        const base64Image = await fileToBase64(file);
        // You can now use this base64Image with your API
        console.log('Image processed:', base64Image.substring(0, 50) + '...');
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

async function processPDF(file) {
    // You'll need to add pdf.js library for PDF processing
    console.log('PDF processing to be implemented');
}

async function processTextFile(file) {
    try {
        const text = await file.text();
        console.log('Text file content:', text.substring(0, 100) + '...');
    } catch (error) {
        console.error('Error reading text file:', error);
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Add file handling function
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const filePreview = document.querySelector('.file-preview');
        filePreview.innerHTML = `
            <div class="file-info">
                <i class="fas ${getFileIcon(file.type)}"></i>
                <span>${file.name}</span>
                <button onclick="removeUploadedFile()" class="remove-file">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        filePreview.style.display = 'block';
        // Add small delay to trigger transition
        setTimeout(() => filePreview.classList.add('show'), 10);

        if (file.type.startsWith('image/')) {
            // Add size check for images
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showUploadError('Image size should be less than 5MB');
                removeUploadedFile();
                return;
            }
            uploadedFile = file;
            fileContent = await fileToBase64(file);
            showUploadSuccess('Image uploaded successfully. You can now ask questions about it.');
        } else if (file.type === 'application/pdf') {
            const text = await extractPDFText(file);
            uploadedFile = file;
            fileContent = text;
            showUploadSuccess('PDF uploaded successfully. You can now ask questions about it.');
        } else if (file.type === 'text/plain') {
            const text = await file.text();
            uploadedFile = file;
            fileContent = text;
            showUploadSuccess('Text file uploaded successfully. You can now ask questions about it.');
        } else {
            showUploadError('Unsupported file type. Please upload an image, PDF, or text file.');
            removeUploadedFile();
        }
    } catch (error) {
        console.error('Error processing file:', error);
        showUploadError('Error processing file. Please try again.');
        removeUploadedFile();
    }
}

// Get appropriate icon for file type
function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fa-image';
    if (fileType === 'application/pdf') return 'fa-file-pdf';
    if (fileType === 'text/plain') return 'fa-file-text';
    return 'fa-file';
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Extract text from PDF
async function extractPDFText(file) {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
    
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
        }
        
        return text;
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        throw error;
    }
}

// Remove uploaded file
function removeUploadedFile() {
    uploadedFile = null;
    fileContent = null;
    document.getElementById('fileInput').value = '';
    const filePreview = document.querySelector('.file-preview');
    filePreview.classList.remove('show');
    setTimeout(() => {
        filePreview.style.display = 'none';
        filePreview.innerHTML = '';
    }, 300); // Wait for transition to complete
}

// Show upload status messages
function showUploadSuccess(message) {
    const status = document.querySelector('.upload-status');
    status.textContent = message;
    status.className = 'upload-status success';
    setTimeout(() => status.className = 'upload-status', 3000);
}

function showUploadError(message) {
    const status = document.querySelector('.upload-status');
    status.textContent = message;
    status.className = 'upload-status error';
    setTimeout(() => status.className = 'upload-status', 3000);
}

// Modify sendMessage function to include auto-scroll
async function sendMessage() {
    const userInput = textarea.value.trim();
    if (!userInput && !fileContent) return;

    // Add user message to chat with file context
    let messageText = userInput || '';
    
    // Add user message without the "Analyzing" text
    addMessage(messageText, 'user');
    
    textarea.value = '';
    textarea.style.height = 'auto';

    try {
        addTypingIndicator();

        const requestBody = {
            contents: [{
                parts: []
            }],
            generationConfig: {
                maxOutputTokens: 32768, // Increase token limit for longer responses
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                stopSequences: [] // Remove any stop sequences
            }
        };

        // Add text content with proper formatting
        let textContent = userInput || '';
        if (fileContent && !uploadedFile?.type.startsWith('image/')) {
            textContent += `\n\nFile content:\n${fileContent}`;
        }

        requestBody.contents[0].parts.push({
            text: textContent
        });

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        
        removeTypingIndicator();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const fullResponse = data.candidates[0].content.parts[0].text;
            addMessage(fullResponse, 'bot');
        } else {
            throw new Error('Invalid response format');
        }

    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
}

// Initialize GSAP timeline
const tl = gsap.timeline();

// Enhanced initial animation
window.addEventListener('load', () => {
    tl.from('.chat-header', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    })
    .from('.chat-container', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out"
    }, "-=0.4")
    .from('.chat-input-container', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, "-=0.4");
});

// Modify addMessage function to include auto-scroll
function addMessage(text, sender) {
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen) {
        gsap.to(welcomeScreen, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => welcomeScreen.remove()
        });
    }

    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    if (sender === 'bot') {
        const avatar = document.createElement('div');
        avatar.className = 'bot-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        messageDiv.appendChild(avatar);
    }

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Add text directly for voice input user messages
    if (sender === 'user' && wasVoiceInput) {
        messageContent.innerHTML = `<span class="word">${text}</span>`;
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        return;
    }

    // Split text into larger chunks for better handling of long responses
    const chunks = text.split(/([.!?]\s+)/).map((chunk, i, arr) => {
        if (i % 2 === 0) return chunk;
        return chunk + (arr[i + 1] || '');
    }).filter(Boolean);
    let currentText = '';

    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);

    // Show stop button when typing starts
    const stopBtn = document.querySelector('.stop-btn');
    if (stopBtn) stopBtn.style.display = 'block';
    isTyping = true;

    // Create timeline for message animation
    currentMessageTl = gsap.timeline({
        onComplete: () => {
            isTyping = false;
            if (!wasVoiceInput && stopBtn) {
                stopBtn.style.display = 'none';
            }
        }
    });

    currentMessageTl.fromTo(messageDiv, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );

    // Type out text with proper formatting
    chunks.forEach((chunk, index) => {
        currentMessageTl.add(() => {
            currentText += chunk;
            const formattedText = currentText
                .split('\n')
                .map(line => {
                    // Preserve empty lines
                    if (!line.trim()) return '<br>';
                    return line;
                })
                .join('\n')
                .split(' ')
                .filter(word => word.length > 0)
                .map(word => `<span class="word">${word}</span>`)
                .join(' ')
                .replace(/```([\s\S]*?)```/g, (match, code) => {
                    return `
                        <div class="code-block">
                            <div class="code-header">
                                <button class="copy-btn" onclick="copyCode(this)">
                                    <i class="fas fa-copy"></i>
                                    Copy
                                </button>
                            </div>
                            <pre><code>${highlightCode(code.trim())}</code></pre>
                        </div>
                    `;
                });
            messageContent.innerHTML = formattedText;
        }, index * 0.01);
    });

    // Handle speech synthesis for voice input
    if (sender === 'bot' && wasVoiceInput) {
        currentMessageTl.add(async () => {
            try {
                await loadVoices();
                const voices = window.speechSynthesis.getVoices();
                const preferredVoice = voices.find(voice => 
                    voice.name.includes('Google Assistant') ||
                    voice.name.includes('Google UK English Female') ||
                    voice.name.includes('Google US English') ||
                    voice.name.includes('English United States') ||
                    voice.name.includes('Microsoft Zira')
                ) || voices.find(voice => 
                    voice.lang === 'en-US' && voice.name.includes('Female')
                );

                const plainText = text.replace(/```[\s\S]*?```/g, ''); // Remove code blocks for speech
                const utterance = new SpeechSynthesisUtterance(plainText);
                utterance.rate = 1.2;
                utterance.pitch = 1.05;
                utterance.volume = 1.0;
                utterance.lang = 'en-US';

                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                }

                const wordElements = messageContent.querySelectorAll('.word');
                let currentWordIndex = 0;

                utterance.onboundary = (event) => {
                    if (event.name === 'word' && currentWordIndex < wordElements.length) {
                        wordElements.forEach(word => word.classList.remove('speaking-word'));
                        wordElements[currentWordIndex].classList.add('speaking-word');
                        currentWordIndex++;
                    }
                };

                utterance.onend = () => {
                    wordElements.forEach(word => word.classList.remove('speaking-word'));
                    wasVoiceInput = false;
                };

                speechSynthesis.cancel();
                speechSynthesis.speak(utterance);

            } catch (error) {
                console.error('Speech synthesis error:', error);
                wasVoiceInput = false;
            }
        });
    }

    // Auto-scroll
    setTimeout(() => {
        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);

    // Add to chat history in sidebar
    if (sender === 'user') {
        addToChatHistory(text);
    }
}

// Store chat conversations
let conversations = [];

// Modify addToChatHistory function
function addToChatHistory(text) {
    // Create new conversation if none exists
    if (!currentConversationId) {
        currentConversationId = Date.now();
        conversations.push({
            id: currentConversationId,
            messages: [],
            title: text.substring(0, 30) + (text.length > 30 ? '...' : '')
        });
    }

    // Add message to current conversation
    const currentConversation = conversations.find(c => c.id === currentConversationId);
    const messages = document.getElementById('chatMessages').innerHTML;
    currentConversation.messages = messages;

    // Create history item if it doesn't exist
    if (!document.querySelector(`.chat-history-item[data-id="${currentConversationId}"]`)) {
        const historyDiv = document.createElement('div');
        historyDiv.className = 'chat-history-item active'; // Add active class to new conversation
        historyDiv.setAttribute('data-id', currentConversationId);
        historyDiv.innerHTML = `
            <i class="fas fa-message"></i>
            <span>${currentConversation.title}</span>
        `;
        
        // Remove active class from other history items
        document.querySelectorAll('.chat-history-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add click handler to switch conversations
        historyDiv.addEventListener('click', () => {
            switchConversation(currentConversationId);
        });
        
        document.querySelector('.chat-history').prepend(historyDiv);

        gsap.from(historyDiv, {
            opacity: 0,
            x: -20,
            duration: 0.3
        });
    }
}

// Modify switchConversation function
function switchConversation(conversationId) {
    // Save current conversation before switching
    if (currentConversationId) {
        const currentConversation = conversations.find(c => c.id === currentConversationId);
        if (currentConversation) {
            currentConversation.messages = document.getElementById('chatMessages').innerHTML;
        }
    }

    // Update current conversation ID
    currentConversationId = conversationId;

    // Load selected conversation
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
        const chatMessages = document.getElementById('chatMessages');
        
        // Remove welcome screen if it exists
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.remove();
        }
        
        // Set the messages
        chatMessages.innerHTML = conversation.messages;
        
        // Reattach event listeners for message hover effects
        reattachMessageEventListeners();
    }

    // Update active state in sidebar
    document.querySelectorAll('.chat-history-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-id') === conversationId.toString()) {
            item.classList.add('active');
        }
    });
}

// Add function to reattach message event listeners
function reattachMessageEventListeners() {
    document.querySelectorAll('.message').forEach(message => {
        message.addEventListener('mouseover', () => {
            gsap.to(message, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        message.addEventListener('mouseout', () => {
            gsap.to(message, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// Enhanced typing indicator
function addTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message bot-message typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    document.getElementById('chatMessages').appendChild(indicator);

    // Animate dots with GSAP
    gsap.to(indicator.children, {
        scale: 1.2,
        duration: 0.6,
        stagger: {
            each: 0.2,
            repeat: -1,
            yoyo: true
        },
        ease: "power2.inOut"
    });

    // Bounce animation
    gsap.to(indicator, {
        y: -3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}

function removeTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Add input focus animations
textarea.addEventListener('focus', () => {
    gsap.to('.chat-input-container', {
        boxShadow: '0 0 20px rgba(142, 68, 173, 0.2)',
        duration: 0.3
    });
});

textarea.addEventListener('blur', () => {
    gsap.to('.chat-input-container', {
        boxShadow: 'none',
        duration: 0.3
    });
});

// Enable/disable send button based on input
textarea.addEventListener('input', () => {
    const hasText = textarea.value.trim().length > 0;
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = !hasText;
    
    if (hasText) {
        gsap.to(sendBtn, {
            scale: 1.1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    } else {
        gsap.to(sendBtn, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    }
});

// Add click handlers for suggestion chips
document.querySelectorAll('.suggestion-chips button').forEach(button => {
    button.addEventListener('click', () => {
        textarea.value = button.textContent;
        textarea.dispatchEvent(new Event('input'));
        sendMessage();
    });
});

// Modify the new chat button functionality
document.querySelector('.new-chat').addEventListener('click', () => {
    // Save current conversation before creating new one
    if (currentConversationId) {
        const currentConversation = conversations.find(c => c.id === currentConversationId);
        if (currentConversation) {
            currentConversation.messages = document.getElementById('chatMessages').innerHTML;
        }
    }

    // Reset current conversation ID
    currentConversationId = null;

    // Clear chat messages
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    // Create and show welcome screen
    const welcomeScreen = document.createElement('div');
    welcomeScreen.className = 'welcome-screen';
    welcomeScreen.id = 'welcomeScreen';
    welcomeScreen.innerHTML = `
        <h1>Hello, I'm Verse AI</h1>
        <p>How can I help you today?</p>
        <div class="suggestion-chips">
            <button>Help me write</button>
            <button>Help me analyze</button>
            <button>Help me code</button>
            <button>Help me learn</button>
        </div>
    `;
    
    // Add welcome screen with animation
    chatMessages.appendChild(welcomeScreen);
    gsap.from(welcomeScreen, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out"
    });

    // Remove active state from all history items
    document.querySelectorAll('.chat-history-item').forEach(item => {
        item.classList.remove('active');
    });

    // Re-add click handlers for suggestion chips
    welcomeScreen.querySelectorAll('.suggestion-chips button').forEach(button => {
        button.addEventListener('click', () => {
            textarea.value = button.textContent;
            textarea.dispatchEvent(new Event('input'));
            sendMessage();
        });
    });

    // Clear textarea
    textarea.value = '';
    textarea.style.height = 'auto';
    document.getElementById('sendBtn').disabled = true;
});

// Add hover animation for messages
document.getElementById('chatMessages').addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('message')) {
        gsap.to(e.target, {
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
        });
    }
});

document.getElementById('chatMessages').addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('message')) {
        gsap.to(e.target, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    }
});

// Update the speech recognition initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Load voices first
    await loadVoices();
    
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.error('Speech recognition not supported');
        document.querySelector('.mic-btn').style.display = 'none';
        return;
    }

    // First request microphone permission
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream after getting permission
        
        // Initialize speech recognition
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        // Set up recognition event handlers
        recognition.onstart = () => {
            console.log('Speech recognition started');
            isListening = true;
            updateMicButton();
            showListeningAnimation();
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
            isListening = false;
            updateMicButton();
            hideListeningAnimation();
            if (wasVoiceInput) {
                wasVoiceInput = false;
            }
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join(' ');

            console.log('Transcript:', transcript); // Debug log

            const textarea = document.getElementById('userInput');
            textarea.value = transcript;
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
            
            document.getElementById('sendBtn').disabled = !transcript.trim();

            // Only send message when we get final result
            if (event.results[0].isFinal) {
                wasVoiceInput = true;
                recognition.stop();
                if (transcript.trim()) {
                    setTimeout(() => sendMessage(), 100);
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            updateMicButton();
            hideListeningAnimation();
        };

        // Add click handler for mic button
        const micButton = document.querySelector('.mic-btn');
        micButton.addEventListener('click', toggleSpeechRecognition);

    } catch (err) {
        console.error('Microphone permission denied:', err);
        document.querySelector('.mic-btn').style.display = 'none';
    }
});

// Update toggleSpeechRecognition function
function toggleSpeechRecognition() {
    if (!recognition) {
        console.error('Speech recognition not initialized');
        return;
    }

    if (isListening) {
        recognition.stop();
        stopSpeaking();
        wasVoiceInput = false;
    } else {
        stopSpeaking();
        wasVoiceInput = true;
        try {
            recognition.start();
            console.log('Starting recognition...'); // Debug log
        } catch (error) {
            console.error('Error starting recognition:', error);
            // If recognition is already started, stop and restart
            recognition.stop();
            setTimeout(() => {
                try {
                    recognition.start();
                } catch (e) {
                    console.error('Failed to restart recognition:', e);
                }
            }, 100);
        }
    }
}

// Update updateMicButton function
function updateMicButton() {
    const micBtn = document.querySelector('.mic-btn');
    const micIcon = micBtn.querySelector('i');
    
    if (isListening) {
        micBtn.classList.add('listening');
        micIcon.className = 'fas fa-stop';
    } else {
        micBtn.classList.remove('listening');
        micIcon.className = 'fas fa-microphone';
    }
}

// Show listening animation
function showListeningAnimation() {
    const animation = document.querySelector('.listening-animation');
    animation.classList.add('active');
    
    const waves = animation.querySelectorAll('.listening-wave');
    waves.forEach((wave, index) => {
        gsap.to(wave, {
            height: gsap.utils.random(10, 20),
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: index * 0.1
        });
    });
}

// Hide listening animation
function hideListeningAnimation() {
    const animation = document.querySelector('.listening-animation');
    animation.classList.remove('active');
    
    const waves = animation.querySelectorAll('.listening-wave');
    waves.forEach(wave => {
        gsap.killTweensOf(wave);
    });
}

// Update the stopSpeaking function
function stopSpeaking() {
    speechSynthesis.cancel();
    wasVoiceInput = false;
}

// Add event listener to stop speaking when user starts typing
textarea.addEventListener('keydown', () => {
    wasVoiceInput = false; // Reset voice input flag when typing
    stopSpeaking();
});

// Update loadVoices function to be more robust
function loadVoices() {
    return new Promise((resolve) => {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            resolve(voices);
        } else {
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                resolve(voices);
            };
            // Fallback in case voices don't load
            setTimeout(resolve, 1000);
        }
    });
}

// Add the stop function
function stopAllActions() {
    // Stop speaking
    speechSynthesis.cancel();
    wasVoiceInput = false;

    // Stop typing animation
    if (currentMessageTl) {
        currentMessageTl.progress(1); // Complete the typing instantly
    }
    isTyping = false;

    // Remove any highlighting
    document.querySelectorAll('.word').forEach(word => {
        word.classList.remove('speaking-word');
    });

    // Update stop button visibility
    const stopBtn = document.querySelector('.stop-btn');
    if (stopBtn) stopBtn.style.display = 'none';
}

// Add copy code functionality
function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        button.innerHTML = '<i class="fas fa-check"></i>Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i>Copy';
            button.classList.remove('copied');
        }, 2000);
    });
}

// Add syntax highlighting
function highlightCode(code) {
    return code
        .replace(/\b(function|def|class|if|else|return|import|from|as)\b/g, '<span class="keyword">$1</span>')
        .replace(/\b([a-zA-Z_]\w*)\(/g, '<span class="function">$1</span>(')
        .replace(/"([^"]*)"|'([^']*)'/g, '<span class="string">$&</span>')
        .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
        .replace(/#.*/g, '<span class="comment">$&</span>');
}


