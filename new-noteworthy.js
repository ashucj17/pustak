// Enhanced Book data management with JSON integration - 9 Books Default, 8 Books Per Page After Filter
let allBooksData = [];
let currentBooks = [];
let currentCategory = '';
let currentSort = 'newest';
let currentPage = 1;
let booksPerPage = 9; // Default to 9 books for initial load
let isFiltered = false; // Track if any filters are applied

// DOM Elements
const categorySelect = document.getElementById('category');
const sortSelect = document.getElementById('sort');
const booksContainer = document.getElementById('booksContainer');

// Load books from JSON file
async function loadBooksData() {
    try {
        const response = await fetch('books.json');
        const data = await response.json();
        allBooksData = data.books;
        currentBooks = [...allBooksData];
        renderBooks(currentBooks);
        updateResultsCount(allBooksData.length);
    } catch (error) {
        console.error('Error loading books data:', error);
        // Fallback to hardcoded data if JSON fails to load
        allBooksData = getHardcodedBooks();
        currentBooks = [...allBooksData];
        renderBooks(currentBooks);
        updateResultsCount(allBooksData.length);
    }
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

// Initialize filters and load data
function initializeFilters() {
    categorySelect.addEventListener('change', handleCategoryChange);
    sortSelect.addEventListener('change', handleSortChange);
    
    // Load data and initial render
    loadBooksData();
}

// Handle category filter change
function handleCategoryChange(e) {
    currentCategory = e.target.value;
    currentPage = 1; // Reset to first page
    
    // Set filtered state and adjust books per page
    isFiltered = currentCategory !== '';
    booksPerPage = isFiltered ? 8 : 9;
    
    filterAndSortBooks();
}

// Handle sort change
function handleSortChange(e) {
    currentSort = e.target.value;
    currentPage = 1; // Reset to first page
    
    // If sorting is changed from default 'newest', consider it as filtered
    isFiltered = currentSort !== 'newest' || currentCategory !== '';
    booksPerPage = isFiltered ? 8 : 9;
    
    filterAndSortBooks();
}

// Filter and sort books based on current selections
function filterAndSortBooks() {
    let filteredBooks = [...allBooksData];
    
    // Apply category filter
    if (currentCategory && currentCategory !== '') {
        filteredBooks = filteredBooks.filter(book => book.category === currentCategory);
    }
    
    // Apply sorting
    filteredBooks = sortBooks(filteredBooks, currentSort);
    
    currentBooks = filteredBooks;
    renderBooksWithPagination(currentBooks);
    updateResultsCount(filteredBooks.length);
    updatePagination(filteredBooks.length);
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

// Render books with pagination - Dynamic books per page (9 default, 8 filtered)
function renderBooksWithPagination(books) {
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToShow = books.slice(startIndex, endIndex);
    
    renderBooks(booksToShow);
    updatePaginationInfo(books.length, startIndex + 1, Math.min(endIndex, books.length));
}

// Update pagination information display
function updatePaginationInfo(totalBooks, startIndex, endIndex) {
    let paginationInfo = document.querySelector('.pagination-info');
    if (!paginationInfo) {
        paginationInfo = document.createElement('div');
        paginationInfo.className = 'pagination-info';
        paginationInfo.style.cssText = `
            text-align: center;
            margin: 20px 0;
            font-size: 14px;
            color: #666;
            font-weight: 500;
        `;
        
        const container = document.querySelector('.books-grid .container');
        if (container) {
            container.appendChild(paginationInfo);
        }
    }
    
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    const viewMode = isFiltered ? `${booksPerPage} per page` : `${booksPerPage} featured books`;
    paginationInfo.textContent = `Showing ${startIndex}-${endIndex} of ${totalBooks} books (Page ${currentPage} of ${totalPages}) - ${viewMode}`;
}

// Render books to the DOM
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
    
    // Create a more readable category display
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

// Generate star rating HTML with improved precision
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating % 1) >= 0.5;
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fa-solid fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar && fullStars < 5) {
        starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    
    // Empty stars
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
        starsHTML += '<i class="fa-regular fa-star"></i>';
    }
    
    return starsHTML;
}

