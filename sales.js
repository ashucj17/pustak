// Sales Timer Functionality
let timerInterval;
let targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (32 * 60 * 1000) + (45 * 1000);

// Global variables for data management
let allSaleItems = [];
let filteredItems = [];
let currentPage = 1;
const itemsPerPage = 12;

// JSON data sources configuration - Added gift-cards
const DATA_SOURCES = {
    books: 'books.json',
    kids: 'kids.json',
    stationery: 'stationery.json',
    'toygames': 'toys-games.json',
    'gift-cards': 'gift-cards.json'
};

// Sale configuration for different categories - Added gift-cards
const SALE_CONFIG = {
    books: { minDiscount: 30, maxDiscount: 85 },
    kids: { minDiscount: 20, maxDiscount: 70 },
    stationery: { minDiscount: 25, maxDiscount: 60 },
    'toys-games': { minDiscount: 35, maxDiscount: 80 },
    'gift-cards': { minDiscount: 10, maxDiscount: 40 }
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
                const categoryKey = Object.keys(data)[0]; // Get the main key (books, kids, gift-cards, etc.)
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

// Process individual item for sale display - Enhanced for gift cards
function processItemForSale(item, category, index) {
    const saleConfig = SALE_CONFIG[category] || { minDiscount: 30, maxDiscount: 70 };
    
    // Calculate sale prices
    const originalPrice = item.originalPrice || item.price;
    const discountPercent = generateRandomDiscount(saleConfig.minDiscount, saleConfig.maxDiscount);
    const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));
    
    // Generate sale badge
    const badge = generateSaleBadge(discountPercent, item.badge);
    
    // Enhanced author/manufacturer handling for gift cards
    let authorOrManufacturer = item.author || item.brand || item.manufacturer || 'Unknown';
    if (category === 'gift-cards' && item.manufacturer) {
        authorOrManufacturer = item.manufacturer;
    }
    
    return {
        id: `${category}-${index}`,
        title: item.title,
        author: authorOrManufacturer,
        category: category,
        categoryDisplay: getCategoryDisplayName(category),
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
        savings: originalPrice - salePrice,
        // Gift card specific properties
        isGiftCard: category === 'gift-cards',
        giftCardCategory: item.category || null
    };
}

// Get display name for category
function getCategoryDisplayName(category) {
    const displayNames = {
        'books': 'Books',
        'kids': 'Kids',
        'stationery': 'Stationery',
        'toys-games': 'Toys & Games',
        'gift-cards': 'Gift Cards'
    };
    return displayNames[category] || category;
}

