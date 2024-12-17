window.onload = function () {
    const currentUser = localStorage.getItem('user');
    const currentPath = window.location.pathname;
    if (currentPath.includes('login.html') && currentUser) {
        localStorage.setItem('user', currentUser);
        alert(`Welcome ${currentUser}!`);
        window.location.href = 'orders.html';
    }
    if (currentPath.includes('orders.html') && !currentUser) {
        localStorage.setItem('user', username);
        alert('Please log in first!');
        window.location.href = 'login.html';
    }
};