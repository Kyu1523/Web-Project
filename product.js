let cart = [];
let products = [];

let currentIndex = 0;
let loadMoreClicks = 0;
const productsPerPage = 6;

let priceGap = 20;
const rangevalue = document.querySelector(".slider-container .price-slider");
const rangeInputvalue = document.querySelectorAll(".range-input input");
const priceInputvalue = document.querySelectorAll(".price-input input");

const modal = document.getElementById('productModal');
const modalProductImage = document.getElementById('modalProductImage');
const modalProductName = document.getElementById('modalProductName');
const modalProductDescription = document.getElementById('modalProductDescription');
const modalProductPrice = document.getElementById('modalProductPrice');
const closeButton = document.getElementsByClassName('close')[0];
const continueButton = document.getElementById('continue');

//Load the products from the JSON file
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

//Load cart items from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartUI();
    }
}

for (let i = 0; i < priceInputvalue.length; i++) {
    priceInputvalue[i].addEventListener("input", e => {

        // Parse min and max values of the range input
        let minp = parseInt(priceInputvalue[0].value);
        let maxp = parseInt(priceInputvalue[1].value);
        let diff = maxp - minp;

        if (minp < 0) {
            alert("Minimum price cannot be less than 0");
            priceInputvalue[0].value = 0;
            minp = 0;
        }

        // Validate the input values
        if (maxp > 120) {
            alert("Maximum price cannot be greater than 120");
            priceInputvalue[1].value = 120;
            maxp = 120;
        }

        if (minp > maxp - priceGap) {
            priceInputvalue[0].value = maxp - priceGap;
            minp = maxp - priceGap;

            if (minp < 0) {
                priceInputvalue[0].value = 0;
                minp = 0;
            }
        }

        // Check if the price gap is met and max price is within the range
        if (diff >= priceGap && maxp <= rangeInputvalue[1].max) {
            if (e.target.className === "min-input") {
                rangeInputvalue[0].value = minp;
                let value1 = rangeInputvalue[0].max;
                rangevalue.style.left = `${(minp / value1) * 100}%`;
            }
            else {
                rangeInputvalue[1].value = maxp;
                let value2 = rangeInputvalue[1].max;
                rangevalue.style.right = `${100 - (maxp / value2) * 100}%`;
            }
        }

        const selectedCategory = document.querySelector('.filter-list li.active')?.textContent || 'All';
        displayProducts(selectedCategory, minp, maxp); // Pass min and max to filter products
    });

    // Add event listeners to range input elements
    for (let i = 0; i < rangeInputvalue.length; i++) {
        rangeInputvalue[i].addEventListener("input", e => {
            let minVal = parseInt(rangeInputvalue[0].value);
            let maxVal = parseInt(rangeInputvalue[1].value);

            let diff = maxVal - minVal;

            // Check if the price gap is exceeded
            if (diff < priceGap) {
                // Check if the input is the min range input
                if (e.target.className === "min-range") {
                    rangeInputvalue[0].value = maxVal - priceGap;
                }
                else {
                    rangeInputvalue[1].value = minVal + priceGap;
                }
            } else {
                // Update price inputs and range progress
                priceInputvalue[0].value = minVal;
                priceInputvalue[1].value = maxVal;
                rangevalue.style.left = `${(minVal / rangeInputvalue[0].max) * 100}%`;
                rangevalue.style.right = `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`;
            }

            const selectedCategory = document.querySelector('.filter-list li.active')?.textContent || 'All';
            displayProducts(selectedCategory, minVal, maxVal);
        });
    }
}

//Add star for rating
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

// Display products
function displayProducts(category, minPrice = 0, maxPrice = 120) {
    const productList = document.getElementById('product-list');
    const loadMoreButton = document.getElementById('load-more');

    // Display all products if 'All' is selected
    const filteredProducts = category === 'All'
        ? products
        : products.filter(product => Array.isArray(product.category)
            ? product.category.includes(category)
            : product.category === category);

    // Filter products based on the price range
    const productsInRange = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);

    const productsToDisplay = productsInRange.slice(0, (loadMoreClicks + 1) * productsPerPage);

    // Clear the current product list
    productList.innerHTML = '';

    // Loop through and display filtered products
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
                addToCart(product.id);

                modalProductName.textContent = product.name;
                modalProductDescription.textContent = product.description;
                modalProductPrice.textContent = `$${product.price.toFixed(2)}`;

                if (product.image_path) {
                    modalProductImage.src = product.image_path;
                } else {
                    modalProductImage.src = 'https://via.placeholder.com/300';
                }

                modal.style.display = 'block';
            }
        });

        // Product details display
        productDiv.innerHTML = `
            <img src="${product.image_path || 'https://via.placeholder.com/300'}" alt="${product.name}" />
            <h2>${product.name}</h2>
            <p>${getStars(product.rating || 0)}</p>
            <p>$${product.price.toFixed(2)}</p>
        `;

        productDiv.appendChild(button);
        productList.appendChild(productDiv);
    });

    loadMoreButton.style.display = (loadMoreClicks + 1) * productsPerPage >= productsInRange.length ? 'none' : 'block';
}

continueButton.addEventListener('click', () => {
    modal.style.display = 'none';
});
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

//Display more products
document.getElementById('load-more').addEventListener('click', () => {
    loadMoreClicks++;
    const selectedCategory = document.querySelector('.filter-list li.active')?.textContent || 'All';
    displayProducts(selectedCategory);
});

const toggleButton = document.getElementById("filter-toggle-btn");
const filterSection = document.getElementById("filter-section");

toggleButton.addEventListener("click", function () {
    filterSection.classList.toggle("hide");
    if (filterSection.classList.contains("hide")) {
    } else {
    }
});


//Add to cart
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

//Update Cart count
function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
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
