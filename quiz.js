let cart = [];
let products = [];
let questionIndex = 0;
const answers = {};

//Load cart items from localStorage
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartUI();
    }
}

//Update Cart Count
function updateCartUI() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
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

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

loadCartFromLocalStorage();

async function fetchProducts() {
    try {
        const response = await fetch('https://6716f1943fcb11b265d3fceb.mockapi.io/api/v1/products'); 
        products = await response.json();
        console.log('Products loaded:', products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchProducts();
    startQuiz();
});

function startQuiz() {
    const quizContainer = document.createElement('div');
    quizContainer.classList.add('quiz-container');
    document.body.appendChild(quizContainer);

    questionIndex = 0;
    Object.keys(answers).forEach((key) => delete answers[key]);
    renderQuestion();

    function renderQuestion() {
        quizContainer.innerHTML = ''; 

        if (questionIndex < questions.length) {
            const question = document.createElement('h2');
            question.textContent = questions[questionIndex].question;
            quizContainer.appendChild(question);

            questions[questionIndex].options.forEach((option) => {
                const button = document.createElement('button');
                button.textContent = option;
                button.addEventListener('click', () => {
                    answers[questions[questionIndex].question] = option;
                    questionIndex++;
                    renderQuestion();
                });
                quizContainer.appendChild(button);
            });
        } else {
            showResult();
        }
    }
    function showResult() {
        quizContainer.innerHTML = `<h2>We matched you with a tea!</h2>`;
    
        const recommendedTea = getRecommendation();
        console.log('Recommended Tea:', recommendedTea);
    
        if (recommendedTea) {
            const teaName = document.createElement('h3');
            teaName.textContent = recommendedTea.name;
    
            const teaImage = document.createElement('img');
            teaImage.src = recommendedTea.image_path;
            teaImage.alt = recommendedTea.name;
            teaImage.style.width = '200px';
    
            const teaDescription = document.createElement('p');
            teaDescription.innerHTML = `
                ${recommendedTea.description}<br><br>
                Category: ${recommendedTea.category}<br><br>
                $${recommendedTea.price}`;
        
            quizContainer.appendChild(teaName);
            quizContainer.appendChild(teaImage);
            quizContainer.appendChild(teaDescription);
    
            const addToCartButton = document.createElement('button');
            addToCartButton.textContent = 'Add to Cart';
            addToCartButton.classList.add('add-to-cart-button');
            addToCartButton.addEventListener('click', () => {
                addToCart(recommendedTea.id);
            });
            quizContainer.appendChild(addToCartButton);
        } else {
            quizContainer.innerHTML += `<p>Sorry, we couldn't match you with a tea this time.</p>`;
        }
    
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Quiz';
        restartButton.classList.add('restart-button');
        restartButton.addEventListener('click', () => {
            questionIndex = 0;
            Object.keys(answers).forEach((key) => delete answers[key]);
            renderQuestion();
        });
        quizContainer.appendChild(restartButton);
    }
    

    function getRecommendation() {
        let bestMatch = null;
        let highestScore = 0;
    
        products.forEach((tea) => {
            let score = 0;
    
            if (answers["What kind of flavor do you prefer?"] === tea.preferences.flavor) score++;
            if (answers["What time of day do you drink tea?"] === tea.preferences.time) score++;
            if (answers["How do you drink your tea?"] === tea.preferences.temp) score++;
            if (answers["Do you prefer a boost of energy or a calming drink?"] === tea.preferences.energy) score++;
            if (answers["Do you like your tea with milk or without?"] === tea.preferences.milk) score++;
    
            if (score > highestScore) {
                highestScore = score;
                bestMatch = tea;
            }
        });
    
        return bestMatch;
    }
    
    
}

const questions = [
    {
        question: "What kind of flavor do you prefer?",
        options: ["Fruity", "Spicy", "Sweet", "Herbal"],
    },
    {
        question: "What time of day do you drink tea?",
        options: ["Morning", "Afternoon", "Evening", "Night"],
    },
    {
        question: "How do you drink your tea?",
        options: ["Hot", "Iced", "Room Temperature"],
    },
    {
        question: "Do you prefer a boost of energy or a calming drink?",
        options: ["Boost of Energy", "Calming Drink", "No Preference"],
    },
    {
        question: "Do you like your tea with milk or without?",
        options: ["With Milk", "Without Milk", "Either"],
    },
];