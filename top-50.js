// Global variables
let booksData = []; // Will be loaded from books.json
let filteredBooks = [];
let currentPage = 1;
const booksPerPage = 9;
let currentView = 'grid';
let currentSearchTerm = '';
let cart = [];
let wishlist = [];

// DOM elements
const categoryFilter = document.getElementById('category');
const sortSelect = document.getElementById('sort');
const booksContainer = document.getElementById('booksContainer');
const viewBtns = document.querySelectorAll('.view-btn');
const paginationContainer = document.querySelector('.pagination');
const searchInput = document.querySelector('.search-bar input');
const resultsCounter = document.getElementById('resultsCounter');
const loadingIndicator = document.getElementById('loadingIndicator');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    showLoading();
    loadBooksData();
});

// Load books data from JSON file
async function loadBooksData() {
    try {
        const response = await fetch('books.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
        
        // Fix: Access the 'books' property from the JSON data
        booksData = jsonData.books || [];
        filteredBooks = [...booksData];
        
        // Validate that we have data
        if (!booksData || booksData.length === 0) {
            throw new Error('No books data found in JSON file');
        }
        
        // Initialize the page after data is loaded
        initializePage();
        hideLoading();
        
    } catch (error) {
        console.error('Error loading books data:', error);
        handleLoadError();
    }
}

// Handle loading error
function handleLoadError() {
    hideLoading();
    if (booksContainer) {
        booksContainer.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <h3>Unable to load books</h3>
                <p>There was an error loading the book catalog. Please try refreshing the page.</p>
                <button class="btn-primary" onclick="location.reload()">Refresh Page</button>
            </div>
        `;
    }
}

// Initialize all page functionality
function initializePage() {
    // Validate that we have data
    if (!booksData || booksData.length === 0) {
        console.error('No books data available');
        handleLoadError();
        return;
    }
    
    // Populate category filter with unique categories from the data
    populateCategoryFilter();
    
    // Sort books by rating initially (for Top 50 ranking)
    sortBooks('rank');
    
    // Initial render
    renderBooks();
    renderPagination();
    updateResultsCounter();
    
    // Event listeners
    setupEventListeners();
    
    // Load saved preferences
    loadUserPreferences();
    
    // Initialize tooltips and other UI enhancements
    initializeUIEnhancements();
}

// Setup all event listeners
function setupEventListeners() {
    // Filter and sort event listeners
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleFilter);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch(e);
            }
        });
    }
    
    // View toggle functionality
    viewBtns.forEach(btn => {
        btn.addEventListener('click', handleViewToggle);
    });
    
    // Mobile menu functionality
    setupMobileMenu();
    
    // Keyboard navigation
    setupKeyboardNavigation();
    
    // Window resize handler for responsive behavior
    window.addEventListener('resize', debounce(handleWindowResize, 250));
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const menuToggle = document.querySelector('.fa-bars');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const closeMenu = document.querySelector('.close-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
    if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-active')) {
            closeMobileMenu();
        }
    });
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Arrow key navigation for pagination
        if (e.ctrlKey) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (currentPage > 1) {
                        goToPage(currentPage - 1);
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
                    if (currentPage < totalPages) {
                        goToPage(currentPage + 1);
                    }
                    break;
            }
        }
    });
}

// Populate category filter dropdown
function populateCategoryFilter() {
    if (!categoryFilter || !booksData || booksData.length === 0) return;
    
    const categories = [...new Set(booksData.map(book => book.category))];
    categories.sort();
    
    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = capitalizeFirst(category);
        categoryFilter.appendChild(option);
    });
}

// Handle category filtering
function handleFilter() {
    showLoading();
    
    setTimeout(() => {
        const selectedCategory = categoryFilter.value;
        
        // Start with all books or search results
        if (currentSearchTerm) {
            filteredBooks = searchBooks(currentSearchTerm);
        } else {
            filteredBooks = [...booksData];
        }
        
        // Apply category filter
        if (selectedCategory !== '') {
            filteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
        }
        
        // Re-sort the filtered books
        const currentSort = sortSelect ? sortSelect.value : 'rank';
        sortBooks(currentSort);
        
        currentPage = 1;
        renderBooks();
        renderPagination();
        updateResultsCounter();
        saveUserPreferences();
        hideLoading();
    }, 200);
}

// Handle sorting
function handleSort() {
    showLoading();
    
    setTimeout(() => {
        const sortBy = sortSelect.value;
        sortBooks(sortBy);
        renderBooks();
        renderPagination(); // Add this to update pagination after sorting
        saveUserPreferences();
        hideLoading();
    }, 200);
}

// Handle search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    currentSearchTerm = searchTerm;
    
    showLoading();
    
    setTimeout(() => {
        if (searchTerm === '') {
            filteredBooks = [...booksData];
        } else {
            filteredBooks = searchBooks(searchTerm);
        }
        
        // Apply current category filter if any
        const selectedCategory = categoryFilter ? categoryFilter.value : '';
        if (selectedCategory !== '') {
            filteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
        }
        
        // Re-sort the filtered books
        const currentSort = sortSelect ? sortSelect.value : 'rank';
        sortBooks(currentSort);
        
        currentPage = 1;
        renderBooks();
        renderPagination();
        updateResultsCounter();
        hideLoading();
    }, 300);
}

// Search books function
function searchBooks(searchTerm) {
    return booksData.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm)
    );
}

// Sort books based on criteria
function sortBooks(sortBy) {
    switch (sortBy) {
        case 'rating':
            filteredBooks.sort((a, b) => b.rating - a.rating);
            break;
        case 'reviews':
            filteredBooks.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'price-low':
            filteredBooks.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredBooks.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredBooks.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            break;
        case 'title':
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'author':
            filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
            break;
        case 'rank':
        default:
            // For ranking, we'll use a combination of rating and popularity
            filteredBooks.sort((a, b) => {
                const scoreA = (a.rating * 0.7) + ((a.popularity / 100) * 0.3);
                const scoreB = (b.rating * 0.7) + ((b.popularity / 100) * 0.3);
                return scoreB - scoreA;
            });
            break;
    }
}

// Handle view toggle
function handleViewToggle(e) {
    viewBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    const view = e.target.getAttribute('data-view');
    currentView = view;
    
    if (booksContainer) {
        if (view === 'list') {
            booksContainer.classList.add('list-view');
        } else {
            booksContainer.classList.remove('list-view');
        }
    }
    
    saveUserPreferences();
}

// Render books for current page
function renderBooks() {
    if (!booksContainer) return;
    
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToShow = filteredBooks.slice(startIndex, endIndex);
    
    booksContainer.innerHTML = '';
    
    if (booksToShow.length === 0) {
        renderNoResults();
        return;
    }
    
    booksToShow.forEach((book, index) => {
        const rankNumber = startIndex + index + 1;
        const bookCard = createBookCard(book, rankNumber);
        booksContainer.appendChild(bookCard);
    });
    
    // Add event listeners to new buttons
    addBookCardEventListeners();
    
    // Add intersection observer for animations
    observeBookCards();
}

// Render no results message
function renderNoResults() {
    booksContainer.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">📚</div>
            <h3>No books found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button class="btn-primary" onclick="clearAllFilters()">Clear All Filters</button>
        </div>
    `;
}

// Clear all filters function
function clearAllFilters() {
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (sortSelect) sortSelect.value = 'rank';
    
    currentSearchTerm = '';
    filteredBooks = [...booksData];
    sortBooks('rank');
    currentPage = 1;
    
    renderBooks();
    renderPagination();
    updateResultsCounter();
    saveUserPreferences();
}

// Create a book card element
function createBookCard(book, rank) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.setAttribute('data-book-id', book.title);
    
    const stars = generateStars(book.rating);
    const isInWishlist = wishlist.some(item => item.title === book.title);
    const isInCart = cart.some(item => item.title === book.title);
    
    bookCard.innerHTML = `
        <div class="rank-number">${rank}</div>
        <div class="book-img" style="background-image: url('${book.image}')" 
             onerror="this.style.backgroundImage='url(https://via.placeholder.com/200x300?text=Book+Cover)'">
        </div>
        <div class="book-content">
            <h3 class="book-title" title="${book.title}">${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <div class="book-meta">
                <span class="category-tag">${capitalizeFirst(book.category)}</span>
                <span class="release-date">${formatDate(book.releaseDate)}</span>
            </div>
            <div class="rating">
                ${stars}
                <span class="rating-text">(${book.rating}) • ${book.popularity}% popularity</span>
            </div>
            <div class="price">₹${formatPrice(book.price)}</div>
            <div class="book-actions">
                <button class="btn-primary ${isInCart ? 'added' : ''}" 
                        data-action="cart" data-book='${JSON.stringify(book)}'>
                    ${isInCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
                <button class="btn-secondary ${isInWishlist ? 'wishlisted' : ''}" 
                        data-action="wishlist" data-book='${JSON.stringify(book)}' 
                        title="${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="btn-info" data-action="preview" data-book='${JSON.stringify(book)}' 
                        title="Quick Preview">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `;
    
    return bookCard;
}

// FIXED: Render pagination with working functionality
function renderPagination() {
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})" title="Previous Page">‹</button>`;
    }
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})" title="Next Page">›</button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

