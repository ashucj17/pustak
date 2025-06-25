// Optimized Sales Timer & Data Management System
class SalesSystem {
    constructor() {
        this.timerInterval = null;
        this.targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (32 * 60 * 1000) + (45 * 1000);
        
        // Data management
        this.allSaleItems = [];
        this.filteredItems = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        
        // Configuration
        this.DATA_SOURCES = {
            books: 'books.json',
            kids: 'kids.json',
            stationery: 'stationery.json',
            'toys-games': 'toys-games.json',
            'gift-cards': 'gift-cards.json'
        };
        
        this.SALE_CONFIG = {
            books: { minDiscount: 30, maxDiscount: 85 },
            kids: { minDiscount: 20, maxDiscount: 70 },
            stationery: { minDiscount: 25, maxDiscount: 60 },
            'toys-games': { minDiscount: 35, maxDiscount: 80 },
            'gift-cards': { minDiscount: 10, maxDiscount: 40 }
        };
        
        this.CATEGORY_DISPLAY_NAMES = {
            'books': 'Books',
            'kids': 'Kids',
            'stationery': 'Stationery',
            'toys-games': 'Toys & Games',
            'gift-cards': 'Gift Cards'
        };
        
        // Cache for performance
        this.elementCache = new Map();
        this.searchTimeout = null;
        
        this.init();
    }
    
    // Initialize the system
    async init() {
        try {
            this.setupEventListeners();
            await this.loadAllData();
            this.startTimer();
            this.hideLoadMoreButton();
            console.log('Sales system initialized successfully');
        } catch (error) {
            console.error('Failed to initialize sales system:', error);
            this.showErrorMessage('Failed to initialize the sales system. Please refresh the page.');
        }
    }
    
