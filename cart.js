let cart = [];
let products = [];

//Load the products from the JSON file
async function fetchProducts() {
    try {
        const response = await fetch('products.json'); 
        products = await response.json();
        loadCartFromLocalStorage();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

//Load cart items from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        displayCart();
    }
}

//Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

//Display cart items
function displayCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; 

    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (product) {
            const listItem = document.createElement('li');
            listItem.textContent = `${product.name} - $${product.price} (Quantity: ${cartItem.quantity})`;
            cartList.appendChild(listItem);
        }
    });
}


function clearCart() {
    console.log('Clear cart function called');
    cart = [];
    localStorage.removeItem('cart');
    displayCart();
}

fetchProducts();
//clearCart();