// Update results count with enhanced information
function updateResultsCount(count) {
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
        
        const container = document.querySelector('.books-grid .container');
        if (container) {
            container.insertBefore(resultsElement, booksContainer);
        }
    }
    
    const totalPages = Math.ceil(count / booksPerPage);
    let text = `Found ${count} book${count !== 1 ? 's' : ''} (${totalPages} page${totalPages !== 1 ? 's' : ''})`;
    
    if (currentCategory) {
        const categoryName = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1).replace('-', ' ');
        text += ` in ${categoryName}`;
    }
    
    // Add indication of current display mode
    if (!isFiltered) {
        text += ` - Showing ${booksPerPage} featured books per page`;
    } else {
        text += ` - Showing ${booksPerPage} books per page`;
    }
    
    resultsElement.textContent = text;
}

// Enhanced pagination with better navigation
function updatePagination(totalBooks) {
    const totalPages = Math.ceil(totalBooks / booksPerPage);
    let paginationElement = document.querySelector('.pagination');
    
    if (!paginationElement) {
        paginationElement = document.createElement('div');
        paginationElement.className = 'pagination';
        paginationElement.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin: 30px 0;
            flex-wrap: wrap;
        `;
        
        const container = document.querySelector('.books-grid .container');
        if (container) {
            container.appendChild(paginationElement);
        }
    }
    
    if (totalPages <= 1) {
        paginationElement.style.display = 'none';
        return;
    }
    
    paginationElement.style.display = 'flex';
    
    let paginationHTML = '';
    
    // First page button
    if (currentPage > 1) {
        paginationHTML += `
            <button class="page-btn first-page" onclick="changePage(1)" title="First Page">
                <i class="fa-solid fa-angles-left"></i>
            </button>
        `;
    }
    
    // Previous button
    paginationHTML += `
        <button class="page-btn prev-page" onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''} title="Previous Page">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers (show max 7 pages for better navigation)
    const maxVisible = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="page-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button class="page-btn next-page" onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''} title="Next Page">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;
    
    // Last page button
    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="page-btn last-page" onclick="changePage(${totalPages})" title="Last Page">
                <i class="fa-solid fa-angles-right"></i>
            </button>
        `;
    }
    
    // Page info with dynamic display mode
    const displayMode = isFiltered ? `${booksPerPage} per page` : `${booksPerPage} featured`;
    paginationHTML += `
        <div class="page-info" style="
            margin-left: 20px;
            font-size: 14px;
            color: #666;
            white-space: nowrap;
        ">
            Page ${currentPage} of ${totalPages} (${displayMode})
        </div>
    `;
    
    paginationElement.innerHTML = paginationHTML;
    
    // Add styles to pagination buttons
    addPaginationStyles();
}

// Add styles to pagination buttons
function addPaginationStyles() {
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
        `;
        
        if (btn.classList.contains('active')) {
            btn.style.background = '#007bff';
            btn.style.color = 'white';
            btn.style.borderColor = '#007bff';
        }
        
        if (btn.disabled) {
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
        
        btn.addEventListener('mouseenter', () => {
            if (!btn.disabled && !btn.classList.contains('active')) {
                btn.style.background = '#f8f9fa';
                btn.style.borderColor = '#007bff';
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (!btn.disabled && !btn.classList.contains('active')) {
                btn.style.background = 'white';
                btn.style.borderColor = '#ddd';
            }
        });
    });
    
    const ellipsis = document.querySelectorAll('.page-ellipsis');
    ellipsis.forEach(el => {
        el.style.cssText = `
            padding: 8px 4px;
            color: #666;
            font-size: 14px;
        `;
    });
}

// Change page function with smooth scrolling
function changePage(page) {
    const totalPages = Math.ceil(currentBooks.length / booksPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderBooksWithPagination(currentBooks);
    updateResultsCount(currentBooks.length);
    updatePagination(currentBooks.length);
    
    // Scroll to top of books section with smooth animation
    const booksGrid = document.querySelector('.books-grid');
    if (booksGrid) {
        booksGrid.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Show loading animation briefly for better UX
    showPageTransition();
}

// Show page transition animation
function showPageTransition() {
    const container = document.getElementById('booksContainer');
    if (container) {
        container.style.opacity = '0.7';
        container.style.transform = 'translateY(10px)';
        container.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 200);
    }
}

// Jump to specific page function
function jumpToPage() {
    const totalPages = Math.ceil(currentBooks.length / booksPerPage);
    const pageNumber = prompt(`Enter page number (1-${totalPages}):`);
    
    if (pageNumber && !isNaN(pageNumber)) {
        const page = parseInt(pageNumber);
        if (page >= 1 && page <= totalPages) {
            changePage(page);
        } else {
            showNotification(`Please enter a page number between 1 and ${totalPages}`, 'error');
        }
    }
}

// Add event listeners to book action buttons
function addBookActionListeners() {
    // Add hover effects and click animations
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
    });
}

