document.getElementById('register-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    if (username === '' || password === '') {
        alert("Please fill in all fields.");
        return;
    }

    //check user is exist？
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
        alert("Username already exists. Please choose a different one.");
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert("Registration successful! Redirecting to login page...");
    window.location.href = "login.html";
});
///Update Cart count
function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
});