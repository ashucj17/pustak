// Sales Timer Functionality
let timerInterval;
let targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (32 * 60 * 1000) + (45 * 1000);

// Global variables for data management
let allSaleItems = [];
let filteredItems = [];
let currentPage = 1;
const itemsPerPage = 12;

// JSON data sources configuration
const DATA_SOURCES = {
    books: 'books.json',
    kids: 'kids.json',
    stationery: 'stationery.json',
    'toys-games': 'toys-games.json'
};

// Sale configuration for different categories
const SALE_CONFIG = {
    books: { minDiscount: 30, maxDiscount: 85 },
    kids: { minDiscount: 20, maxDiscount: 70 },
    stationery: { minDiscount: 25, maxDiscount: 60 },
    'toys-games': { minDiscount: 35, maxDiscount: 80 }
};

// Utility function to fetch JSON data
async function fetchJSONData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}

// Load all data from JSON files
async function loadAllData() {
    const loadingIndicator = showLoadingIndicator();
    
    try {
        const dataPromises = Object.entries(DATA_SOURCES).map(async ([category, url]) => {
            const data = await fetchJSONData(url);
            return { category, data };
        });

        const results = await Promise.all(dataPromises);
        
        // Process and combine all data
        allSaleItems = [];
        
        results.forEach(({ category, data }) => {
            if (data) {
                const categoryKey = Object.keys(data)[0]; // Get the main key (books, kids, etc.)
                const items = data[categoryKey];
                
                if (Array.isArray(items)) {
                    const processedItems = items.map((item, index) => 
                        processItemForSale(item, category, index)
                    );
                    allSaleItems.push(...processedItems);
                }
            }
        });

        // Sort by popularity initially
        allSaleItems.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        
        // Initialize filtered items
        filteredItems = [...allSaleItems];
        
        // Display items
        displayItems();
        updatePagination();
        updateResultsInfo();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showErrorMessage('Failed to load sale items. Please refresh the page.');
    } finally {
        hideLoadingIndicator(loadingIndicator);
    }
}

// Process individual item for sale display
function processItemForSale(item, category, index) {
    const saleConfig = SALE_CONFIG[category] || { minDiscount: 30, maxDiscount: 70 };
    
    // Calculate sale prices
    const originalPrice = item.originalPrice || item.price;
    const discountPercent = generateRandomDiscount(saleConfig.minDiscount, saleConfig.maxDiscount);
    const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));
    
    // Generate sale badge
    const badge = generateSaleBadge(discountPercent, item.badge);
    
    return {
        id: `${category}-${index}`,
        title: item.title,
        author: item.author || item.brand || item.manufacturer || 'Unknown',
        category: category,
        rating: item.rating || 4.0,
        price: salePrice,
        originalPrice: originalPrice,
        discountPercent: discountPercent,
        image: item.image || `images/placeholder-${category}.jpg`,
        badge: badge,
        popularity: item.popularity || 50,
        isNew: isNewItem(item.releaseDate),
        ageGroup: item.ageGroup || null,
        color: item.color || null,
        size: item.size || null,
        savings: originalPrice - salePrice
    };
}

// Generate random discount within range
function generateRandomDiscount(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate appropriate sale badge
function generateSaleBadge(discountPercent, originalBadge) {
    if (discountPercent >= 80) return '80% OFF';
    if (discountPercent >= 70) return '70% OFF';
    if (discountPercent >= 60) return '60% OFF';
    if (discountPercent >= 50) return '50% OFF';
    if (discountPercent >= 40) return '40% OFF';
    if (originalBadge && originalBadge.toLowerCase().includes('bestseller')) return 'BESTSELLER';
    return `${discountPercent}% OFF`;
}

// Check if item is new (released within last 3 months)
function isNewItem(releaseDate) {
    if (!releaseDate) return false;
    const release = new Date(releaseDate);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return release > threeMonthsAgo;
}

// Create book card element
function createBookCard(item) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'book-card';
    cardDiv.innerHTML = `
        <div class="discount-badge">${item.badge}</div>
        <div class="book-img" style="background-image: url('${item.image}')"></div>
        <div class="book-content">
            <h3>${item.title}${item.isNew ? ' <span class="new-badge">NEW</span>' : ''}</h3>
            <p class="author">by ${item.author}</p>
            <div class="rating">
                ${generateStarRating(item.rating)}
                <span>(${item.rating})</span>
            </div>
            <div class="price">₹${item.price.toLocaleString()} <span class="original-price">₹${item.originalPrice.toLocaleString()}</span></div>
            <div class="savings">You save: ₹${item.savings.toLocaleString()}</div>
            ${item.ageGroup ? `<div class="age-group">Age: ${item.ageGroup}</div>` : ''}
            ${item.color ? `<div class="item-color">Color: ${item.color}</div>` : ''}
            ${item.size ? `<div class="item-size">Size: ${item.size}</div>` : ''}
            <div class="book-actions">
                <button class="btn-primary" data-item-id="${item.id}">Add to Cart</button>
                <button class="btn-secondary" data-item-id="${item.id}"><i class="fa-regular fa-heart"></i></button>
            </div>
        </div>
    `;
    return cardDiv;
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
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
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="fa-regular fa-star"></i>';
    }
    
    return starsHTML;
}

