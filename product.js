let cart = [];
let products = [];
let currentIndex = 0;
const productsPerPage = 6;
let loadMoreClicks = 0;

// Load the products from the MockAPI endpoint
async function fetchProducts(category = 'All') {
    try {
        const response = await fetch('https://6716f1943fcb11b265d3fceb.mockapi.io/api/v1/products'); 
        products = await response.json();
        currentIndex = 0;
        displayProducts(category);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Load cart items from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartUI();
    }
}

// Add stars for rating
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

// Display products
function displayProducts(category) {
    const productList = document.getElementById('product-list');
    const loadMoreButton = document.getElementById('load-more');

    // Display all products if 'All' is selected
    const filteredProducts = category === 'All'
        ? products
        : products.filter(product => Array.isArray(product.category)
            ? product.category.includes(category)
            : product.category === category);
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

// Display more products
document.getElementById('load-more').addEventListener('click', () => {
    loadMoreClicks++;
    const selectedCategory = document.querySelector('.filter-list li.active')?.textContent || 'All';
    displayProducts(selectedCategory);
});

// Filter function
function setupFilters() {
    const filterLinks = document.querySelectorAll('.filter-list li');

    if (filterLinks.length > 0) {
        filterLinks[0].classList.add('active');
        displayProducts('All');
    }

    filterLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            filterLinks.forEach(link => link.classList.remove('active'));
            event.target.parentElement.classList.add('active');

            const selectedCategory = event.target.textContent;
            loadMoreClicks = 0;

            displayProducts(selectedCategory === 'All' ? 'All' : selectedCategory);
        });
    });
}

// Add to cart
function addToCart(productId) {
    const productInCart = cart.find(item => item.productId === productId);
    
    if (productInCart) {
        productInCart.quantity++;
    } else {
        cart.push({ productId, quantity: 1 });
    }
    
    saveCartToLocalStorage();
    updateCartUI();
}

// Update Cart count
function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Save cart to localStorage
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
// clearCart();
