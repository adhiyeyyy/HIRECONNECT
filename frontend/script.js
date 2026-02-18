// Global script for shared logic

// Check authentication
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authLink = document.getElementById('authLink');
    if (authLink) {
        if (user) {
            authLink.textContent = 'Logout';
            authLink.href = '#';
            authLink.onclick = () => {
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            };
        } else {
            authLink.textContent = 'Login';
            authLink.href = 'login.html';
        }
    }
    return user;
}

document.addEventListener('DOMContentLoaded', checkAuth);

// Helper to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}
