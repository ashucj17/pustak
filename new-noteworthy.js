// Optimized Book Management System
let allBooksData = [];
let currentBooks = [];
let currentCategory = '';
let currentSort = 'newest';
let currentPage = 1;
let booksPerPage = 9;
let isFiltered = false;
let searchTerm = '';

// DOM Elements
const categorySelect = document.getElementById('category');
const sortSelect = document.getElementById('sort');
const booksContainer = document.getElementById('booksContainer');

// Load books from JSON file with fallback
async function loadBooksData() {
    try {
        const response = await fetch('books.json');
        const data = await response.json();
        allBooksData = data.books;
    } catch (error) {
        console.error('Error loading books data:', error);
        allBooksData = getHardcodedBooks();
    }
    
    currentBooks = [...allBooksData];
    displayBooks();
}

// Hardcoded fallback data
function getHardcodedBooks() {
    return [
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
        },
        {
            title: "Data Science Fundamentals",
            author: "Dr. Lisa Park",
            category: "science",
            rating: 4.7,
            price: 799,
            image: "images/data-science.jpg",
            releaseDate: "2024-03-25",
            popularity: 87
        },
        {
            title: "Creative Writing Workshop",
            author: "Michael Thompson",
            category: "non-fiction",
            rating: 4.5,
            price: 629,
            image: "images/writing.jpg",
            releaseDate: "2024-04-20",
            popularity: 79
        },
        {
            title: "History of Innovation",
            author: "Prof. Robert Clark",
            category: "biography",
            rating: 4.8,
            price: 849,
            originalPrice: 1099,
            image: "images/innovation.jpg",
            releaseDate: "2024-02-10",
            popularity: 92,
            badge: "Editor's Choice"
        },
        {
            title: "Modern Philosophy",
            author: "Dr. Jennifer Adams",
            category: "non-fiction",
            rating: 4.4,
            price: 579,
            image: "images/philosophy.jpg",
            releaseDate: "2024-01-30",
            popularity: 74
        }
    ];
}