// Enhanced book action functions
function addToCart(bookTitle, price) {
    console.log(`Added "${bookTitle}" to cart - Price: ₹${price}`);
    
    // Add to cart animation
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
    console.log(`Toggled wishlist for "${bookTitle}"`);
    
    const button = event.target.closest('.btn-secondary');
    const icon = button.querySelector('i');
    
    // Toggle heart icon
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

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
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
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
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
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.innerHTML = `
        <i class="fa-solid ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// View toggle functionality (grid/list view)
function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
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
            document.body.style.overflow = 'hidden';
        });
    }
    
    const closeMobileMenu = () => {
        if (mobileMenuContainer) {
            mobileMenuContainer.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobileMenu);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }
}

// Enhanced search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleSearch(e);
            }, 300); // Debounced search
        });
        
        // Clear search button
        const clearButton = document.createElement('button');
        clearButton.innerHTML = '<i class="fa-solid fa-times"></i>';
        clearButton.className = 'search-clear';
        clearButton.style.cssText = `
            position: absolute;
            right: 50px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 16px;
            color: #666;
            cursor: pointer;
            padding: 5px;
            display: none;
        `;
        
        const searchBar = document.querySelector('.search-bar');
        if (searchBar) {
            searchBar.style.position = 'relative';
            searchBar.appendChild(clearButton);
        }
        
        searchInput.addEventListener('input', (e) => {
            clearButton.style.display = e.target.value ? 'block' : 'none';
        });
        
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.style.display = 'none';
            currentPage = 1;
            
            // Reset to default state
            isFiltered = false;
            booksPerPage = 9;
            
            filterAndSortBooks();
        });
    }
}

// Complete handleSearch function and remaining code
// Complete handleSearch function and remaining code
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    currentPage = 1; // Reset to first page
    
    // Set filtered state when searching
    isFiltered = searchTerm !== '' || currentCategory !== '' || currentSort !== 'newest';
    booksPerPage = isFiltered ? 8 : 9;
    
    if (searchTerm === '' && currentCategory === '' && currentSort === 'newest') {
        // Reset to default unfiltered state
        isFiltered = false;
        booksPerPage = 9;
        currentBooks = [...allBooksData];
    } else {
        // Apply search filter
        let filteredBooks = allBooksData.filter(book => {
            const titleMatch = book.title.toLowerCase().includes(searchTerm);
            const authorMatch = book.author.toLowerCase().includes(searchTerm);
            const categoryMatch = book.category.toLowerCase().includes(searchTerm);
            
            return titleMatch || authorMatch || categoryMatch;
        });
        
        // Apply category filter if set
        if (currentCategory && currentCategory !== '') {
            filteredBooks = filteredBooks.filter(book => book.category === currentCategory);
        }
        
        // Apply sorting
        filteredBooks = sortBooks(filteredBooks, currentSort);
        currentBooks = filteredBooks;
    }
    
    renderBooksWithPagination(currentBooks);
    updateResultsCount(currentBooks.length);
    updatePagination(currentBooks.length);
    
    // Show search results message
    if (searchTerm !== '') {
        showSearchResultsMessage(searchTerm, currentBooks.length);
    }
}

// Show search results message
function showSearchResultsMessage(searchTerm, resultsCount) {
    let searchMessage = document.querySelector('.search-results-message');
    
    if (!searchMessage) {
        searchMessage = document.createElement('div');
        searchMessage.className = 'search-results-message';
        searchMessage.style.cssText = `
            background: #e8f4f8;
            border: 1px solid #bee5eb;
            border-radius: 6px;
            padding: 12px 16px;
            margin: 15px 0;
            color: #0c5460;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        const container = document.querySelector('.books-grid .container');
        const resultsCount = document.querySelector('.results-count');
        if (container && resultsCount) {
            container.insertBefore(searchMessage, resultsCount.nextSibling);
        }
    }
    
    if (resultsCount === 0) {
        searchMessage.innerHTML = `
            <i class="fa-solid fa-search"></i>
            <span>No results found for "<strong>${searchTerm}</strong>". Try different keywords or check spelling.</span>
        `;
        searchMessage.style.background = '#fff3cd';
        searchMessage.style.borderColor = '#ffeaa7';
        searchMessage.style.color = '#856404';
    } else {
        searchMessage.innerHTML = `
            <i class="fa-solid fa-search"></i>
            <span>Found ${resultsCount} result${resultsCount !== 1 ? 's' : ''} for "<strong>${searchTerm}</strong>"</span>
        `;
        searchMessage.style.background = '#e8f4f8';
        searchMessage.style.borderColor = '#bee5eb';
        searchMessage.style.color = '#0c5460';
    }
    
    searchMessage.style.display = 'flex';
}