// FIXED: Update results counter with proper information
function updateResultsCounter() {
    if (resultsCounter) {
        const startIndex = (currentPage - 1) * booksPerPage + 1;
        const endIndex = Math.min(currentPage * booksPerPage, filteredBooks.length);
        const totalBooks = filteredBooks.length;
        
        if (totalBooks === 0) {
            resultsCounter.textContent = 'No books found';
        } else {
            resultsCounter.textContent = `Showing ${startIndex}-${endIndex} of ${totalBooks} books`;
        }
    }
}

// FIXED: Add event listeners for book card buttons
function addBookCardEventListeners() {
    const cartButtons = document.querySelectorAll('[data-action="cart"]');
    const wishlistButtons = document.querySelectorAll('[data-action="wishlist"]');
    const previewButtons = document.querySelectorAll('[data-action="preview"]');
    
    cartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', handleAddToWishlist);
    });
    
    previewButtons.forEach(button => {
        button.addEventListener('click', handleBookPreview);
    });
}

// Handle add to cart
function handleAddToCart(e) {
    const button = e.target;
    const bookData = JSON.parse(button.getAttribute('data-book'));
    
    const existingItem = cart.find(item => item.title === bookData.title);
    
    if (existingItem) {
        // Remove from cart
        cart = cart.filter(item => item.title !== bookData.title);
        button.textContent = 'Add to Cart';
        button.classList.remove('added');
    } else {
        // Add to cart
        cart.push(bookData);
        button.textContent = 'Added to Cart';
        button.classList.add('added');
    }
    
    saveUserPreferences();
    console.log('Cart updated:', cart);
}