    // Optimized data fetching with better error handling
    async fetchJSONData(url) {
        try {
            console.log(`Fetching data from: ${url}`);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`Successfully loaded data from ${url}:`, data);
            return data;
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return null;
        }
    }
    
    // Load and process all data sources
    async loadAllData() {
        const loadingIndicator = this.showLoadingIndicator();
        
        try {
            // Load data concurrently for better performance
            const dataPromises = Object.entries(this.DATA_SOURCES).map(async ([category, url]) => {
                const data = await this.fetchJSONData(url);
                return { category, data, url };
            });
            
            const results = await Promise.all(dataPromises);
            this.allSaleItems = [];
            
            // Process each data source
            results.forEach(({ category, data, url }) => {
                if (!data) {
                    console.warn(`No data received for category: ${category} from ${url}`);
                    return;
                }
                
                console.log(`Processing ${category} data:`, data);
                
                // Handle different data structures
                let items = null;
                
                // Try to find the items array in the data
                if (data[category]) {
                    items = data[category];
                } else if (Array.isArray(data)) {
                    items = data;
                } else {
                    // Try to find any array in the data object
                    const keys = Object.keys(data);
                    for (const key of keys) {
                        if (Array.isArray(data[key])) {
                            items = data[key];
                            break;
                        }
                    }
                }
                
                if (!Array.isArray(items)) {
                    console.error(`Invalid data structure for ${category}:`, data);
                    return;
                }
                
                console.log(`Found ${items.length} items in ${category}`);
                
                // Process items
                const processedItems = items
                    .map((item, index) => this.processItemForSale(item, category, index))
                    .filter(item => item !== null);
                
                console.log(`Processed ${processedItems.length} items for ${category}`);
                this.allSaleItems.push(...processedItems);
            });
            
            // Sort and initialize display
            this.allSaleItems.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            this.filteredItems = [...this.allSaleItems];
            
            console.log(`Total items loaded: ${this.allSaleItems.length}`);
            
            this.displayItems();
            this.updatePagination();
            this.updateResultsInfo();
            
        } catch (error) {
            console.error('Error in loadAllData:', error);
            this.showErrorMessage('Failed to load sale items. Please refresh the page.');
        } finally {
            this.hideLoadingIndicator(loadingIndicator);
        }
    }
    
    // Enhanced item processing with better validation
    processItemForSale(item, category, index) {
        try {
            // Validate required fields
            if (!item || typeof item !== 'object') {
                console.warn(`Invalid item data for ${category}[${index}]:`, item);
                return null;
            }
            
            const title = item.title || `Untitled ${category} Item`;
            if (!title.trim()) {
                console.warn(`Missing title for ${category}[${index}]:`, item);
                return null;
            }
            
            const saleConfig = this.SALE_CONFIG[category] || { minDiscount: 30, maxDiscount: 70 };
            
            // Calculate pricing
            const originalPrice = item.originalPrice || item.price || 999;
            const discountPercent = this.generateRandomDiscount(saleConfig.minDiscount, saleConfig.maxDiscount);
            const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));
            
            // Generate sale badge
            const badge = this.generateSaleBadge(discountPercent, item.badge, category);
            
            // Handle author/manufacturer/brand
            let authorOrManufacturer = item.author || item.brand || item.manufacturer || 'Unknown';
            if (category === 'gift-cards' && item.manufacturer) {
                authorOrManufacturer = item.manufacturer;
            }
            
            const processedItem = {
                id: `${category}-${index}`,
                title: title,
                author: authorOrManufacturer,
                category: category,
                categoryDisplay: this.CATEGORY_DISPLAY_NAMES[category] || category,
                rating: this.validateRating(item.rating),
                price: salePrice,
                originalPrice: originalPrice,
                discountPercent: discountPercent,
                image: item.image || `images/placeholder-${category}.jpg`,
                badge: badge,
                popularity: item.popularity || Math.floor(Math.random() * 100) + 1,
                isNew: this.isNewItem(item.releaseDate),
                ageGroup: item.ageGroup || null,
                color: item.color || null,
                size: item.size || null,
                savings: originalPrice - salePrice,
                manufacturer: item.manufacturer || item.brand || null,
                
                // Category-specific properties
                ...(category === 'gift-cards' && {
                    isGiftCard: true,
                    giftCardCategory: item.category || 'General'
                }),
                
                ...(category === 'toys-games' && {
                    isToy: true,
                    toyCategory: item.category || 'General'
                })
            };
            
            console.log(`Processed item for ${category}:`, processedItem.title);
            return processedItem;
            
        } catch (error) {
            console.error(`Error processing item ${category}[${index}]:`, error, item);
            return null;
        }
    }
    
    // Validate and normalize rating
    validateRating(rating) {
        const numRating = parseFloat(rating);
        if (isNaN(numRating) || numRating < 0 || numRating > 5) {
            return 4.0 + (Math.random() * 1); // Random rating between 4-5
        }
        return Math.round(numRating * 10) / 10; // Round to 1 decimal place
    }
    
    // Generate random discount within range
    generateRandomDiscount(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Enhanced badge generation
    generateSaleBadge(discountPercent, originalBadge, category) {
        // Category-specific badges
        const categoryBadges = {
            'gift-cards': {
                'E-commerce': '🛒 E-COMMERCE',
                'Food & Dining': '🍽️ FOOD & DINING',
                'Fashion': '👕 FASHION',
                'Entertainment': '🎬 ENTERTAINMENT'
            },
            'toys-games': {
                'Building Sets': '🧱 BUILDING',
                'Action Figures': '🦸 ACTION',
                'Board Games': '🎲 BOARD GAME',
                'Educational': '📚 EDUCATIONAL'
            }
        };
        
        if (categoryBadges[category] && originalBadge && categoryBadges[category][originalBadge]) {
            return categoryBadges[category][originalBadge];
        }
        
        // Discount-based badges
        if (discountPercent >= 80) return '80% OFF';
        if (discountPercent >= 70) return '70% OFF';
        if (discountPercent >= 60) return '60% OFF';
        if (discountPercent >= 50) return '50% OFF';
        if (discountPercent >= 40) return '40% OFF';
        
        // Original badge handling
        if (originalBadge) {
            const badge = originalBadge.toLowerCase();
            if (badge.includes('bestseller') || badge.includes('best seller')) return 'BESTSELLER';
            if (badge.includes('most popular')) return 'MOST POPULAR';
            if (badge.includes('new')) return 'NEW ARRIVAL';
        }
        
        return `${discountPercent}% OFF`;
    }
    
    // Check if item is new
    isNewItem(releaseDate) {
        if (!releaseDate) return false;
        try {
            const release = new Date(releaseDate);
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            return release > threeMonthsAgo;
        } catch (error) {
            return false;
        }
    }
    
    // Optimized item card creation
    createBookCard(item) {
        const cardDiv = document.createElement('div');
        const cardClasses = ['book-card'];
        
        if (item.isGiftCard) cardClasses.push('gift-card-item');
        if (item.isToy) cardClasses.push('toy-item');
        
        cardDiv.className = cardClasses.join(' ');
        
        // Build card content efficiently
        const authorLabel = item.isGiftCard ? 'by' : 'by';
        const buttonText = item.isGiftCard ? 'Buy Gift Card' : 'Add to Cart';
        const buttonIcon = item.isGiftCard ? '🎁' : '';
        
        // Category-specific info
        let categoryInfo = '';
        if (item.isGiftCard && item.giftCardCategory) {
            categoryInfo = `<div class="gift-card-category">Category: ${item.giftCardCategory}</div>`;
        } else if (item.isToy && item.toyCategory) {
            categoryInfo = `<div class="toy-category">Category: ${item.toyCategory}</div>`;
        }
        
        cardDiv.innerHTML = `
            <div class="discount-badge">${item.badge}</div>
            <div class="book-img" style="background-image: url('${item.image}')">
                ${item.isGiftCard ? '<div class="gift-card-overlay">GIFT CARD</div>' : ''}
                ${item.isToy ? '<div class="toy-overlay">TOY</div>' : ''}
            </div>
            <div class="book-content">
                <h3>${item.title}${item.isNew ? ' <span class="new-badge">NEW</span>' : ''}</h3>
                <p class="author">${authorLabel} ${item.author}</p>
                <div class="rating">
                    ${this.generateStarRating(item.rating)}
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
                        ${buttonIcon}${buttonText}
                    </button>
                    <button class="btn-secondary" data-item-id="${item.id}">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        return cardDiv;
    }
    
    // Optimized star rating generation
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        starsHTML += '<i class="fa-solid fa-star"></i>'.repeat(fullStars);
        if (hasHalfStar) starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
        starsHTML += '<i class="fa-regular fa-star"></i>'.repeat(emptyStars);
        
        return starsHTML;
    }
    
    // Optimized display function
    displayItems() {
        const container = document.getElementById('saleContainer');
        if (!container) {
            console.error('Sale container not found');
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const itemsToShow = this.filteredItems.slice(startIndex, endIndex);
        
        // Clear container efficiently
        container.innerHTML = '';
        
        // Check view mode
        const isListView = document.querySelector('.view-btn[data-view="list"]')?.classList.contains('active');
        container.classList.toggle('list-view', isListView);
        
        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        itemsToShow.forEach(item => {
            const itemElement = this.createBookCard(item);
            fragment.appendChild(itemElement);
        });
        
        container.appendChild(fragment);
        this.setupCardEventListeners();
    }
    
    // Optimized filtering with debouncing
    applyFilters() {
        const categoryFilter = document.getElementById('sale-category')?.value;
        const discountFilter = document.getElementById('discount')?.value;
        const priceFilter = document.getElementById('price-range')?.value;
        const sortFilter = document.getElementById('sort')?.value;
        
        console.log('Applying filters:', { categoryFilter, discountFilter, priceFilter, sortFilter });
        
        // Start with all items
        this.filteredItems = [...this.allSaleItems];
        
        // Apply category filter
        if (categoryFilter && categoryFilter !== 'all') {
            const beforeCount = this.filteredItems.length;
            this.filteredItems = this.filteredItems.filter(item => item.category === categoryFilter);
            console.log(`Category filter (${categoryFilter}): ${beforeCount} -> ${this.filteredItems.length} items`);
        }
        
        // Apply discount filter
        if (discountFilter) {
            const [min, max] = discountFilter.split('-').map(val => val === '+' ? 100 : parseInt(val));
            const beforeCount = this.filteredItems.length;
            this.filteredItems = this.filteredItems.filter(item => {
                return item.discountPercent >= min && (max ? item.discountPercent <= max : true);
            });
            console.log(`Discount filter (${discountFilter}): ${beforeCount} -> ${this.filteredItems.length} items`);
        }
        
        // Apply price filter
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(val => val === '+' ? Infinity : parseInt(val));
            const beforeCount = this.filteredItems.length;
            this.filteredItems = this.filteredItems.filter(item => {
                return item.price >= min && (max !== Infinity ? item.price <= max : true);
            });
            console.log(`Price filter (${priceFilter}): ${beforeCount} -> ${this.filteredItems.length} items`);
        }
        
        // Apply sorting
        this.applySorting(sortFilter);
        
        // Reset to first page and update display
        this.currentPage = 1;
        this.displayItems();
        this.updatePagination();
        this.updateResultsInfo();
        
        console.log(`Final filtered items: ${this.filteredItems.length}`);
    }
    
    // Separate sorting logic for better organization
    applySorting(sortFilter) {
        const sortFunctions = {
            'discount-high': (a, b) => b.discountPercent - a.discountPercent,
            'price-low': (a, b) => a.price - b.price,
            'price-high': (a, b) => b.price - a.price,
            'popular': (a, b) => b.popularity - a.popularity,
            'newest': (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0),
            'rating': (a, b) => b.rating - a.rating,
            'default': (a, b) => b.popularity - a.popularity
        };
        
        const sortFn = sortFunctions[sortFilter] || sortFunctions.default;
        this.filteredItems.sort(sortFn);
    }
    
    // Optimized search with debouncing
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
    }
    
    performSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (term) {
            this.filteredItems = this.allSaleItems.filter(item => {
                const searchFields = [
                    item.title,
                    item.author,
                    item.category,
                    item.categoryDisplay,
                    item.giftCardCategory,
                    item.toyCategory,
                    item.manufacturer
                ].filter(Boolean);
                
                return searchFields.some(field => 
                    field.toLowerCase().includes(term)
                );
            });
        } else {
            this.filteredItems = [...this.allSaleItems];
        }
        
        this.currentPage = 1;
        this.displayItems();
        this.updatePagination();
        this.updateResultsInfo();
    }
    
    // Event listener setup
    setupEventListeners() {
        // Filter change listeners
        const filterSelects = document.querySelectorAll('#sale-category, #discount, #price-range, #sort');
        filterSelects.forEach(select => {
            select.addEventListener('change', () => this.applyFilters());
        });
        
        // Setup other components
        this.setupViewToggle();
        this.setupMobileMenu();
        this.setupSearch();
        
        // Setup card event listeners with delegation
        document.addEventListener('click', this.handleGlobalClick.bind(this));
    }
    
    // Global click handler for better performance
    handleGlobalClick(e) {
        const target = e.target.closest('[data-item-id]');
        if (!target) return;
        
        e.stopPropagation();
        const itemId = target.getAttribute('data-item-id');
        const item = this.allSaleItems.find(item => item.id === itemId);
        
        if (!item) return;
        
        if (target.classList.contains('btn-primary')) {
            if (item.isGiftCard) {
                this.buyGiftCard(item);
            } else {
                this.addToCart(item);
            }
        } else if (target.classList.contains('btn-secondary')) {
            this.toggleWishlist(item, target);
        }
    }
    
    // Optimized card event listeners
    setupCardEventListeners() {
        // Event delegation is handled in handleGlobalClick
        // This method is kept for compatibility but optimized
    }
    
    // Enhanced notification system
    showNotification(message, type = 'info', duration = 3000) {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            gift: 'gift'
        };
        
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db',
            gift: 'linear-gradient(135deg, #f39c12, #e67e22)'
        };
        
        notification.innerHTML = `
            <i class="fa-solid fa-${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <i class="fa-solid fa-times close-notification"></i>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
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
            cursor: pointer;
        `;
        
        document.body.appendChild(notification);
        
        // Close handlers
        const closeBtn = notification.querySelector('.close-notification');
        const closeNotification = () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        };
        
        closeBtn.addEventListener('click', closeNotification);
        notification.addEventListener('click', closeNotification);
        
        // Auto close
        setTimeout(closeNotification, duration);
    }
    
    // Cart and wishlist functions
    addToCart(item) {
        this.animateButton(item.id);
        this.showNotification(`${item.title} added to cart!`, 'success');
    }
    
    buyGiftCard(item) {
        this.animateButton(item.id);
        this.showNotification(`${item.title} purchased! Check your email for delivery.`, 'gift', 5000);
    }
    
    toggleWishlist(item, buttonElement) {
        const heartIcon = buttonElement.querySelector('i');
        const isInWishlist = heartIcon.classList.contains('fa-solid');
        
        if (isInWishlist) {
            heartIcon.classList.replace('fa-solid', 'fa-regular');
            heartIcon.style.color = '';
            this.showNotification(`${item.title} removed from wishlist`, 'info');
        } else {
            heartIcon.classList.replace('fa-regular', 'fa-solid');
            heartIcon.style.color = '#e74c3c';
            this.showNotification(`${item.title} added to wishlist!`, 'success');
        }
    }
    
    animateButton(itemId) {
        const button = document.querySelector(`[data-item-id="${itemId}"].btn-primary`);
        if (button) {
            button.style.transform = 'scale(0.95)';
            button.style.transition = 'transform 0.1s ease';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        }
    }
    
    // Timer functions
    updateTimer() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        if (distance < 0) {
            clearInterval(this.timerInterval);
            Object.values(elements).forEach(el => el && (el.innerHTML = '00'));
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (elements.days) elements.days.innerHTML = days.toString().padStart(2, '0');
        if (elements.hours) elements.hours.innerHTML = hours.toString().padStart(2, '0');
        if (elements.minutes) elements.minutes.innerHTML = minutes.toString().padStart(2, '0');
        if (elements.seconds) elements.seconds.innerHTML = seconds.toString().padStart(2, '0');
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
        this.updateTimer();
    }
    
    // Pagination functions
    updatePagination() {
        const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        const paginationContainer = document.querySelector('.pagination');
        
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = '';
        
        if (totalPages <= 1) return;
        
        const fragment = document.createDocumentFragment();
        
        // Previous button
        if (this.currentPage > 1) {
            fragment.appendChild(this.createPaginationButton('Previous', this.currentPage - 1));
        }
        
        // Page numbers with ellipsis logic
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            fragment.appendChild(this.createPaginationButton('1', 1));
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                fragment.appendChild(ellipsis);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = this.createPaginationButton(i.toString(), i);
            if (i === this.currentPage) pageBtn.classList.add('active');
            fragment.appendChild(pageBtn);
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                fragment.appendChild(ellipsis);
            }
            fragment.appendChild(this.createPaginationButton(totalPages.toString(), totalPages));
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            fragment.appendChild(this.createPaginationButton('Next', this.currentPage + 1));
        }
        
        paginationContainer.appendChild(fragment);
    }
    
    createPaginationButton(text, page) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'pagination-btn';
        button.addEventListener('click', () => {
            this.currentPage = page;
            this.displayItems();
            this.updatePagination();
            this.updateResultsInfo();
            
            // Smooth scroll to top
            document.querySelector('.books-grid')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        });
        return button;
    }
    
   // Update results info
    updateResultsInfo() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredItems.length);
        
        const resultsCountEl = document.getElementById('results-count');
        const totalResultsEl = document.getElementById('total-results');
        
        if (resultsCountEl) resultsCountEl.textContent = `${startIndex}-${endIndex}`;
        if (totalResultsEl) totalResultsEl.textContent = this.filteredItems.length;
        
        // Update category counts for debugging
        this.updateCategoryCounts();
    }
    
    // Debug function to show category counts
    updateCategoryCounts() {
        const categoryCounts = {};
        this.filteredItems.forEach(item => {
            categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
        });
        
        console.log('Current filtered category counts:', categoryCounts);
        console.log('Total filtered items:', this.filteredItems.length);
    }
    
    // View toggle functionality
    setupViewToggle() {
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                viewBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const container = document.getElementById('saleContainer');
                if (container) {
                    container.classList.toggle('list-view', e.target.dataset.view === 'list');
                }
            });
        });
    }
    
    // Mobile menu setup
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const filtersSection = document.querySelector('.filters-section');
        
        if (mobileMenuBtn && filtersSection) {
            mobileMenuBtn.addEventListener('click', () => {
                filtersSection.classList.toggle('show-mobile');
            });
        }
    }
    
    // Loading indicator functions
    showLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-indicator';
        loadingDiv.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading sale items...</p>
            </div>
        `;
        loadingDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        const spinnerStyle = `
            .loading-spinner { text-align: center; }
            .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        if (!document.getElementById('spinner-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'spinner-styles';
            styleSheet.textContent = spinnerStyle;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(loadingDiv);
        return loadingDiv;
    }
    
    hideLoadingIndicator(loadingDiv) {
        if (loadingDiv && loadingDiv.parentNode) {
            loadingDiv.parentNode.removeChild(loadingDiv);
        }
    }
    
    // Error message display
    showErrorMessage(message) {
        const container = document.getElementById('saleContainer');
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="
                    text-align: center; 
                    padding: 40px; 
                    color: #e74c3c;
                    background: #fdf2f2;
                    border: 1px solid #f5c6cb;
                    border-radius: 8px;
                    margin: 20px;
                ">
                    <i class="fa-solid fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" style="
                        background: #3498db;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 15px;
                    ">Refresh Page</button>
                </div>
            `;
        }
    }
    
    // Hide load more button (if exists)
    hideLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    // Enhanced filtering with better debugging
    applyFilters() {
        const categoryFilter = document.getElementById('sale-category')?.value;
        const discountFilter = document.getElementById('discount')?.value;
        const priceFilter = document.getElementById('price-range')?.value;
        const sortFilter = document.getElementById('sort')?.value;
        
        console.log('=== APPLYING FILTERS ===');
        console.log('Category Filter:', categoryFilter);
        console.log('Discount Filter:', discountFilter);
        console.log('Price Filter:', priceFilter);
        console.log('Sort Filter:', sortFilter);
        console.log('Total items before filtering:', this.allSaleItems.length);
        
        // Debug: Show all categories available
        const availableCategories = [...new Set(this.allSaleItems.map(item => item.category))];
        console.log('Available categories:', availableCategories);
        
        // Start with all items
        this.filteredItems = [...this.allSaleItems];
        console.log('Starting with all items:', this.filteredItems.length);
        
        // Apply category filter
        if (categoryFilter && categoryFilter !== 'all') {
            const beforeCount = this.filteredItems.length;
            this.filteredItems = this.filteredItems.filter(item => {
                const matches = item.category === categoryFilter;
                if (!matches && categoryFilter === 'toys-games') {
                    console.log('Toys-games item filtered out:', item.title, 'Category:', item.category);
                }
                return matches;
            });
            console.log(`Category filter (${categoryFilter}): ${beforeCount} -> ${this.filteredItems.length} items`);
            
            // Debug: Show what items are left for toys-games
            if (categoryFilter === 'toys-games') {
                console.log('Toys-games items after category filter:', 
                    this.filteredItems.filter(item => item.category === 'toys-games').map(item => ({
                        title: item.title,
                        category: item.category,
                        price: item.price,
                        discount: item.discountPercent
                    }))
                );
            }
        }
        
        // Apply discount filter
        if (discountFilter) {
            const beforeCount = this.filteredItems.length;
            
            // Parse discount filter - handle different formats
            let minDiscount = 0;
            let maxDiscount = 100;
            
            if (discountFilter.includes('-')) {
                const parts = discountFilter.split('-');
                minDiscount = parseInt(parts[0]) || 0;
                maxDiscount = parts[1] === '+' ? 100 : (parseInt(parts[1]) || 100);
            } else if (discountFilter.endsWith('+')) {
                minDiscount = parseInt(discountFilter.replace('+', '')) || 0;
                maxDiscount = 100;
            } else {
                // Single value - treat as minimum
                minDiscount = parseInt(discountFilter) || 0;
            }
            
            console.log(`Discount filter parsing: ${discountFilter} -> min: ${minDiscount}, max: ${maxDiscount}`);
            
            this.filteredItems = this.filteredItems.filter(item => {
                const matches = item.discountPercent >= minDiscount && item.discountPercent <= maxDiscount;
                if (!matches) {
                    console.log(`Item filtered out by discount: ${item.title} (${item.discountPercent}% discount)`);
                }
                return matches;
            });
            
            console.log(`Discount filter (${discountFilter}): ${beforeCount} -> ${this.filteredItems.length} items`);
        }
        
        // Apply price filter
        if (priceFilter) {
            const beforeCount = this.filteredItems.length;
            
            // Parse price filter
            let minPrice = 0;
            let maxPrice = Infinity;
            
            if (priceFilter.includes('-')) {
                const parts = priceFilter.split('-');
                minPrice = parseInt(parts[0]) || 0;
                maxPrice = parts[1] === '+' ? Infinity : (parseInt(parts[1]) || Infinity);
            } else if (priceFilter.endsWith('+')) {
                minPrice = parseInt(priceFilter.replace('+', '')) || 0;
                maxPrice = Infinity;
            }
            
            console.log(`Price filter parsing: ${priceFilter} -> min: ${minPrice}, max: ${maxPrice}`);
            
            this.filteredItems = this.filteredItems.filter(item => {
                const matches = item.price >= minPrice && (maxPrice === Infinity || item.price <= maxPrice);
                if (!matches) {
                    console.log(`Item filtered out by price: ${item.title} (₹${item.price})`);
                }
                return matches;
            });
            
            console.log(`Price filter (${priceFilter}): ${beforeCount} -> ${this.filteredItems.length} items`);
        }
        
        // Apply sorting
        this.applySorting(sortFilter);
        
        // Reset to first page and update display
        this.currentPage = 1;
        this.displayItems();
        this.updatePagination();
        this.updateResultsInfo();
        
        console.log(`=== FILTERING COMPLETE ===`);
        console.log(`Final filtered items: ${this.filteredItems.length}`);
        
        // Show message if no items found
        if (this.filteredItems.length === 0) {
            this.showNoResultsMessage();
        }
    }
    
    // Show no results message
    showNoResultsMessage() {
        const container = document.getElementById('saleContainer');
        if (container) {
            container.innerHTML = `
                <div class="no-results" style="
                    text-align: center; 
                    padding: 60px 20px; 
                    color: #666;
                    background: #f8f9fa;
                    border-radius: 8px;
                    margin: 20px;
                ">
                    <i class="fa-solid fa-search" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3>No items found</h3>
                    <p>Try adjusting your filters or search terms to find what you're looking for.</p>
                    <button onclick="window.salesSystem.clearAllFilters()" style="
                        background: #3498db;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 15px;
                        font-size: 16px;
                    ">Clear All Filters</button>
                </div>
            `;
        }
    }
    
    // Clear all filters
    clearAllFilters() {
        // Reset all filter controls
        const categorySelect = document.getElementById('sale-category');
        const discountSelect = document.getElementById('discount');
        const priceSelect = document.getElementById('price-range');
        const sortSelect = document.getElementById('sort');
        const searchInput = document.getElementById('search-input');
        
        if (categorySelect) categorySelect.value = 'all';
        if (discountSelect) discountSelect.value = '';
        if (priceSelect) priceSelect.value = '';
        if (sortSelect) sortSelect.value = 'default';
        if (searchInput) searchInput.value = '';
        
        // Reset filtered items and display
        this.filteredItems = [...this.allSaleItems];
        this.currentPage = 1;
        this.displayItems();
        this.updatePagination();
        this.updateResultsInfo();
        
        this.showNotification('All filters cleared!', 'info');
    }
    
    // Enhanced item processing with better toys-games handling
    processItemForSale(item, category, index) {
        try {
            // Validate required fields
            if (!item || typeof item !== 'object') {
                console.warn(`Invalid item data for ${category}[${index}]:`, item);
                return null;
            }
            
            const title = item.title || `Untitled ${category} Item`;
            if (!title.trim()) {
                console.warn(`Missing title for ${category}[${index}]:`, item);
                return null;
            }
            
            const saleConfig = this.SALE_CONFIG[category] || { minDiscount: 30, maxDiscount: 70 };
            
            // Calculate pricing
            const originalPrice = item.originalPrice || item.price || 999;
            const discountPercent = this.generateRandomDiscount(saleConfig.minDiscount, saleConfig.maxDiscount);
            const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));
            
            // Generate sale badge
            const badge = this.generateSaleBadge(discountPercent, item.badge, category);
            
            // Handle author/manufacturer/brand - special handling for toys-games
            let authorOrManufacturer = item.author || item.brand || item.manufacturer || 'Unknown';
            if (category === 'toys-games' && item.manufacturer) {
                authorOrManufacturer = item.manufacturer;
            } else if (category === 'gift-cards' && item.manufacturer) {
                authorOrManufacturer = item.manufacturer;
            }
            
            const processedItem = {
                id: `${category}-${index}`,
                title: title,
                author: authorOrManufacturer,
                category: category, // Ensure category is preserved exactly
                categoryDisplay: this.CATEGORY_DISPLAY_NAMES[category] || category,
                rating: this.validateRating(item.rating),
                price: salePrice,
                originalPrice: originalPrice,
                discountPercent: discountPercent,
                image: item.image || `images/placeholder-${category}.jpg`,
                badge: badge,
                popularity: item.popularity || Math.floor(Math.random() * 100) + 1,
                isNew: this.isNewItem(item.releaseDate),
                ageGroup: item.ageGroup || null,
                color: item.color || null,
                size: item.size || null,
                savings: originalPrice - salePrice,
                manufacturer: item.manufacturer || item.brand || null,
                
                // Category-specific properties
                ...(category === 'gift-cards' && {
                    isGiftCard: true,
                    giftCardCategory: item.category || 'General'
                }),
                
                ...(category === 'toys-games' && {
                    isToy: true,
                    toyCategory: item.category || 'General'
                })
            };
            
            console.log(`✓ Processed item for ${category}:`, {
                title: processedItem.title,
                category: processedItem.category,
                manufacturer: processedItem.manufacturer,
                price: processedItem.price,
                discount: processedItem.discountPercent
            });
            
            return processedItem;
            
        } catch (error) {
            console.error(`Error processing item ${category}[${index}]:`, error, item);
            return null;
        }
    }
    
    // Add method to expose instance globally for debugging
    exposeGlobally() {
        window.salesSystem = this;
        console.log('Sales system exposed globally as window.salesSystem');
    }
    
    // Add debugging method
    debugFiltering() {
        console.log('=== DEBUG INFO ===');
        console.log('Total items loaded:', this.allSaleItems.length);
        console.log('Items by category:');
        
        const categoryBreakdown = {};
        this.allSaleItems.forEach(item => {
            if (!categoryBreakdown[item.category]) {
                categoryBreakdown[item.category] = [];
            }
            categoryBreakdown[item.category].push({
                title: item.title,
                price: item.price,
                discount: item.discountPercent
            });
        });
        
        Object.entries(categoryBreakdown).forEach(([category, items]) => {
            console.log(`${category}: ${items.length} items`);
            items.forEach(item => {
                console.log(`  - ${item.title} (₹${item.price}, ${item.discount}% off)`);
            });
        });
        
        console.log('Current filters:');
        console.log('- Category:', document.getElementById('sale-category')?.value);
        console.log('- Discount:', document.getElementById('discount')?.value);
        console.log('- Price:', document.getElementById('price-range')?.value);
        console.log('- Sort:', document.getElementById('sort')?.value);
        
        console.log('Filtered items count:', this.filteredItems.length);
    }
}

