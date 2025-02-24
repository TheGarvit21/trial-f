document.addEventListener('DOMContentLoaded', () => {
    setupSettingsHandlers();
});

function setupSettingsHandlers() {
    // Show/Hide API Key
    const showKeyBtn = document.querySelector('.show-key-btn');
    const apiKeyInput = document.getElementById('apiKey');
    
    showKeyBtn.addEventListener('click', () => {
        const isPassword = apiKeyInput.type === 'password';
        apiKeyInput.type = isPassword ? 'text' : 'password';
        showKeyBtn.innerHTML = `<i class="fas fa-${isPassword ? 'eye-slash' : 'eye'}"></i>`;
    });

    // Save Settings
    const saveBtn = document.querySelector('.save-settings-btn');
    saveBtn.addEventListener('click', saveSettings);
}

function saveSettings() {
    const settings = {
        siteName: document.getElementById('siteName').value,
        adminEmail: document.getElementById('adminEmail').value,
        premiumPrice: document.getElementById('premiumPrice').value,
        trialDays: document.getElementById('trialDays').value,
        apiKey: document.getElementById('apiKey').value
    };

    // Here you would typically send this to your backend
    console.log('Saving settings:', settings);
    
    // Show success message
    showNotification('Settings saved successfully!');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 