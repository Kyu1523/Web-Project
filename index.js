let cart = [];
let products = [];
const currentUser = localStorage.getItem('user');

async function fetchProducts() {
    try {
        const response = await fetch('https://6716f1943fcb11b265d3fceb.mockapi.io/api/v1/products'); 
        products = await response.json();
        sessionStorage.setItem("products",JSON.stringify(products));
        loadCartFromLocalStorage();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

//Loads cart data from local storage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartUI();
    }
}

//Updates the Cart Ui
function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

//Reads from products and displays them in the for you carousel
function displayForYou(prod_list){
    const display = document.querySelector("#recommend-container");
    const uniqueIndices = new Set();
    while (uniqueIndices.size < 4 && uniqueIndices.size < prod_list.length) {
        const randomIndex = Math.floor(Math.random() * prod_list.length);
        if(prod_list[randomIndex].availability_status == "In Stock"){
            uniqueIndices.add(randomIndex);
        };
    }
    uniqueIndices.forEach(index =>{
        const card = createCard(prod_list[index]);
        console.log(card);
        display.appendChild(card);
    
    })
}

function createCard(product){
    const card = document.createElement('div');
    card.classList.add("card");
    card.innerHTML =
    `
        <a href = "product.html"><img src = "${product.image_path || 'https://via.placeholder.com/100'}"></a>
        <div class="card-body">
            <p class="card-name">${product.name}</p>
            <p class="card-price"> $${product.price} </p>
        </div>
         <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;
    const addToCartButton = card.querySelector('.add-to-cart');
    addToCartButton.addEventListener('click', () => addToCart(product.id));
    return card;
}
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
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
}
fetchProducts();
loadCartFromLocalStorage();