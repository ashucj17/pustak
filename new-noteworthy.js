// Book data with categories and additional properties for filtering
const booksData = [
    {
        title: "Visual Mathematics",
        author: "John Derbyshire",
        category: "science",
        rating: 4.9,
        price: 599,
        image: "images/mathematics.jpg",
        releaseDate: "2024-01-15",
        popularity: 95
    },
    {
        title: "Physics Heroes",
        author: "Bill Coates",
        category: "science",
        rating: 4.7,
        price: 549,
        image: "images/bill-coates.jpg",
        releaseDate: "2024-02-20",
        popularity: 88
    },
    {
        title: "Physics of Everyday Life",
        author: "Dr. Emma Watson",
        category: "science",
        rating: 4.5,
        price: 699,
        image: "images/carying-baby.jpg",
        releaseDate: "2024-03-10",
        popularity: 82
    },
    {
        title: "Food Science & Nutrition",
        author: "Dr. Maria Rodriguez",
        category: "science",
        rating: 4.8,
        price: 799,
        image: "images/food-book.jpg",
        releaseDate: "2024-04-05",
        popularity: 91
    },
    {
        title: "Learning Revolution",
        author: "Prof. David Kim",
        category: "non-fiction",
        rating: 4.6,
        price: 649,
        image: "images/students.jpg",
        releaseDate: "2024-05-12",
        popularity: 76
    },
    {
        title: "Hands-On Learning",
        author: "Sarah Johnson",
        category: "non-fiction",
        rating: 4.4,
        price: 529,
        image: "images/wokrshop.jpg",
        releaseDate: "2024-06-01",
        popularity: 73
    },
    {
        title: "The Quantum Universe",
        author: "Dr. Sarah Mitchell",
        category: "science",
        rating: 4.8,
        price: 899,
        originalPrice: 1299,
        image: "images/microscopic-event.jpg",
        releaseDate: "2024-05-20",
        popularity: 98,
        badge: "Bestseller"
    },
    {
        title: "Mathematical Minds",
        author: "Prof. Alex Chen",
        category: "biography",
        rating: 4.6,
        price: 749,
        originalPrice: 999,
        image: "images/mathematician.jpg",
        releaseDate: "2024-06-15",
        popularity: 85,
        badge: "New Release"
    }
];

let currentBooks = [...booksData];
let currentCategory = '';
let currentSort = 'newest';

// DOM Elements
const categorySelect = document.getElementById('category');
const sortSelect = document.getElementById('sort');
const booksContainer = document.getElementById('booksContainer');

// Initialize filters
function initializeFilters() {
    categorySelect.addEventListener('change', handleCategoryChange);
    sortSelect.addEventListener('change', handleSortChange);
    
    // Initial render
    renderBooks(currentBooks);
}

// Handle category filter change
function handleCategoryChange(e) {
    currentCategory = e.target.value;
    filterAndSortBooks();
}

// Handle sort change
function handleSortChange(e) {
    currentSort = e.target.value;
    filterAndSortBooks();
}

// Filter and sort books based on current selections
function filterAndSortBooks() {
    let filteredBooks = [...booksData];
    
    // Apply category filter
    if (currentCategory && currentCategory !== '') {
        filteredBooks = filteredBooks.filter(book => book.category === currentCategory);
    }
    
    // Apply sorting
    filteredBooks = sortBooks(filteredBooks, currentSort);
    
    currentBooks = filteredBooks;
    renderBooks(currentBooks);
    
    // Update results count
    updateResultsCount(filteredBooks.length);
}

// Sort books based on selected criteria
function sortBooks(books, sortBy) {
    const sortedBooks = [...books];
    
    switch (sortBy) {
        case 'newest':
            return sortedBooks.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        
        case 'popular':
            return sortedBooks.sort((a, b) => b.popularity - a.popularity);
        
        case 'rating':
            return sortedBooks.sort((a, b) => b.rating - a.rating);
        
        case 'price-low':
            return sortedBooks.sort((a, b) => a.price - b.price);
        
        case 'price-high':
            return sortedBooks.sort((a, b) => b.price - a.price);
        
        default:
            return sortedBooks;
    }
}

// Render books to the DOM
function renderBooks(books) {
    if (books.length === 0) {
        booksContainer.innerHTML = `
            <div class="no-results">
                <h3>No books found</h3>
                <p>Try adjusting your filters to see more results.</p>
            </div>
        `;
        return;
    }
    
    const booksHTML = books.map(book => createBookCard(book)).join('');
    booksContainer.innerHTML = booksHTML;
    
    // Add event listeners to new buttons
    addBookActionListeners();
}