// Display items based on current page and filters
function displayItems() {
    const container = document.getElementById('saleContainer');
    if (!container) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = filteredItems.slice(startIndex, endIndex);
    
    // Clear container
    container.innerHTML = '';
    
    // Check view mode
    const isListView = document.querySelector('.view-btn[data-view="list"]')?.classList.contains('active');
    
    if (isListView) {
        container.classList.add('list-view');
    } else {
        container.classList.remove('list-view');
    }
    
    // Add items to container
    itemsToShow.forEach(item => {
        const itemElement = createBookCard(item);
        container.appendChild(itemElement);
    });
    
    // Add event listeners to new elements
    setupCardEventListeners();
}

// Setup event listeners for card buttons
function setupCardEventListeners() {
    const addToCartBtns = document.querySelectorAll('.btn-primary[data-item-id]');
    const wishlistBtns = document.querySelectorAll('.btn-secondary[data-item-id]');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemId = this.getAttribute('data-item-id');
            const item = allSaleItems.find(item => item.id === itemId);
            if (item) addToCart(item);
        });
    });
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemId = this.getAttribute('data-item-id');
            const item = allSaleItems.find(item => item.id === itemId);
            if (item) toggleWishlist(item, this);
        });
    });
}

// Filter functionality
function applyFilters() {
    const categoryFilter = document.getElementById('sale-category')?.value;
    const discountFilter = document.getElementById('discount')?.value;
    const priceFilter = document.getElementById('price-range')?.value;
    const sortFilter = document.getElementById('sort')?.value;
    
    // Reset filtered items
    filteredItems = [...allSaleItems];
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === categoryFilter);
    }
    
    // Apply discount filter
    if (discountFilter) {
        const [min, max] = discountFilter.split('-').map(val => val === '+' ? 100 : parseInt(val));
        filteredItems = filteredItems.filter(item => {
            return item.discountPercent >= min && (max ? item.discountPercent <= max : true);
        });
    }
    
    // Apply price filter
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(val => val === '+' ? Infinity : parseInt(val));
        filteredItems = filteredItems.filter(item => {
            return item.price >= min && (max !== Infinity ? item.price <= max : true);
        });
    }
    
    // Apply sorting
    switch (sortFilter) {
        case 'discount-high':
            filteredItems.sort((a, b) => b.discountPercent - a.discountPercent);
            break;
        case 'price-low':
            filteredItems.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredItems.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filteredItems.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'newest':
            filteredItems.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
        case 'rating':
            filteredItems.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Default sorting by popularity
            filteredItems.sort((a, b) => b.popularity - a.popularity);
    }
    
    // Reset to first page after filtering
    currentPage = 1;
    displayItems();
    updatePagination();
    updateResultsInfo();
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase().trim();
                
                if (searchTerm) {
                    filteredItems = allSaleItems.filter(item => 
                        item.title.toLowerCase().includes(searchTerm) ||
                        item.author.toLowerCase().includes(searchTerm) ||
                        item.category.toLowerCase().includes(searchTerm)
                    );
                } else {
                    filteredItems = [...allSaleItems];
                }
                
                currentPage = 1;
                displayItems();
                updatePagination();
                updateResultsInfo();
            }, 300);
        });
    }
}

// Loading indicator functions
function showLoadingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'loading-indicator';
    indicator.innerHTML = `
        <div class="spinner"></div>
        <p>Loading sale items...</p>
    `;
    indicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        text-align: center;
    `;
    document.body.appendChild(indicator);
    return indicator;
}

function hideLoadingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
    }
}

// Error message function
function showErrorMessage(message) {
    const container = document.getElementById('saleContainer');
    if (container) {
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fa-solid fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn-primary" style="margin-top: 20px;">Refresh Page</button>
            </div>
        `;
    }
}

// Timer functions
function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        clearInterval(timerInterval);
        document.getElementById('days').innerHTML = '00';
        document.getElementById('hours').innerHTML = '00';
        document.getElementById('minutes').innerHTML = '00';
        document.getElementById('seconds').innerHTML = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerHTML = days.toString().padStart(2, '0');
    document.getElementById('hours').innerHTML = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerHTML = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (32 * 60 * 1000) + (45 * 1000);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