// Handle add to wishlist
function handleAddToWishlist(e) {
    const button = e.target.closest('button');
    const bookData = JSON.parse(button.getAttribute('data-book'));
    
    const existingItem = wishlist.find(item => item.title === bookData.title);
    
    if (existingItem) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.title !== bookData.title);
        button.classList.remove('wishlisted');
        button.title = 'Add to Wishlist';
    } else {
        // Add to wishlist
        wishlist.push(bookData);
        button.classList.add('wishlisted');
        button.title = 'Remove from Wishlist';
    }
    
    saveUserPreferences();
    console.log('Wishlist updated:', wishlist);
}

// Handle book preview
function handleBookPreview(e) {
    const bookData = JSON.parse(e.target.closest('button').getAttribute('data-book'));
    console.log('Preview book:', bookData);
    // You can implement a modal or preview functionality here
    alert(`Preview for: ${bookData.title} by ${bookData.author}`);
}

// Utility Functions
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    });
}

function formatPrice(price) {
    return price.toLocaleString('en-IN');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }
}

function hideLoading() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

function observeBookCards() {
    // Implement intersection observer for animations
    const bookCards = document.querySelectorAll('.book-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });
        
        bookCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            observer.observe(card);
        });
    }
}

function openMobileMenu() {
    document.body.classList.add('mobile-menu-active');
}

function closeMobileMenu() {
    document.body.classList.remove('mobile-menu-active');
}

function goToPage(page) {
    currentPage = page;
    renderBooks();
    renderPagination();
    updateResultsCounter();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleWindowResize() {
    // Handle responsive behavior on window resize
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
        closeMobileMenu();
    }
}

// FIXED: Load user preferences from localStorage
function loadUserPreferences() {
    try {
        const savedCart = localStorage.getItem('bookCart');
        const savedWishlist = localStorage.getItem('bookWishlist');
        const savedView = localStorage.getItem('bookView');
        const savedSort = localStorage.getItem('bookSort');
        const savedCategory = localStorage.getItem('bookCategory');
        
        if (savedCart) cart = JSON.parse(savedCart);
        if (savedWishlist) wishlist = JSON.parse(savedWishlist);
        if (savedView) {
            currentView = savedView;
            const viewBtn = document.querySelector(`[data-view="${savedView}"]`);
            if (viewBtn) {
                viewBtns.forEach(btn => btn.classList.remove('active'));
                viewBtn.classList.add('active');
                if (savedView === 'list' && booksContainer) {
                    booksContainer.classList.add('list-view');
                }
            }
        }
        if (savedSort && sortSelect) sortSelect.value = savedSort;
        if (savedCategory && categoryFilter) categoryFilter.value = savedCategory;
        
    } catch (error) {
        console.error('Error loading user preferences:', error);
    }
}

// FIXED: Save user preferences to localStorage
function saveUserPreferences() {
    try {
        localStorage.setItem('bookCart', JSON.stringify(cart));
        localStorage.setItem('bookWishlist', JSON.stringify(wishlist));
        localStorage.setItem('bookView', currentView);
        if (sortSelect) localStorage.setItem('bookSort', sortSelect.value);
        if (categoryFilter) localStorage.setItem('bookCategory', categoryFilter.value);
    } catch (error) {
        console.error('Error saving user preferences:', error);
    }
}

function initializeUIEnhancements() {
    // Add smooth scrolling to page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading states to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.opacity = '0.7';
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 200);
            }
        });
    });
}