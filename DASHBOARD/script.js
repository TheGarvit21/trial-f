// Sample data - Replace with actual data from your backend
const mockData = {
    totalUsers: 1250,
    premiumUsers: 450,
    activeUsers: 280,
    totalRevenue: 45600,
    userGrowth: [650, 730, 890, 950, 1100, 1250],
    revenueGrowth: [15000, 21000, 28000, 32000, 39000, 45600],
    recentUsers: [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Premium', joined: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Free', joined: '2024-01-14' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Premium', joined: '2024-01-13' },
        // Add more user data as needed
    ]
};

// Update dashboard statistics
function updateStats() {
    document.querySelector('.total-users').textContent = mockData.totalUsers.toLocaleString();
    document.querySelector('.premium-users').textContent = mockData.premiumUsers.toLocaleString();
    document.querySelector('.active-users').textContent = mockData.activeUsers.toLocaleString();
    document.querySelector('.total-revenue').textContent = `$${mockData.totalRevenue.toLocaleString()}`;
}

// Initialize charts
function initCharts() {
    // User Growth Chart
    const userCtx = document.getElementById('userGrowthChart').getContext('2d');
    new Chart(userCtx, {
        type: 'line',
        data: {
            labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
            datasets: [{
                label: 'Total Users',
                data: mockData.userGrowth,
                borderColor: '#1e88e5',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(30, 136, 229, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
            datasets: [{
                label: 'Revenue',
                data: mockData.revenueGrowth,
                backgroundColor: '#43a047'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${value.toLocaleString()}`
                    }
                }
            }
        }
    });
}

// Populate users table
function populateUsersTable() {
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = mockData.recentUsers.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="user-status ${user.status.toLowerCase() === 'premium' ? 'status-premium' : 'status-free'}">
                    ${user.status}
                </span>
            </td>
            <td>${new Date(user.joined).toLocaleDateString()}</td>
            <td>
                <button class="action-btn edit-btn" onclick="showEditModal(${user.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Export users data
document.querySelector('.export-btn').addEventListener('click', () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Email,Status,Joined\n"
        + mockData.recentUsers.map(user => 
            `${user.name},${user.email},${user.status},${user.joined}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Add these functions
function showEditModal(userId) {
    const user = mockData.recentUsers.find(u => u.id === userId);
    if (!user) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Edit User Status</h2>
            <div class="user-info">
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <div class="status-select">
                    <label>Status:</label>
                    <select id="userStatus">
                        <option value="Free" ${user.status === 'Free' ? 'selected' : ''}>Free</option>
                        <option value="Premium" ${user.status === 'Premium' ? 'selected' : ''}>Premium</option>
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

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function updateUserStatus(userId) {
    const newStatus = document.getElementById('userStatus').value;
    const userIndex = mockData.recentUsers.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        mockData.recentUsers[userIndex].status = newStatus;
        
        // Update premium users count
        mockData.premiumUsers = mockData.recentUsers.filter(u => u.status === 'Premium').length;
        
        // Refresh the display
        updateStats();
        populateUsersTable();
        closeModal();
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    initCharts();
    populateUsersTable();
});