// Initialize the sales system when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing sales system...');
    const salesSystem = new SalesSystem();
    
    // Expose for debugging
    salesSystem.exposeGlobally();
    
    // Add debugging commands to console
    console.log('%cDebugging Commands Available:', 'color: #3498db; font-weight: bold; font-size: 14px;');
    console.log('%c- window.salesSystem.debugFiltering() - Show detailed filtering info', 'color: #27ae60;');
    console.log('%c- window.salesSystem.clearAllFilters() - Clear all filters', 'color: #27ae60;');
    console.log('%c- window.salesSystem.allSaleItems - View all loaded items', 'color: #27ae60;');
    console.log('%c- window.salesSystem.filteredItems - View currently filtered items', 'color: #27ae60;');
});

// Add CSS for better styling
const additionalStyles = `
    .notification {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
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
    
    .toy-overlay, .gift-card-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        font-size: 10px;
        font-weight: bold;
        text-align: center;
    }
    
    .toy-category, .gift-card-category {
        font-size: 12px;
        color: #666;
        margin: 4px 0;
    }
    
    .new-badge {
        background: #e74c3c;
        color: white;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 10px;
        margin-left: 8px;
    }
    
    .pagination-ellipsis {
        padding: 8px 12px;
        color: #666;
    }
    
    .book-card.toy-item {
        border-left: 4px solid #f39c12;
    }
    
    .book-card.gift-card-item {
        border-left: 4px solid #9b59b6;
    }
`;

// Add the additional styles to the page
if (!document.getElementById('additional-sales-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'additional-sales-styles';
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
}