// Pagination functionality
function updatePagination() {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    if (currentPage > 1) {
        const prevBtn = createPaginationButton('Previous', currentPage - 1);
        paginationContainer.appendChild(prevBtn);
    }
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationContainer.appendChild(createPaginationButton('1', 1));
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationContainer.appendChild(ellipsis);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPaginationButton(i.toString(), i);
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        paginationContainer.appendChild(pageBtn);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationContainer.appendChild(ellipsis);
        }
        paginationContainer.appendChild(createPaginationButton(totalPages.toString(), totalPages));
    }
    
    // Next button
    if (currentPage < totalPages) {
        const nextBtn = createPaginationButton('Next', currentPage + 1);
        paginationContainer.appendChild(nextBtn);
    }
}

function createPaginationButton(text, page) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'pagination-btn';
    button.addEventListener('click', function() {
        currentPage = page;
        displayItems();
        updatePagination();
        updateResultsInfo();
        
        // Scroll to top of results
        document.querySelector('.books-grid')?.scrollIntoView({ behavior: 'smooth' });
    });
    return button;
}

// Update results info
function updateResultsInfo() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredItems.length);
    
    const resultsCountEl = document.getElementById('results-count');
    const totalResultsEl = document.getElementById('total-results');
    
    if (resultsCountEl) resultsCountEl.textContent = `${startIndex}-${endIndex}`;
    if (totalResultsEl) totalResultsEl.textContent = filteredItems.length.toLocaleString();
}

// Add to cart functionality
function addToCart(item) {
    // Add animation to the button
    const button = document.querySelector(`[data-item-id="${item.id}"].btn-primary`);
    if (button) {
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 0.1s ease';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Show notification
    showNotification(`${item.title} added to cart!`, 'success');
}

// Toggle wishlist functionality
function toggleWishlist(item, buttonElement) {
    const heartIcon = buttonElement.querySelector('i');
    
    if (heartIcon.classList.contains('fa-solid')) {
        heartIcon.classList.remove('fa-solid');
        heartIcon.classList.add('fa-regular');
        heartIcon.style.color = '';
        showNotification(`${item.title} removed from wishlist`, 'info');
    } else {
        heartIcon.classList.remove('fa-regular');
        heartIcon.classList.add('fa-solid');
        heartIcon.style.color = '#e74c3c';
        showNotification(`${item.title} added to wishlist!`, 'success');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <i class="fa-solid fa-times close-notification"></i>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => notification.remove());
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Setup view toggle functionality
function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayItems();
        });
    });
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.fa-bars');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const closeMenuBtn = document.querySelector('.close-menu');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    
    if (mobileMenuBtn && mobileMenuContainer) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuContainer.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeMenuBtn?.addEventListener('click', function() {
            mobileMenuContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        menuOverlay?.addEventListener('click', function() {
            mobileMenuContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// Initialize all functionality
async function initializePage() {
    // Set up filter event listeners
    const filterSelects = document.querySelectorAll('#sale-category, #discount, #price-range, #sort');
    filterSelects.forEach(select => {
        select.addEventListener('change', applyFilters);
    });
    
    // Initialize components
    setupViewToggle();
    setupMobileMenu();
    setupSearch();
    
    // Load data and display
    await loadAllData();
    
    // Initialize timer
    startTimer();
    
    // Remove/hide load more button since we're using pagination
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

// Add required CSS styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 15px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .new-badge {
        background: #ff4757;
        color: white;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 3px;
        margin-left: 5px;
    }
    
    .age-group, .item-color, .item-size {
        font-size: 12px;
        color: #666;
        margin: 2px 0;
    }
    
    .books-container.list-view {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .books-container.list-view .book-card {
        display: flex;
        flex-direction: row;
        max-width: 100%;
        height: auto;
    }
    
    .books-container.list-view .book-img {
        width: 150px;
        height: 200px;
        flex-shrink: 0;
    }
    
    .books-container.list-view .book-content {
        flex: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 40px;
        flex-wrap: wrap;
    }
    
    .pagination-btn {
        padding: 10px 15px;
        border: 1px solid #ddd;
        background: white;
        color: #333;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        min-width: 40px;
    }
    
    .pagination-btn:hover {
        background: #f8f9fa;
        border-color: #007bff;
    }
    
    .pagination-btn.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
    }
    
    .pagination-ellipsis {
        padding: 10px 5px;
        color: #666;
    }
    
    .close-notification {
        cursor: pointer;
        margin-left: auto;
    }
    
    .close-notification:hover {
        opacity: 0.7;
    }
    
    @media (max-width: 768px) {
        .books-container.list-view .book-card {
            flex-direction: column;
        }
        
        .books-container.list-view .book-img {
            width: 100%;
            height: 250px;
        }
        
        .pagination {
            gap: 5px;
        }
        
        .pagination-btn {
            padding: 8px 12px;
            font-size: 12px;
            min-width: 35px;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}