// Create individual book card HTML
function createBookCard(book) {
    const stars = generateStarRating(book.rating);
    const priceHTML = book.originalPrice 
        ? `<div class="price">₹${book.price} <span class="original-price">₹${book.originalPrice}</span></div>`
        : `<div class="price">₹${book.price}</div>`;
    
    const badgeHTML = book.badge 
        ? `<div class="book-badge">${book.badge}</div>`
        : '';
    
    return `
        <div class="book-card" data-category="${book.category}">
            ${badgeHTML}
            <div class="book-img" style="background-image: url('${book.image}')"></div>
            <div class="book-content">
                <h3>${book.title}</h3>
                <p class="author">by ${book.author}</p>
                <div class="rating">
                    ${stars}
                    <span>(${book.rating})</span>
                </div>
                ${priceHTML}
                <div class="book-actions">
                    <button class="btn-primary" onclick="addToCart('${book.title}')">Add to Cart</button>
                    <button class="btn-secondary" onclick="toggleWishlist('${book.title}')">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fa-solid fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    
    // Empty stars
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
        starsHTML += '<i class="fa-regular fa-star"></i>';
    }
    
    return starsHTML;
}

// Update results count (you can add this element to your HTML)
function updateResultsCount(count) {
    let resultsElement = document.querySelector('.results-count');
    if (!resultsElement) {
        resultsElement = document.createElement('div');
        resultsElement.className = 'results-count';
        resultsElement.style.cssText = 'margin: 20px 0; font-weight: 500; color: #666;';
        
        const container = document.querySelector('.books-grid .container');
        if (container) {
            container.insertBefore(resultsElement, booksContainer);
        }
    }
    
    resultsElement.textContent = `Showing ${count} book${count !== 1 ? 's' : ''}`;
    
    if (currentCategory) {
        const categoryName = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
        resultsElement.textContent += ` in ${categoryName}`;
    }
}

// Add event listeners to book action buttons
function addBookActionListeners() {
    // This function can be expanded if you need to add more complex event handling
}

// Book action functions
function addToCart(bookTitle) {
    // Add your cart functionality here
    console.log(`Added "${bookTitle}" to cart`);
    
    // Show a simple notification
    showNotification(`"${bookTitle}" added to cart!`, 'success');
}

function toggleWishlist(bookTitle) {
    // Add your wishlist functionality here
    console.log(`Toggled wishlist for "${bookTitle}"`);
    
    // Show a simple notification
    showNotification(`"${bookTitle}" added to wishlist!`, 'info');
}

// Simple notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// View toggle functionality (grid/list view)
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            viewButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const view = btn.getAttribute('data-view');
            toggleView(view);
        });
    });
}

// Toggle between grid and list view
function toggleView(view) {
    const booksContainer = document.getElementById('booksContainer');
    
    if (view === 'list') {
        booksContainer.classList.add('list-view');
    } else {
        booksContainer.classList.remove('list-view');
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const hamburger = document.querySelector('.fa-bars');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const closeMenu = document.querySelector('.close-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    if (hamburger && mobileMenuContainer) {
        hamburger.addEventListener('click', () => {
            mobileMenuContainer.classList.add('active');
        });
    }
    
    if (closeMenu && mobileMenuContainer) {
        closeMenu.addEventListener('click', () => {
            mobileMenuContainer.classList.remove('active');
        });
    }
    
    if (overlay && mobileMenuContainer) {
        overlay.addEventListener('click', () => {
            mobileMenuContainer.classList.remove('active');
        });
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filterAndSortBooks();
        return;
    }
    
    let filteredBooks = [...booksData];
    
    // Apply category filter first
    if (currentCategory && currentCategory !== '') {
        filteredBooks = filteredBooks.filter(book => book.category === currentCategory);
    }
    
    // Apply search filter
    filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );
    
    // Apply sorting
    filteredBooks = sortBooks(filteredBooks, currentSort);
    
    currentBooks = filteredBooks;
    renderBooks(currentBooks);
    updateResultsCount(filteredBooks.length);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeViewToggle();
    initializeMobileMenu();
    initializeSearch();
});

// Newsletter subscription
function initializeNewsletter() {
    const newsletterForms = document.querySelectorAll('.newsletter-form, .newsletter');
    
    newsletterForms.forEach(form => {
        const button = form.querySelector('button, .card-btn');
        const input = form.querySelector('input[type="email"]');
        
        if (button && input) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const email = input.value.trim();
                
                if (email && isValidEmail(email)) {
                    showNotification('Successfully subscribed to newsletter!', 'success');
                    input.value = '';
                } else {
                    showNotification('Please enter a valid email address', 'error');
                }
            });
        }
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add newsletter initialization to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    initializeViewToggle();
    initializeMobileMenu();
    initializeSearch();
    initializeNewsletter();
});