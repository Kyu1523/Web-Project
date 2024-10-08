let cart = [];
let products = [];
let currentIndex = 0;
const productsPerPage = 6;
let loadMoreClicks = 0;

//Load the products from the JSON file
async function fetchProducts(category = 'All') {
    try {
        const response = await fetch('products.json'); 
        products = await response.json();
        currentIndex = 0;
        displayProducts(category);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

//Load cart items from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartUI();
    }
}

//Add starts for rating
function getStars(rating) {
    let stars = '';
    for (let i = 0; i < Math.floor(rating); i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (rating % 1 !== 0) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = Math.floor(rating) + (rating % 1 !== 0 ? 1 : 0); i < 5; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

//Display products
function displayProducts(category) {
    const productList = document.getElementById('product-list');
    const loadMoreButton = document.getElementById('load-more');

    const filteredProducts = category === 'All' ? products : products.filter(product => product.category === category);
    const productsToDisplay = filteredProducts.slice(0, (loadMoreClicks + 1) * productsPerPage);

    productList.innerHTML = '';

    productsToDisplay.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const button = document.createElement('button');
        button.textContent = product.availability_status === 'In Stock' ? 'Add to Cart' : 'Out of Stock';
        button.disabled = product.availability_status === 'Out of Stock';

        if (product.availability_status === 'Out of Stock') {
            button.classList.add('out');
        }

        button.addEventListener('click', () => {
            if (product.availability_status === 'In Stock') {
                alert(`${product.name} has been added to your cart!`);
                addToCart(product.id);
            }
        });

        productDiv.innerHTML = `
            <img src="https://via.placeholder.com/300" alt="${product.name}" />
            <h2>${product.name}</h2>
            <p>${getStars(product.rating || 0)}</p>
            <p>$${product.price}</p>
        `;

        productDiv.appendChild(button);
        productList.appendChild(productDiv);
    });

    loadMoreButton.style.display = (loadMoreClicks + 1) * productsPerPage >= filteredProducts.length ? 'none' : 'block';
}

//Display more products
document.getElementById('load-more').addEventListener('click', () => {
    loadMoreClicks++;
    const selectedCategory = document.querySelector('.filter-list li.active')?.textContent || 'All';
    displayProducts(selectedCategory);
});

//Filter function
function setupFilters() {
    const filterLinks = document.querySelectorAll('.filter-list li');

    filterLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            filterLinks.forEach(link => link.classList.remove('active'));
            event.target.parentElement.classList.add('active');

            const selectedCategory = event.target.textContent;
            loadMoreClicks = 0;
            displayProducts(selectedCategory);
        });
    });
}

//Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(productId);
        saveCartToLocalStorage();
        updateCartUI();
    }
}

//Update Cart count
function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = cart.length; 
}

//Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCart() {
    console.log('Clear cart function called');
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
}


fetchProducts();
setupFilters();
loadCartFromLocalStorage();
//clearCart();