// Generate random discount within range
function generateRandomDiscount(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate appropriate sale badge - Enhanced for gift cards
function generateSaleBadge(discountPercent, originalBadge) {
    if (discountPercent >= 80) return '80% OFF';
    if (discountPercent >= 70) return '70% OFF';
    if (discountPercent >= 60) return '60% OFF';
    if (discountPercent >= 50) return '50% OFF';
    if (discountPercent >= 40) return '40% OFF';
    if (originalBadge && originalBadge.toLowerCase().includes('bestseller')) return 'BESTSELLER';
    if (originalBadge && originalBadge.toLowerCase().includes('most popular')) return 'MOST POPULAR';
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

// Create item card element - Enhanced for gift cards
function createBookCard(item) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `book-card ${item.isGiftCard ? 'gift-card-item' : ''}`;
    
    // Different layout for gift cards
    const authorLabel = item.isGiftCard ? 'by' : 'by';
    const categoryInfo = item.isGiftCard && item.giftCardCategory ? 
        `<div class="gift-card-category">Category: ${item.giftCardCategory}</div>` : '';
    
    cardDiv.innerHTML = `
        <div class="discount-badge">${item.badge}</div>
        <div class="book-img" style="background-image: url('${item.image}')">
            ${item.isGiftCard ? '<div class="gift-card-overlay">GIFT CARD</div>' : ''}
        </div>
        <div class="book-content">
            <h3>${item.title}${item.isNew ? ' <span class="new-badge">NEW</span>' : ''}</h3>
            <p class="author">${authorLabel} ${item.author}</p>
            <div class="rating">
                ${generateStarRating(item.rating)}
                <span>(${item.rating})</span>
            </div>
            <div class="price">₹${item.price.toLocaleString()} <span class="original-price">₹${item.originalPrice.toLocaleString()}</span></div>
            <div class="savings">You save: ₹${item.savings.toLocaleString()}</div>
            ${item.ageGroup ? `<div class="age-group">Age: ${item.ageGroup}</div>` : ''}
            ${categoryInfo}
            ${item.color ? `<div class="item-color">Color: ${item.color}</div>` : ''}
            ${item.size ? `<div class="item-size">Size: ${item.size}</div>` : ''}
            <div class="book-actions">
                <button class="btn-primary" data-item-id="${item.id}">
                    ${item.isGiftCard ? 'Buy Gift Card' : 'Add to Cart'}
                </button>
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

// Setup event listeners for card buttons - Enhanced for gift cards
function setupCardEventListeners() {
    const addToCartBtns = document.querySelectorAll('.btn-primary[data-item-id]');
    const wishlistBtns = document.querySelectorAll('.btn-secondary[data-item-id]');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemId = this.getAttribute('data-item-id');
            const item = allSaleItems.find(item => item.id === itemId);
            if (item) {
                if (item.isGiftCard) {
                    buyGiftCard(item);
                } else {
                    addToCart(item);
                }
            }
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

// Filter functionality - Enhanced for gift cards
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

// Search functionality - Enhanced for gift cards
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
                        item.category.toLowerCase().includes(searchTerm) ||
                        item.categoryDisplay.toLowerCase().includes(searchTerm) ||
                        (item.giftCardCategory && item.giftCardCategory.toLowerCase().includes(searchTerm))
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

// Buy gift card functionality - NEW
function buyGiftCard(item) {
    // Add animation to the button
    const button = document.querySelector(`[data-item-id="${item.id}"].btn-primary`);
    if (button) {
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 0.1s ease';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Show gift card specific notification
    showNotification(`${item.title} purchased! Check your email for delivery.`, 'success');
    
    // Optional: You could add gift card specific logic here
    console.log('Gift card purchase:', {
        title: item.title,
        manufacturer: item.author,
        amount: item.price,
        originalPrice: item.originalPrice,
        savings: item.savings
    });
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

// Add required CSS styles - Enhanced for gift cards
// Add required CSS styles - Enhanced for gift cards
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
    
    @keyframes giftCardGlow {
        0%, 100% { box-shadow: 0 0 5px rgba(243, 156, 18, 0.3); }
        50% { box-shadow: 0 0 20px rgba(243, 156, 18, 0.6); }
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
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .age-group, .item-color, .item-size {
        font-size: 12px;
        color: #666;
        margin: 2px 0;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .age-group::before {
        content: "👶";
        font-size: 10px;
    }
    
    .item-color::before {
        content: "🎨";
        font-size: 10px;
    }
    
    .item-size::before {
        content: "📏";
        font-size: 10px;
    }
    
    /* Gift Card Specific Styles */
    .gift-card-item {
        border: 2px solid #f39c12;
        position: relative;
        overflow: hidden;
        animation: giftCardGlow 3s ease-in-out infinite;
        background: linear-gradient(135deg, #fff 0%, #fff9e6 100%);
    }
    
    .gift-card-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #f39c12, #e67e22, #d35400, #f39c12);
        background-size: 200% 100%;
        animation: shimmer 2s linear infinite;
        z-index: 1;
    }
    
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    
    .gift-card-overlay {
        position: absolute;
        top: 10px;
        left: 10px;
        background: linear-gradient(135deg, #f39c12, #e67e22);
        color: white;
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: bold;
        z-index: 2;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        transform: rotate(-2deg);
    }
    
    .gift-card-overlay::before {
        content: "🎁";
        margin-right: 4px;
    }
    
    .gift-card-category {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        padding: 6px 10px;
        border-radius: 6px;
        font-weight: 600;
        color: #495057;
        font-size: 12px;
        border: 1px solid #dee2e6;
        margin: 4px 0;
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .gift-card-category::before {
        content: "🏷️";
        font-size: 10px;
    }
    
    .gift-card-value {
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
        margin: 4px 0;
        text-align: center;
        box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
    }
    
    .gift-card-value::before {
        content: "💳 ";
    }
    
    .gift-card-expiry {
        font-size: 11px;
        color: #6c757d;
        font-style: italic;
        margin: 2px 0;
    }
    
    .gift-card-expiry::before {
        content: "⏰ ";
    }
    
    /* Enhanced button styles for gift cards */
    .gift-card-item .btn-primary {
        background: linear-gradient(135deg, #f39c12, #e67e22);
        border: none;
        color: white;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(243, 156, 18, 0.3);
    }
    
    .gift-card-item .btn-primary:hover {
        background: linear-gradient(135deg, #e67e22, #d35400);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(243, 156, 18, 0.4);
    }
    
    .gift-card-item .btn-primary::before {
        content: "🎁 ";
        margin-right: 4px;
    }
    
    /* Gift card list view styles */
    .books-container.list-view .gift-card-item {
        border-left: 6px solid #f39c12;
        background: linear-gradient(90deg, #fff9e6 0%, #fff 100%);
    }
    
    .books-container.list-view .gift-card-item .book-img {
        border: 2px solid #f39c12;
        border-radius: 8px;
    }
    
    /* Gift card filter highlight */
    #sale-category option[value="gift-cards"] {
        background: linear-gradient(135deg, #fff9e6, #f8f9fa);
        font-weight: bold;
        color: #f39c12;
    }
    
    /* Special gift card discount badges */
    .gift-card-item .discount-badge {
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        color: white;
        font-weight: bold;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(238, 90, 36, 0.4);
    }
    
    /* Gift card specific savings display */
    .gift-card-item .savings {
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: bold;
        margin: 4px 0;
        text-align: center;
        box-shadow: 0 2px 4px rgba(39, 174, 96, 0.3);
    }
    
    .gift-card-item .savings::before {
        content: "💰 ";
    }
    
    /* Loading state for gift cards */
    .gift-card-loading {
        position: relative;
        overflow: hidden;
    }
    
    .gift-card-loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(243, 156, 18, 0.2), transparent);
        animation: cardLoading 1.5s infinite;
    }
    
    @keyframes cardLoading {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    /* Responsive gift card styles */
    @media (max-width: 768px) {
        .gift-card-item {
            margin-bottom: 15px;
        }
        
        .gift-card-overlay {
            top: 5px;
            left: 5px;
            padding: 4px 6px;
            font-size: 10px;
        }
        
        .gift-card-category {
            padding: 4px 6px;
            font-size: 11px;
        }
    }
    
    /* Gift card notification styles */
    .notification.notification-gift-card {
        background: linear-gradient(135deg, #f39c12, #e67e22);
        border-left: 4px solid #d35400;
    }
    
    .notification.notification-gift-card::before {
        content: "🎁";
        margin-right: 8px;
        font-size: 16px;
    }
`;
document.head.appendChild(style);

// Enhanced gift card data processing with validation
function processGiftCardData(giftCard, index) {
    // Validate required gift card fields
    const requiredFields = ['title', 'manufacturer', 'price'];
    const missingFields = requiredFields.filter(field => !giftCard[field]);
    
    if (missingFields.length > 0) {
        console.warn(`Gift card missing required fields: ${missingFields.join(', ')}`, giftCard);
        return null;
    }
    
    const saleConfig = SALE_CONFIG['gift-cards'];
    const originalPrice = giftCard.price;
    const discountPercent = generateRandomDiscount(saleConfig.minDiscount, saleConfig.maxDiscount);
    const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));
    
    // Generate gift card specific badge
    const badge = generateGiftCardBadge(discountPercent, giftCard.badge, giftCard.category);
    
    // Calculate expiry date (typically 1-5 years for gift cards)
    const expiryMonths = Math.floor(Math.random() * 48) + 12; // 1-4 years
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + expiryMonths);
    
    return {
        id: `gift-cards-${index}`,
        title: giftCard.title,
        author: giftCard.manufacturer,
        category: 'gift-cards',
        categoryDisplay: 'Gift Cards',
        rating: giftCard.rating || 4.5,
        price: salePrice,
        originalPrice: originalPrice,
        discountPercent: discountPercent,
        image: giftCard.image || 'images/placeholder-gift-card.jpg',
        badge: badge,
        popularity: giftCard.popularity || 75,
        isNew: isNewItem(giftCard.releaseDate),
        ageGroup: giftCard.ageGroup || 'All Ages',
        savings: originalPrice - salePrice,
        
        // Gift card specific properties
        isGiftCard: true,
        giftCardCategory: giftCard.category || 'General',
        manufacturer: giftCard.manufacturer,
        expiryDate: expiryDate,
        giftCardValue: originalPrice,
        isDigital: giftCard.isDigital !== false, // Default to digital
        deliveryTime: giftCard.deliveryTime || 'Instant',
        termsUrl: giftCard.termsUrl || '#',
        validRegions: giftCard.validRegions || ['India']
    };
}

