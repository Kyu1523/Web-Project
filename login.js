document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    //set amdin account
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const adminAccount = { username: "admin", password: "admin123" };

    const validUser = users.find(user => user.username === username && user.password === password);

    //bool is find the user
    if (username === adminAccount.username && password === adminAccount.password) {
        localStorage.setItem('user', "Admin");
        window.location.href = "orders.html";
    }
    else if (validUser) {
        // Successful
        localStorage.setItem('user', username); 
        window.location.href = "orders.html"; 
    } 
    else {
        alert("Invalid username or password");
    }
});
//Update Cart count
function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
});