// Clear search results message
function clearSearchResultsMessage() {
    const searchMessage = document.querySelector('.search-results-message');
    if (searchMessage) {
        searchMessage.style.display = 'none';
    }
}

// Enhanced filter reset functionality
function resetAllFilters() {
    // Reset all filter states
    currentCategory = '';
    currentSort = 'newest';
    currentPage = 1;
    isFiltered = false;
    booksPerPage = 9;
    
    // Reset form controls
    const categorySelect = document.getElementById('category');
    const sortSelect = document.getElementById('sort');
    const searchInput = document.querySelector('.search-bar input');
    
    if (categorySelect) categorySelect.value = '';
    if (sortSelect) sortSelect.value = 'newest';
    if (searchInput) searchInput.value = '';
    
    // Clear search button
    const clearButton = document.querySelector('.search-clear');
    if (clearButton) clearButton.style.display = 'none';
    
    // Reset to original data
    currentBooks = [...allBooksData];
    
    // Re-render everything
    renderBooksWithPagination(currentBooks);
    updateResultsCount(allBooksData.length);
    updatePagination(allBooksData.length);
    clearSearchResultsMessage();
    
    showNotification('All filters cleared', 'info');
}

// Add reset filters button functionality
function addResetFiltersButton() {
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
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            height: 40px;
            margin: 0 10px;
        `;
        
        resetButton.addEventListener('click', resetAllFilters);
        
        resetButton.addEventListener('mouseenter', () => {
            resetButton.style.background = '#5a6268';
            resetButton.style.transform = 'translateY(-1px)';
        });
        
        resetButton.addEventListener('mouseleave', () => {
            resetButton.style.background = '#6c757d';
            resetButton.style.transform = 'translateY(0)';
        });
        
        filtersSection.appendChild(resetButton);
    }
}

// Enhanced keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Only handle when not typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        
        const totalPages = Math.ceil(currentBooks.length / booksPerPage);
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'h':
                e.preventDefault();
                if (currentPage > 1) {
                    changePage(currentPage - 1);
                }
                break;
                
            case 'ArrowRight':
            case 'l':
                e.preventDefault();
                if (currentPage < totalPages) {
                    changePage(currentPage + 1);
                }
                break;
                
            case 'Home':
                e.preventDefault();
                if (currentPage !== 1) {
                    changePage(1);
                }
                break;
                
            case 'End':
                e.preventDefault();
                if (currentPage !== totalPages) {
                    changePage(totalPages);
                }
                break;
                
            case 'g':
                e.preventDefault();
                jumpToPage();
                break;
                
            case 'r':
                e.preventDefault();
                resetAllFilters();
                break;
                
            case '/':
                e.preventDefault();
                const searchInput = document.querySelector('.search-bar input');
                if (searchInput) {
                    searchInput.focus();
                }
                break;
        }
    });
}

// Books per page selector
function addBooksPerPageSelector() {
    const paginationElement = document.querySelector('.pagination');
    
    if (paginationElement && !document.querySelector('.books-per-page-selector')) {
        const selector = document.createElement('div');
        selector.className = 'books-per-page-selector';
        selector.style.cssText = `
            margin-left: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #666;
        `;
        
        const currentPerPage = isFiltered ? 8 : 9; 
        const options = isFiltered ? [4, 8, 12, 16] : [3, 9, 12, 18];
        
        selector.innerHTML = `
            <span>Show:</span>
            <select class="books-per-page-select" style="
                padding: 4px 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                background: white;
                cursor: pointer;
            ">
                ${options.map(num => 
                    `<option value="${num}" ${num === currentPerPage ? 'selected' : ''}>${num}</option>`
                ).join('')}
            </select>
            <span>books</span>
        `;
        
        const select = selector.querySelector('.books-per-page-select');
        select.addEventListener('change', (e) => {
            booksPerPage = parseInt(e.target.value);
            currentPage = 1;
            renderBooksWithPagination(currentBooks);
            updateResultsCount(currentBooks.length);
            updatePagination(currentBooks.length);
        });
        
        paginationElement.appendChild(selector);
    }
}

// Advanced sorting options
function initializeAdvancedSorting() {
    // Add sort direction toggle
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        const sortContainer = sortSelect.parentElement;
        
        if (!document.querySelector('.sort-direction-toggle')) {
            const directionToggle = document.createElement('button');
            directionToggle.className = 'sort-direction-toggle';
            directionToggle.innerHTML = '<i class="fa-solid fa-arrow-down"></i>';
            directionToggle.title = 'Toggle Sort Direction';
            directionToggle.style.cssText = `
                margin-left: 8px;
                padding: 8px 10px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            `;
            
            let isAscending = false;
            
            directionToggle.addEventListener('click', () => {
                isAscending = !isAscending;
                directionToggle.innerHTML = isAscending 
                    ? '<i class="fa-solid fa-arrow-up"></i>' 
                    : '<i class="fa-solid fa-arrow-down"></i>';
                
                // Re-apply current sorting with new direction
                currentBooks = reverseSortOrder(currentBooks);
                renderBooksWithPagination(currentBooks);
            });
            
            sortContainer.appendChild(directionToggle);
        }
    }
}

// Reverse sort order
function reverseSortOrder(books) {
    return [...books].reverse();
}

// Export/Import functionality
function initializeDataExport() {
    // Add export button
    const filtersSection = document.querySelector('.filters');
    
    if (filtersSection && !document.querySelector('.export-btn')) {
        const exportButton = document.createElement('button');
        exportButton.className = 'export-btn';
        exportButton.innerHTML = '<i class="fa-solid fa-download"></i> Export';
        exportButton.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            height: 40px;
            margin: 0 10px;
        `;
        
        exportButton.addEventListener('click', exportCurrentView);
        
        exportButton.addEventListener('mouseenter', () => {
            exportButton.style.background = '#218838';
            exportButton.style.transform = 'translateY(-1px)';
        });
        
        exportButton.addEventListener('mouseleave', () => {
            exportButton.style.background = '#28a745';
            exportButton.style.transform = 'translateY(0)';
        });
        
        filtersSection.appendChild(exportButton);
    }
}

