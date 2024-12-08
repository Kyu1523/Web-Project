let cart = [];
let products = [];

async function fetchProducts() {
    try {
        const response = await fetch('https://6716f1943fcb11b265d3fceb.mockapi.io/api/v1/products'); 
        products = await response.json();
        displayForYou();
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
function displayForYou(){
    const carouselItems = document.querySelectorAll(".card-container");
    const uniqueIndices = new Set();
    while (uniqueIndices.size < 7 && uniqueIndices.size < products.length) {
        const randomIndex = Math.floor(Math.random() * products.length);
        uniqueIndices.add(randomIndex);
    }

    let i = 0;
    for(const index of uniqueIndices){
        const card = createCard(products[index]);
        i++;
        if(i < 5){
            carouselItems[0].append(card);
        }
        else{
            carouselItems[1].append(card);
        }
    }
}

function createCard(product){
    const card = document.createElement('div');
    card.classList.add("card");
    card.innerHTML =
    `
        <a href = "product.html"><img src = "${product.image_path || 'https://via.placeholder.com/100'}"></a>
        <div class="card-body">
            <p class="card-text">${product.name}</p>
        </div>
    `;
    return card;
}

fetchProducts();
loadCartFromLocalStorage();