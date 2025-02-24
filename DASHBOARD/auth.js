// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn && !window.location.href.includes('login.html')) {
        showLoginModal();
        return false;
    }
    return true;
}

// Create and show login modal
function showLoginModal() {
    // Remove any existing modal first
    const existingModal = document.querySelector('.auth-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add blur to dashboard content
    document.querySelector('.dashboard').classList.add('modal-open');

    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <h2>Admin Login</h2>
            <p class="login-hint">Use username: "admin" and password: "admin"</p>
            <form id="authForm" onsubmit="return handleAuthSubmit(event)">
                <div class="input-group">
                    <i class="fas fa-user"></i>
                    <input type="text" id="authUsername" placeholder="Username" required autofocus>
                </div>
                <div class="input-group">
                    <i class="fas fa-lock"></i>
                    <input type="password" id="authPassword" placeholder="Password" required>
                </div>
                <div id="authError" class="error-message"></div>
                <button type="submit">Login</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // Focus on username input
    setTimeout(() => {
        const usernameInput = document.getElementById('authUsername');
        if (usernameInput) {
            usernameInput.focus();
        }
    }, 100);
}

// Handle auth form submission
function handleAuthSubmit(event) {
    event.preventDefault();
    
    const username = document.getElementById('authUsername').value;
    const password = document.getElementById('authPassword').value;
    const errorDiv = document.getElementById('authError');
    
    if (username === 'admin' && password === 'admin') {
        sessionStorage.setItem('isLoggedIn', 'true');
        document.querySelector('.dashboard').classList.remove('modal-open');
        document.querySelector('.auth-modal').remove();
        window.location.reload();
    } else {
        errorDiv.textContent = 'Invalid username or password';
        errorDiv.style.display = 'block';
    }
    
    return false;
}

// Handle logout
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    window.location.reload();
}

// Wait for DOM to be fully loaded before checking auth
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.href.includes('login.html')) {
        checkAuth();
    }
});

// Also check immediately in case DOMContentLoaded has already fired
if (document.readyState === 'complete' && !window.location.href.includes('login.html')) {
    checkAuth();
} 