// Export current view data
function exportCurrentView() {
    const dataToExport = {
        books: currentBooks,
        filters: {
            category: currentCategory,
            sort: currentSort,
            page: currentPage,
            booksPerPage: booksPerPage,
            isFiltered: isFiltered
        },
        exportDate: new Date().toISOString(),
        totalBooks: currentBooks.length
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `books-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Books data exported successfully!', 'success');
}

// Initialize all functionality
function initializeApp() {
    // Core functionality
    initializeFilters();
    initializeSearch();
    initializeMobileMenu();
    initializeViewToggle();
    
    // Enhanced features
    initializeKeyboardNavigation();
    addResetFiltersButton();
    initializeAdvancedSorting();
    initializeDataExport();
    
    // Show keyboard shortcuts help
    showKeyboardHelp();
}

// Show keyboard shortcuts help
function showKeyboardHelp() {
    // Add help button
    const body = document.body;
    const helpButton = document.createElement('button');
    helpButton.innerHTML = '<i class="fa-solid fa-question-circle"></i>';
    helpButton.title = 'Keyboard Shortcuts';
    helpButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(0,123,255,0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    helpButton.addEventListener('click', toggleKeyboardShortcuts);
    body.appendChild(helpButton);
}

// Toggle keyboard shortcuts modal
function toggleKeyboardShortcuts() {
    let modal = document.querySelector('.keyboard-shortcuts-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'keyboard-shortcuts-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #333;">Keyboard Shortcuts</h3>
                    <button class="close-shortcuts" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #666;
                    ">&times;</button>
                </div>
                <div style="display: grid; gap: 15px; font-size: 14px;">
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <span><kbd>←</kbd> or <kbd>H</kbd></span>
                        <span>Previous page</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <span><kbd>→</kbd> or <kbd>L</kbd></span>
                        <span>Next page</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <span><kbd>Home</kbd></span>
                        <span>First page</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <span><kbd>End</kbd></span>
                        <span>Last page</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <span><kbd>G</kbd></span>
                        <span>Go to page</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                        <span><kbd>/</kbd></span>
                        <span>Focus search</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                        <span><kbd>R</kbd></span>
                        <span>Reset filters</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close-shortcuts');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);