// Enhanced gift card badge generation
function generateGiftCardBadge(discountPercent, originalBadge, category) {
    // Category-specific badges
    const categoryBadges = {
        'E-commerce': '🛒 E-COMMERCE',
        'Food & Dining': '🍽️ FOOD & DINING',
        'Fashion': '👕 FASHION',
        'Entertainment': '🎬 ENTERTAINMENT',
        'Travel': '✈️ TRAVEL',
        'Gaming': '🎮 GAMING',
        'Books': '📚 BOOKS',
        'Music': '🎵 MUSIC'
    };
    
    if (categoryBadges[category]) {
        return categoryBadges[category];
    }
    
    if (discountPercent >= 40) return `${discountPercent}% OFF GIFT CARD`;
    if (discountPercent >= 30) return `${discountPercent}% BONUS VALUE`;
    if (originalBadge && originalBadge.toLowerCase().includes('most popular')) return '⭐ MOST POPULAR';
    if (originalBadge && originalBadge.toLowerCase().includes('bestseller')) return '🏆 BESTSELLER';
    
    return `${discountPercent}% OFF`;
}

// Enhanced gift card creation with detailed information
function createGiftCardElement(item) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'book-card gift-card-item';
    
    // Format expiry date
    const expiryDateFormatted = item.expiryDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    cardDiv.innerHTML = `
        <div class="discount-badge">${item.badge}</div>
        <div class="book-img" style="background-image: url('${item.image}')">
            <div class="gift-card-overlay">GIFT CARD</div>
        </div>
        <div class="book-content">
            <h3>${item.title}${item.isNew ? ' <span class="new-badge">NEW</span>' : ''}</h3>
            <p class="author">by ${item.manufacturer}</p>
            <div class="rating">
                ${generateStarRating(item.rating)}
                <span>(${item.rating})</span>
            </div>
            <div class="gift-card-category">Category: ${item.giftCardCategory}</div>
            <div class="gift-card-value">Value: ₹${item.giftCardValue.toLocaleString()}</div>
            <div class="price">₹${item.price.toLocaleString()} <span class="original-price">₹${item.originalPrice.toLocaleString()}</span></div>
            <div class="savings">You save: ₹${item.savings.toLocaleString()}</div>
            <div class="gift-card-expiry">Valid until: ${expiryDateFormatted}</div>
            <div class="age-group">Age: ${item.ageGroup}</div>
            <div class="item-color">Delivery: ${item.deliveryTime}</div>
            <div class="book-actions">
                <button class="btn-primary" data-item-id="${item.id}" data-gift-card="true">
                    Buy Gift Card
                </button>
                <button class="btn-secondary" data-item-id="${item.id}">
                    <i class="fa-regular fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    return cardDiv;
}

// Enhanced gift card purchase functionality
function buyGiftCard(item) {
    // Show loading state
    const button = document.querySelector(`[data-item-id="${item.id}"].btn-primary`);
    if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;
        
        // Simulate purchase processing
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            
            // Show success animation
            button.style.transform = 'scale(0.95)';
            button.style.transition = 'transform 0.1s ease';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
            
            // Show detailed notification
            showGiftCardNotification(item);
            
            // Log purchase details
            logGiftCardPurchase(item);
            
        }, 1500);
    }
}

// Specialized gift card notification
function showGiftCardNotification(item) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification notification-gift-card';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-gift" style="font-size: 20px;"></i>
            <div>
                <div style="font-weight: bold; margin-bottom: 4px;">Gift Card Purchased!</div>
                <div style="font-size: 12px; opacity: 0.9;">${item.title} - ₹${item.price.toLocaleString()}</div>
                <div style="font-size: 11px; opacity: 0.8;">Check your email for delivery details</div>
            </div>
        </div>
        <i class="fa-solid fa-times close-notification" style="cursor: pointer; margin-left: auto;"></i>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #f39c12, #e67e22);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(243, 156, 18, 0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        max-width: 350px;
        border: 2px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => notification.remove());
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000); // Longer display time for gift cards
}

// Log gift card purchase for analytics
function logGiftCardPurchase(item) {
    const purchaseData = {
        timestamp: new Date().toISOString(),
        itemId: item.id,
        title: item.title,
        manufacturer: item.manufacturer,
        category: item.giftCardCategory,
        purchasePrice: item.price,
        originalValue: item.giftCardValue,
        savings: item.savings,
        discountPercent: item.discountPercent,
        expiryDate: item.expiryDate.toISOString(),
        deliveryTime: item.deliveryTime,
        isDigital: item.isDigital
    };
    
    console.log('Gift Card Purchase:', purchaseData);
    
    // Here you would typically send this data to your analytics service
    // Example: analytics.track('gift_card_purchased', purchaseData);
}

// Enhanced search functionality for gift cards
function searchGiftCards(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    return allSaleItems.filter(item => {
        if (!item.isGiftCard) return false;
        
        return (
            item.title.toLowerCase().includes(term) ||
            item.manufacturer.toLowerCase().includes(term) ||
            item.giftCardCategory.toLowerCase().includes(term) ||
            item.categoryDisplay.toLowerCase().includes(term)
        );
    });
}

// Gift card specific filtering
function filterGiftCardsByCategory(category) {
    return allSaleItems.filter(item => 
        item.isGiftCard && 
        (category === 'all' || item.giftCardCategory.toLowerCase() === category.toLowerCase())
    );
}

// Enhanced initialization to handle gift card data
async function loadGiftCardData() {
    try {
        const giftCardData = await fetchJSONData('gift-cards.json');
        
        if (giftCardData && giftCardData['gift-cards']) {
            const giftCards = giftCardData['gift-cards'];
            
            const processedGiftCards = giftCards
                .map((card, index) => processGiftCardData(card, index))
                .filter(card => card !== null); // Remove invalid cards
            
            return processedGiftCards;
        }
        
        return [];
    } catch (error) {
        console.error('Error loading gift card data:', error);
        return [];
    }
}

// Enhanced main initialization with gift card support
async function initializeGiftCardSystem() {
    try {
        // Load gift card data separately for better error handling
        const giftCards = await loadGiftCardData();
        console.log(`Loaded ${giftCards.length} gift cards`);
        
        // Add gift cards to the main items array
        allSaleItems.push(...giftCards);
        
        // Update filtered items
        filteredItems = [...allSaleItems];
        
        // Re-display items
        displayItems();
        updatePagination();
        updateResultsInfo();
        
        return giftCards.length;
    } catch (error) {
        console.error('Error initializing gift card system:', error);
        showErrorMessage('Failed to load gift cards. Some items may not be available.');
        return 0;
    }
}

// Enhanced event listener setup for gift cards
function setupGiftCardEventListeners() {
    // Handle gift card purchase buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-gift-card="true"]') || 
            e.target.closest('[data-gift-card="true"]')) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target.closest('[data-item-id]');
            const itemId = button.getAttribute('data-item-id');
            const item = allSaleItems.find(item => item.id === itemId);
            
            if (item && item.isGiftCard) {
                buyGiftCard(item);
            }
        }
    });
    
    // Add gift card category filter change handler
    const categoryFilter = document.getElementById('sale-category');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            if (this.value === 'gift-cards') {
                // Add special styling for gift card view
                document.body.classList.add('viewing-gift-cards');
            } else {
                document.body.classList.remove('viewing-gift-cards');
            }
        });
    }
}

// Initialize everything including gift cards
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing sale system with gift card support...');
    
    // Initialize basic system first
    await initializePage();
    
    // Then initialize gift card specific features
    await initializeGiftCardSystem();
    
    // Setup gift card event listeners
    setupGiftCardEventListeners();
    
    console.log('Gift card system initialization complete!');
});