// Main filtering and display function
function filterAndDisplayBooks() {
    let filteredBooks = [...allBooksData];
    
    // Apply search filter
    if (searchTerm) {
        filteredBooks = filteredBooks.filter(book => {
            return book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   book.category.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }
    
    // Apply category filter
    if (currentCategory) {
        filteredBooks = filteredBooks.filter(book => book.category === currentCategory);
    }
    
    // Apply sorting
    filteredBooks = sortBooks(filteredBooks, currentSort);
    
    // Update filtered state
    isFiltered = searchTerm !== '' || currentCategory !== '' || currentSort !== 'newest';
    booksPerPage = isFiltered ? 8 : 9;
    
    currentBooks = filteredBooks;
    currentPage = 1; // Reset to first page
    displayBooks();
}

// Sort books function
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

// Main display function
function displayBooks() {
    const totalBooks = currentBooks.length;
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    
    // Ensure current page is valid
    if (currentPage > totalPages && totalPages > 0) {
        currentPage = totalPages;
    }
    
    // Calculate books to display
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToShow = currentBooks.slice(startIndex, endIndex);
    
    // Render books
    renderBooks(booksToShow);
    
    // Update pagination
    updatePagination(totalBooks, totalPages);
    
    // Update results info
    updateResultsInfo(totalBooks, startIndex + 1, Math.min(endIndex, totalBooks));
}

// Render books to container
function renderBooks(books) {
    if (books.length === 0) {
        booksContainer.innerHTML = `
            <div class="no-results" style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                color: #666;
            ">
                <i class="fa-solid fa-book" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3 style="margin-bottom: 10px; font-size: 24px;">No books found</h3>
                <p style="font-size: 16px;">Try adjusting your filters to see more results.</p>
            </div>
        `;
        return;
    }
    
    const booksHTML = books.map(book => createBookCard(book)).join('');
    booksContainer.innerHTML = booksHTML;
    
    // Add hover effects
    addBookHoverEffects();
}

// Create individual book card
function createBookCard(book) {
    const stars = generateStarRating(book.rating);
    const priceHTML = book.originalPrice 
        ? `<div class="price">₹${book.price} <span class="original-price">₹${book.originalPrice}</span></div>`
        : `<div class="price">₹${book.price}</div>`;
    
    const badgeHTML = book.badge ? `<div class="book-badge">${book.badge}</div>` : '';
    const categoryDisplay = book.category.charAt(0).toUpperCase() + book.category.slice(1).replace('-', ' ');
    
    return `
        <div class="book-card" data-category="${book.category}">
            ${badgeHTML}
            <div class="book-img" style="background-image: url('${book.image}')"></div>
            <div class="book-content">
                <div class="book-category" style="
                    font-size: 12px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                ">${categoryDisplay}</div>
                <h3>${book.title}</h3>
                <p class="author">by ${book.author}</p>
                <div class="rating">
                    ${stars}
                    <span>(${book.rating})</span>
                </div>
                ${priceHTML}
                <div class="book-actions">
                    <button class="btn-primary" onclick="addToCart('${book.title}', ${book.price})">Add to Cart</button>
                    <button class="btn-secondary" onclick="toggleWishlist('${book.title}')" title="Add to Wishlist">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generate star rating
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating % 1) >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fa-solid fa-star"></i>';
    }
    
    if (hasHalfStar && fullStars < 5) {
        starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
        starsHTML += '<i class="fa-regular fa-star"></i>';
    }
    
    return starsHTML;
}

// Update pagination (works with existing HTML structure)
function updatePagination(totalBooks, totalPages) {
    const paginationContainer = document.querySelector('.pagination');
    
    if (!paginationContainer) return;
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    // Clear existing pagination
    paginationContainer.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1);
    paginationContainer.appendChild(prevBtn);
    
    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'page-btn';
        firstBtn.textContent = '1';
        firstBtn.onclick = () => changePage(1);
        paginationContainer.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.padding = '8px 4px';
            paginationContainer.appendChild(ellipsis);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => changePage(i);
        paginationContainer.appendChild(pageBtn);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.padding = '8px 4px';
            paginationContainer.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.onclick = () => changePage(totalPages);
        paginationContainer.appendChild(lastBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1);
    paginationContainer.appendChild(nextBtn);
    
    // Apply styles
    applyPaginationStyles();
}

// Apply pagination styles
function applyPaginationStyles() {
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(btn => {
        btn.style.cssText = `
            padding: 8px 12px;
            border: 1px solid #ddd;
            background: white;
            color: #333;
            cursor: pointer;
            border-radius: 4px;
            font-size: 14px;
            transition: all 0.3s ease;
            min-width: 40px;
            margin: 0 2px;
        `;
        
        if (btn.classList.contains('active')) {
            btn.style.background = '#ad0b0b';
            btn.style.color = 'white';
            btn.style.borderColor = '#007bff';
        }
        
        if (btn.disabled) {
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
    });
}

// Change page function
function changePage(page) {
    const totalPages = Math.ceil(currentBooks.length / booksPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayBooks();
    
    // Scroll to top
    const booksGrid = document.querySelector('.books-grid');
    if (booksGrid) {
        booksGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update results information
function updateResultsInfo(totalBooks, startIndex, endIndex) {
    let resultsElement = document.querySelector('.results-count');
    
    if (!resultsElement) {
        resultsElement = document.createElement('div');
        resultsElement.className = 'results-count';
        resultsElement.style.cssText = `
            margin: 20px 0;
            font-weight: 500;
            color: #666;
            font-size: 14px;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        `;
        
        const container = document.querySelector('.books-grid .container') || booksContainer.parentElement;
        if (container && container.contains(booksContainer)) {
            container.insertBefore(resultsElement, booksContainer);
        }
    }
    
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    let text = `Showing ${startIndex}-${endIndex} of ${totalBooks} book${totalBooks !== 1 ? 's' : ''}`;
    
    if (totalPages > 1) {
        text += ` (Page ${currentPage} of ${totalPages})`;
    }
    
    if (currentCategory) {
        const categoryName = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1).replace('-', ' ');
        text += ` in ${categoryName}`;
    }
    
    if (searchTerm) {
        text += ` matching "${searchTerm}"`;
    }
    
    resultsElement.textContent = text;
}

// Event handlers
function handleCategoryChange(e) {
    currentCategory = e.target.value;
    filterAndDisplayBooks();
}

function handleSortChange(e) {
    currentSort = e.target.value;
    filterAndDisplayBooks();
}

function handleSearch(e) {
    searchTerm = e.target.value.trim();
    filterAndDisplayBooks();
}

// Book actions
function addToCart(bookTitle, price) {
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Adding...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = 'Added!';
        button.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.style.backgroundColor = '';
        }, 1500);
    }, 500);
    
    showNotification(`"${bookTitle}" added to cart! (₹${price})`, 'success');
}

function toggleWishlist(bookTitle) {
    const button = event.target.closest('.btn-secondary');
    const icon = button.querySelector('i');
    
    if (icon.classList.contains('fa-solid')) {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        button.style.color = '#666';
        showNotification(`"${bookTitle}" removed from wishlist`, 'info');
    } else {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        button.style.color = '#e74c3c';
        showNotification(`"${bookTitle}" added to wishlist!`, 'success');
    }
}

// Add hover effects to book cards
function addBookHoverEffects() {
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            card.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
        warning: '#ff9800'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        font-size: 14px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Reset all filters
function resetAllFilters() {
    currentCategory = '';
    currentSort = 'newest';
    searchTerm = '';
    
    if (categorySelect) categorySelect.value = '';
    if (sortSelect) sortSelect.value = 'newest';
    
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) searchInput.value = '';
    
    filterAndDisplayBooks();
    showNotification('All filters cleared', 'info');
}

// Initialize the application
function initializeApp() {
    // Add event listeners
    if (categorySelect) {
        categorySelect.addEventListener('change', handleCategoryChange);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => handleSearch(e), 300);
        });
    }
    
    // Load data
    loadBooksData();
    
    // Add reset button if filters section exists
    const filtersSection = document.querySelector('.filters');
    if (filtersSection && !document.querySelector('.reset-filters-btn')) {
        const resetButton = document.createElement('button');
        resetButton.className = 'reset-filters-btn';
        resetButton.innerHTML = '<i class="fa-solid fa-refresh"></i> Reset Filters';
        resetButton.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin: 0 10px;
            transition: all 0.3s ease;
        `;
        resetButton.addEventListener('click', resetAllFilters);
        filtersSection.appendChild(resetButton);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);