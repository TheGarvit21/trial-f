document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    setupDateRangeFilter();
});

function initializeCharts() {
    // User Growth Trend Chart
    const userTrendCtx = document.getElementById('userTrendChart').getContext('2d');
    new Chart(userTrendCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Total Users',
                data: [500, 800, 1200, 1500, 2000, 2500],
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
            }
        }
    });

    // User Distribution Chart
    const distributionCtx = document.getElementById('userDistributionChart').getContext('2d');
    new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Premium Users', 'Free Users'],
            datasets: [{
                data: [450, 800],
                backgroundColor: ['#43a047', '#1e88e5']
            }]
        }
    });

    // Revenue Analysis Chart
    const revenueCtx = document.getElementById('revenueAnalysisChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue',
                data: [5000, 7500, 10000, 12500, 15000, 18000],
                backgroundColor: '#43a047'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function setupDateRangeFilter() {
    const applyBtn = document.querySelector('.apply-btn');
    applyBtn.addEventListener('click', () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        // Implement date range filtering logic here
        console.log('Filtering data between:', startDate, 'and', endDate);
    });
} 