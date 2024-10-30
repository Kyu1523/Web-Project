let cart = [];
let products = [];

//Load the products from the JSON file
async function fetchProducts() {
    try {
        const response = await fetch('https://6716f1943fcb11b265d3fceb.mockapi.io/api/v1/products'); 
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
        //Shopping cart creation time
        if (cart.length > 0 && !localStorage.getItem('cartDate')) {
            const currentDate = new Date();
            const dateString = currentDate.toISOString().split('T')[0]; 
            localStorage.setItem('cartDate', dateString);
        }
    }
    displayCart();
}

//Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
//Update Cart count
function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}
function displayCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; 

    const cartDate = localStorage.getItem('cartDate');
    if (cartDate && cart.length > 0) {
        if (cartDate) {
            const dateElement = document.createElement('p');
            dateElement.classList.add('cart-date');
            dateElement.textContent = `Shopping started on: ${cartDate}`; // Show Shopping cart creation time
            cartList.appendChild(dateElement);
        }
    }

    if (cart.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.classList.add('empty-cart-message');
        emptyMessage.innerHTML =  `Your cart is empty, <a href="index.html">Let Go Shopping</a>!`;
        cartList.appendChild(emptyMessage);
    }

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            const cartItem = document.createElement('li');
            cartItem.classList.add('cart-item');

            const imageUrl = product.image_path ? product.image_path : 'https://via.placeholder.com/150';

            const increaseButton = document.createElement('button');
            increaseButton.textContent = '+';
            increaseButton.addEventListener('click', () => updateQuantity(item.productId, 1));
            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = '-';
            decreaseButton.addEventListener('click', () => updateQuantity(item.productId, -1));
            
            cartItem.innerHTML = `
                 <img src="${imageUrl}" alt="${product.name}" style="width: 150px; height: 150px;" />
                <div class="cart-item-info">
                    <h2>${product.name}</h2>
                    <p>Price: $${product.price}</p>
                </div>
                <div class="cart-item-quantity">
                    <p>Quantity: ${item.quantity}</p> 
                </div>
            `;
            const quantityContainer = cartItem.querySelector('.cart-item-quantity');
            quantityContainer.appendChild(decreaseButton);
            quantityContainer.appendChild(document.createTextNode(item.quantity));
            quantityContainer.appendChild(increaseButton);

            cartList.appendChild(cartItem);
        }
    });
    calculateCost();
    updateCartUI(); 
    displayRecommendations();
    console.log("cart:", cart); 
}
function updateQuantity(productID,change){
    const product = cart.find(item => item.productId === productID);
    if(product){
        product.quantity+=change;
        if(product.quantity<=0){
            cart = cart.filter(item => item.productId !== productID);
        }
        saveCartToLocalStorage();
        displayCart(); 
    }
    else{
        console.error('Product not found in cart:', productID);
    }
}
function clearCart() {
    console.log('Clear cart function called');
    cart = [];
    localStorage.removeItem('cart');
    localStorage.removeItem('cartDate');
    displayCart();
}
function calculateCost(){
    const shippingCostElement = document.querySelector('.shipping-cost');
    const taxPriceElement = document.querySelector('.tax-price');
    const totalPriceElement = document.querySelector('.total-price');
    const taxRate=0.04;
    const shippingCost = cart.length > 0 ? 6.99 : 0;
    // Calculate product total
    const productTotal = cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.productId);
        if(product){
            total+=product.price*item.quantity;
            return total;
        }
        else{
            return total;
        }
    },0);
    const tax=productTotal*taxRate;
    const grandTotal=tax+productTotal+shippingCost;
    //updata cost
    shippingCostElement.textContent = `Shipping & Handling: $${shippingCost.toFixed(2)}`;
    taxPriceElement.textContent = `Estimated tax to be: $${tax.toFixed(2)}`;
    totalPriceElement.textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
    // console.log("tax:", tax); 
    // console.log("total:", grandTotal); 
}
function Successful_purchase(){
    if(cart.length === 0){
        alert("Purchase failed! Your cart is empty.")
    }
    else{
        alert("Purchase success! Thank you for your purchase.")
    }
}
function displayRecommendations() {
    const recommendedContainer = document.getElementById('recommended-products');
    recommendedContainer.innerHTML = ''; // Clear previous recommendations
    const uniqueIndices = new Set();
    const cartProductIds = cart.map(item => item.productId);

    // Get 2 unique random indices
    while (uniqueIndices.size < 2 && uniqueIndices.size < products.length) {
        const randomIndex = Math.floor(Math.random() * products.length);
        uniqueIndices.add(randomIndex);
    }

    // Create and append recommended product elements
    uniqueIndices.forEach(index => {
        const product = products[index];
        const productElement = createRecommendedProductElement(product);
        recommendedContainer.appendChild(productElement);
    });
}
function createRecommendedProductElement(product) {
    const productElement = document.createElement('div');
    productElement.classList.add('recommended-product');
    productElement.innerHTML = `
        <img src="${product.image_path || 'https://via.placeholder.com/100'}" alt="${product.name}" style="width: 100px; height: auto;" />
        <h4>${product.name}</h4>
        <p>Price: $${product.price}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;

    const addToCartButton = productElement.querySelector('.add-to-cart');
    addToCartButton.addEventListener('click', () => addToCart(product.id));
    
    return productElement;
}
function addToCart(productId) {
    const productInCart = cart.find(item => item.productId === productId);
    
    if (productInCart) {
        productInCart.quantity++;
    } 
    else {
        cart.push({ productId, quantity: 1 });
    }
    saveCartToLocalStorage();
    updateCartUI();
    loadCartFromLocalStorage();
}
// Add event listeners for buttons
document.querySelector('.clear-cart').addEventListener('click', clearCart);
document.querySelector('.checkout-cart').addEventListener('click', Successful_purchase);
fetchProducts();
//clearCart();