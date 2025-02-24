// Sample users data
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Pro', joined: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Starter', joined: '2024-01-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Enterprise', joined: '2024-01-13' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', status: 'Free', joined: '2024-01-12' }
];

// Initialize users page
document.addEventListener('DOMContentLoaded', () => {
    populateUsersTable(users);
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('userSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        populateUsersTable(filteredUsers);
    });

    // Status filter
    document.getElementById('statusFilter').addEventListener('change', filterUsers);
    
    // Sort functionality
    document.getElementById('sortBy').addEventListener('change', filterUsers);
}

// Filter and sort users
function filterUsers() {
    const statusFilter = document.getElementById('statusFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    
    let filteredUsers = [...users];
    
    // Apply status filter
    if (statusFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
    }
    
    // Apply sorting
    filteredUsers.sort((a, b) => {
        const dateA = new Date(a.joined);
        const dateB = new Date(b.joined);
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    populateUsersTable(filteredUsers);
}

// Populate users table
function populateUsersTable(usersToShow) {
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = usersToShow.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="user-status ${getStatusClass(user.status)}">
                    ${user.status}
                </span>
            </td>
            <td>${new Date(user.joined).toLocaleDateString()}</td>
            <td>
                <button class="action-btn edit-btn" onclick="showEditModal(${user.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Update the status class in populateUsersTable function
function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'starter': return 'status-starter';
        case 'pro': return 'status-pro';
        case 'enterprise': return 'status-enterprise';
        default: return 'status-free';
    }
}

// Update the modal to include all plan options
function showEditModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Edit User Plan</h2>
            <div class="user-info">
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <div class="status-select">
                    <label>Plan:</label>
                    <select id="userStatus">
                        <option value="Free" ${user.status === 'Free' ? 'selected' : ''}>Free Trial</option>
                        <option value="Starter" ${user.status === 'Starter' ? 'selected' : ''}>Starter</option>
                        <option value="Pro" ${user.status === 'Pro' ? 'selected' : ''}>Pro</option>
                        <option value="Enterprise" ${user.status === 'Enterprise' ? 'selected' : ''}>Enterprise</option>
                    </select>
                </div>
            </div>
            <div class="modal-buttons">
                <button class="action-btn edit-btn" onclick="updateUserStatus(${user.id})">Update</button>
                <button class="action-btn delete-btn" onclick="closeModal()">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
} 