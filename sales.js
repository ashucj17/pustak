// Sales Timer Functionality
let timerInterval;
let targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (32 * 60 * 1000) + (45 * 1000);

// Global variables for data management
let allSaleItems = [];
let filteredItems = [];
let currentPage = 1;
const itemsPerPage = 12;

// JSON data sources configuration - Fixed toys-games URL
const DATA_SOURCES = {
    books: 'books.json',
    kids: 'kids.json',
    stationery: 'stationery.json',
    'toys-games': 'toys-games.json',
    'gift-cards': 'gift-cards.json'
};

// Sale configuration for different categories
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
        console.log(`Fetching data from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Successfully loaded data from ${url}:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}

// Load all data from JSON files - Fixed data processing
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
                console.log(`Processing category: ${category}`, data);
                
                // Handle different data structures
                let items = [];
                
                // Check if data has the category as key (like toys-games.json)
                if (data[category]) {
                    items = data[category];
                } else if (data['toys-games'] && category === 'toys-games') {
                    items = data['toys-games'];
                } else if (data['gift-cards'] && category === 'gift-cards') {
                    items = data['gift-cards'];
                } else {
                    // Try to find items by looking for arrays in the data
                    const keys = Object.keys(data);
                    for (const key of keys) {
                        if (Array.isArray(data[key])) {
                            items = data[key];
                            break;
                        }
                    }
                }
                
                console.log(`Found ${items.length} items for category ${category}`);
                
                if (Array.isArray(items) && items.length > 0) {
                    const processedItems = items.map((item, index) => 
                        processItemForSale(item, category, index)
                    );
                    allSaleItems.push(...processedItems);
                    console.log(`Added ${processedItems.length} processed items for ${category}`);
                }
            }
        });

        console.log(`Total items loaded: ${allSaleItems.length}`);

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

// Process individual item for sale display - Fixed for all categories
function processItemForSale(item, category, index) {
    const saleConfig = SALE_CONFIG[category] || { minDiscount: 30, maxDiscount: 70 };
    
    // Calculate sale prices
    const originalPrice = item.originalPrice || item.price;
    const discountPercent = generateRandomDiscount(saleConfig.minDiscount, saleConfig.maxDiscount);
    const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));
    
    // Generate sale badge
    const badge = generateSaleBadge(discountPercent, item.badge);
    
    // Enhanced author/manufacturer handling for different categories
    let authorOrManufacturer = 'Unknown';
    if (item.author) {
        authorOrManufacturer = item.author;
    } else if (item.manufacturer) {
        authorOrManufacturer = item.manufacturer;
    } else if (item.brand) {
        authorOrManufacturer = item.brand;
    } else if (category === 'toys-games') {
        authorOrManufacturer = item.manufacturer || item.brand || 'Generic';
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
        // Category specific properties
        isGiftCard: category === 'gift-cards',
        giftCardCategory: item.category || null,
        isToyGame: category === 'toys-games',
        toyCategory: category === 'toys-games' ? (item.category || 'General') : null
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

// Generate appropriate sale badge
function generateSaleBadge(discountPercent, originalBadge) {
    if (discountPercent >= 80) return '80% OFF';
    if (discountPercent >= 70) return '70% OFF';
    if (discountPercent >= 60) return '60% OFF';
    if (discountPercent >= 50) return '50% OFF';
    if (discountPercent >= 40) return '40% OFF';
    if (originalBadge && originalBadge.toLowerCase().includes('bestseller')) return 'BESTSELLER';
    if (originalBadge && originalBadge.toLowerCase().includes('best seller')) return 'BEST SELLER';
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

// Create item card element - Enhanced for all categories
function createBookCard(item) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `book-card ${item.isGiftCard ? 'gift-card-item' : ''} ${item.isToyGame ? 'toy-game-item' : ''}`;
    
    // Different layouts for different categories
    const authorLabel = item.isGiftCard ? 'by' : (item.isToyGame ? 'by' : 'by');
    
    let categoryInfo = '';
    if (item.isGiftCard && item.giftCardCategory) {
        categoryInfo = `<div class="gift-card-category">Category: ${item.giftCardCategory}</div>`;
    } else if (item.isToyGame && item.toyCategory) {
        categoryInfo = `<div class="toy-category">Category: ${item.toyCategory}</div>`;
    }
    
    let specialOverlay = '';
    if (item.isGiftCard) {
        specialOverlay = '<div class="gift-card-overlay">GIFT CARD</div>';
    } else if (item.isToyGame) {
        specialOverlay = '<div class="toy-game-overlay">TOY & GAME</div>';
    }
    
    cardDiv.innerHTML = `
        <div class="discount-badge">${item.badge}</div>
        <div class="book-img" style="background-image: url('${item.image}')">
            ${specialOverlay}
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
    if (!container) {
        console.error('Sale container not found!');
        return;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = filteredItems.slice(startIndex, endIndex);
    
    console.log(`Displaying items ${startIndex}-${endIndex} of ${filteredItems.length} filtered items`);
    console.log('Items to show:', itemsToShow);
    
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
    if (itemsToShow.length === 0) {
        container.innerHTML = `
            <div class="no-items-message" style="text-align: center; padding: 40px; color: #666; grid-column: 1 / -1;">
                <i class="fa-solid fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No items found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
    } else {
        itemsToShow.forEach(item => {
            const itemElement = createBookCard(item);
            container.appendChild(itemElement);
        });
    }
    
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

// Filter functionality - Fixed for better debugging
function applyFilters() {
    const categoryFilter = document.getElementById('sale-category')?.value;
    const discountFilter = document.getElementById('discount')?.value;
    const priceFilter = document.getElementById('price-range')?.value;
    const sortFilter = document.getElementById('sort')?.value;
    
    console.log('Applying filters:', {
        category: categoryFilter,
        discount: discountFilter,
        price: priceFilter,
        sort: sortFilter
    });
    
    // Reset filtered items
    filteredItems = [...allSaleItems];
    console.log(`Starting with ${filteredItems.length} items`);
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === categoryFilter);
        console.log(`After category filter (${categoryFilter}): ${filteredItems.length} items`);
    }
    
    // Apply discount filter
    if (discountFilter) {
        const [min, max] = discountFilter.split('-').map(val => val === '+' ? 100 : parseInt(val));
        filteredItems = filteredItems.filter(item => {
            return item.discountPercent >= min && (max ? item.discountPercent <= max : true);
        });
        console.log(`After discount filter (${discountFilter}): ${filteredItems.length} items`);
    }
    
    // Apply price filter
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(val => val === '+' ? Infinity : parseInt(val));
        filteredItems = filteredItems.filter(item => {
            return item.price >= min && (max !== Infinity ? item.price <= max : true);
        });
        console.log(`After price filter (${priceFilter}): ${filteredItems.length} items`);
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
    
    console.log(`Final filtered items: ${filteredItems.length}`);
    
    // Reset to first page after filtering
    currentPage = 1;
    displayItems();
    updatePagination();
    updateResultsInfo();
}

// Search functionality - Enhanced for all categories
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
                        (item.giftCardCategory && item.giftCardCategory.toLowerCase().includes(searchTerm)) ||
                        (item.toyCategory && item.toyCategory.toLowerCase().includes(searchTerm))
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

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.innerHTML = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.innerHTML = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.innerHTML = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.innerHTML = seconds.toString().padStart(2, '0');
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

// Buy gift card functionality
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
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function() {
            mobileMenuContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            mobileMenuContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking on menu items
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Setup filter event listeners
function setupFilterListeners() {
    const categoryFilter = document.getElementById('sale-category');
    const discountFilter = document.getElementById('discount');
    const priceFilter = document.getElementById('price-range');
    const sortFilter = document.getElementById('sort');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (discountFilter) {
        discountFilter.addEventListener('change', applyFilters);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
}

// Setup clear filters functionality
function setupClearFilters() {
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Reset all filter dropdowns
            const categoryFilter = document.getElementById('sale-category');
            const discountFilter = document.getElementById('discount');
            const priceFilter = document.getElementById('price-range');
            const sortFilter = document.getElementById('sort');
            const searchInput = document.getElementById('search-input');
            
            if (categoryFilter) categoryFilter.value = 'all';
            if (discountFilter) discountFilter.value = '';
            if (priceFilter) priceFilter.value = '';
            if (sortFilter) sortFilter.value = 'popular';
            if (searchInput) searchInput.value = '';
            
            // Reset filtered items and apply filters
            filteredItems = [...allSaleItems];
            currentPage = 1;
            applyFilters();
            
            showNotification('Filters cleared successfully!', 'info');
        });
    }
}

// Setup responsive functionality
function setupResponsive() {
    function handleResize() {
        const width = window.innerWidth;
        const container = document.getElementById('saleContainer');
        
        if (container) {
            // Adjust grid columns based on screen size
            if (width <= 768) {
                container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
            } else if (width <= 1024) {
                container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            } else {
                container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on load
}

// Setup scroll to top functionality
function setupScrollToTop() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // ESC key to close modals/notifications
        if (e.key === 'Escape') {
            const notification = document.querySelector('.notification');
            const mobileMenu = document.querySelector('.mobile-menu-container.active');
            
            if (notification) {
                notification.remove();
            }
            
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        
        // Ctrl/Cmd + F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });
}

// Setup intersection observer for lazy loading images
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const imgDiv = img.closest('.book-img');
                
                if (imgDiv) {
                    const actualImg = new Image();
                    actualImg.onload = function() {
                        imgDiv.style.backgroundImage = `url('${this.src}')`;
                        imgDiv.classList.add('loaded');
                    };
                    actualImg.onerror = function() {
                        imgDiv.style.backgroundImage = `url('images/placeholder-generic.jpg')`;
                        imgDiv.classList.add('loaded');
                    };
                    actualImg.src = imgDiv.style.backgroundImage.slice(5, -2);
                }
                
                observer.unobserve(img);
            }
        });
    });
    
    // Observer will be applied when items are displayed
    return imageObserver;
}

// Enhanced error handling
function handleGlobalErrors() {
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        
        // Don't show notification for resource loading errors
        if (e.error && e.error.message && !e.error.message.includes('Loading')) {
            showNotification('An unexpected error occurred. Please refresh the page.', 'error');
        }
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault();
    });
}

// Performance monitoring
function setupPerformanceMonitoring() {
    let startTime = performance.now();
    
    function measurePerformance(label) {
        const endTime = performance.now();
        console.log(`${label}: ${(endTime - startTime).toFixed(2)}ms`);
        startTime = endTime;
    }
    
    return measurePerformance;
}

// Analytics and tracking (placeholder)
function trackEvent(category, action, label, value) {
    console.log('Event tracked:', { category, action, label, value });
    
    // Here you would integrate with your analytics service
    // For example: gtag('event', action, { event_category: category, event_label: label, value: value });
}

// Add CSS animations dynamically
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .book-card {
            animation: fadeIn 0.5s ease forwards;
        }
        
        .book-card:hover {
            animation: pulse 0.3s ease;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .mobile-menu-container {
            transition: transform 0.3s ease;
        }
        
        .mobile-menu-container.active {
            transform: translateX(0);
        }
        
        .loaded {
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Main initialization function
async function initializeSalePage() {
    console.log('Initializing sale page...');
    
    try {
        // Add dynamic styles
        addDynamicStyles();
        
        // Setup error handling
        handleGlobalErrors();
        
        // Setup performance monitoring
        const measurePerf = setupPerformanceMonitoring();
        
        // Start timer
        startTimer();
        measurePerf('Timer started');
        
        // Setup event listeners
        setupFilterListeners();
        setupClearFilters();
        setupSearch();
        setupViewToggle();
        setupMobileMenu();
        setupScrollToTop();
        setupKeyboardShortcuts();
        setupResponsive();
        measurePerf('Event listeners setup');
        
        // Load and display data
        await loadAllData();
        measurePerf('Data loaded and displayed');
        
        // Setup lazy loading
        setupLazyLoading();
        
        console.log('Sale page initialization complete!');
        
        // Track page load
        trackEvent('Sale Page', 'Load', 'Complete', allSaleItems.length);
        
    } catch (error) {
        console.error('Error initializing sale page:', error);
        showErrorMessage('Failed to initialize the sale page. Please refresh and try again.');
    }
}

// Utility function to debounce frequent function calls
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

// Utility function to throttle function calls
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Enhanced search with debouncing
const debouncedSearch = debounce(function(searchTerm) {
    if (searchTerm) {
        filteredItems = allSaleItems.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.author.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.categoryDisplay.toLowerCase().includes(searchTerm) ||
            (item.giftCardCategory && item.giftCardCategory.toLowerCase().includes(searchTerm)) ||
            (item.toyCategory && item.toyCategory.toLowerCase().includes(searchTerm))
        );
    } else {
        filteredItems = [...allSaleItems];
    }
    
    currentPage = 1;
    displayItems();
    updatePagination();
    updateResultsInfo();
    
    // Track search
    trackEvent('Sale Page', 'Search', searchTerm, filteredItems.length);
}, 300);

// Export functions for global access (if needed)
window.salePageFunctions = {
    initializeSalePage,
    applyFilters,
    addToCart,
    toggleWishlist,
    buyGiftCard,
    showNotification,
    trackEvent
};

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSalePage);
} else {
    // DOM is already loaded
    initializeSalePage();
}


// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const hamburgerBtn = document.querySelector('.fa-bars');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const closeMenuBtn = document.querySelector('.close-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;

    // Function to open mobile menu
    function openMobileMenu() {
        mobileMenuContainer.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Function to close mobile menu
    function closeMobileMenu() {
        mobileMenuContainer.classList.remove('active');
        body.style.overflow = ''; // Restore scrolling
    }

    // Event listeners
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openMobileMenu();
        });
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    }

    // Close menu when clicking on menu items (optional - for better UX)
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-items a');
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Close menu on escape key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuContainer.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Handle window resize - close menu if window becomes large
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenuContainer.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

// Optional: Add touch/swipe functionality for mobile devices
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    if (mobileMenu) {
        // Touch start
        mobileMenu.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        // Touch move
        mobileMenu.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;
            
            // If swiping left and distance is significant, start closing animation
            if (deltaX < -50) {
                mobileMenu.style.transform = `translateX(${Math.max(deltaX, -300)}px)`;
            }
        });

        // Touch end
        mobileMenu.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;
            
            const deltaX = currentX - startX;
            
            // If swiped left more than 100px, close the menu
            if (deltaX < -100) {
                document.querySelector('.mobile-menu-container').classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Reset transform
            mobileMenu.style.transform = '';
        });
    }
});

// CSS classes for active states (add these to your CSS file)
const mobileMenuStyles = `
    .mobile-menu-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        visibility: hidden;
        opacity: 0;
        transition: visibility 0.3s ease, opacity 0.3s ease;
    }

    .mobile-menu-container.active {
        visibility: visible;
        opacity: 1;
    }

    .mobile-menu {
        position: fixed;
        top: 0;
        left: 0;
        width: 280px;
        height: 100%;
        background: #fff;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 10000;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    }

    .mobile-menu-container.active .mobile-menu {
        transform: translateX(0);
    }

    .mobile-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    }

    .mobile-menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }

    .mobile-logo {
        height: 40px;
    }

    .close-menu {
        font-size: 24px;
        cursor: pointer;
        color: #333;
    }

    .mobile-menu-items {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .mobile-menu-items li {
        border-bottom: 1px solid #eee;
    }

    .mobile-menu-items a {
        display: block;
        padding: 15px 20px;
        text-decoration: none;
        color: #333;
        font-weight: 500;
        transition: background-color 0.3s ease;
    }

    .mobile-menu-items a:hover,
    .mobile-menu-items a.active {
        background-color: #ffeb3b;
        color: #ad0b0b;
    }

    /* Hide mobile menu on larger screens */
    @media (min-width: 769px) {
        .mobile-menu-container {
            display: none !important;
        }
        
        .fa-bars {
            display: none !important;
        }
    }

    /* Show hamburger only on mobile */
    @media (max-width: 768px) {
        .fa-bars {
            display: block !important;
            cursor: pointer;
            font-size: 24px;
            color: #333;
        }
        
        .header-menu {
            display: none !important;
        }
    }
`;

// Add styles to head if not already present
if (!document.querySelector('#mobile-menu-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'mobile-menu-styles';
    styleSheet.textContent = mobileMenuStyles;
    document.head.appendChild(styleSheet);
}