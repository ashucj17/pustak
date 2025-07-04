// Optimized Stationery Store JavaScript with Proper Card Alignment and Database Integration
class StationeryStore {
    constructor() {
        this.allProducts = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.totalPages = 1;
        this.currentView = 'grid';
        this.categories = [];
        this.brands = [];
        this.isLoading = false;
        this.cache = new Map();
        this.wishlist = new Set();
        
        // API Configuration
        this.apiConfig = {
            baseUrl: 'http://127.0.0.1:5502/stationery-gifts.html', // Replace with your API URL
            endpoints: {
                products: '/stationery',
                categories: '/categories',
                brands: '/brands'
            },
            fallbackPaths: [
                './stationery.json',
                '/stationery.json',
                '../stationery.json',
                '/stationery.json'
            ]
        };
        
        // DOM elements
        this.elements = {};
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // Initialize the application
    async init() {
        try {
            this.initializeElements();
            this.showLoadingState();
            await this.fetchProductData();
            this.processProductData();
            this.renderCategories();
            this.calculatePagination();
            this.renderProducts();
            this.renderPagination();
            this.updateResultsInfo();
            this.setupEventListeners();
            this.hideLoadingState();
            console.log(`✅ Store initialized with ${this.allProducts.length} products`);
        } catch (error) {
            console.error('❌ Failed to initialize store:', error);
            this.showErrorState('Failed to load products. Please try again later.');
        }
    }

    // Initialize DOM elements
    initializeElements() {
        this.elements = {
            productsContainer: document.getElementById('productsContainer') || document.querySelector('.books-container'),
            categoryFilter: document.getElementById('category'),
            brandFilter: document.getElementById('brand'),
            priceFilter: document.getElementById('price-range'),
            sortSelect: document.getElementById('sort'),
            resultsCount: document.getElementById('results-count'),
            totalResults: document.getElementById('total-results'),
            viewButtons: document.querySelectorAll('.view-btn'),
            searchInput: document.querySelector('input[type="search"]'),
            categoriesGrid: document.querySelector('.categories-grid'),
            paginationContainer: document.querySelector('.pagination'),
            
            // Mobile menu elements
            mobileMenuButton: document.querySelector('.fa-bars'),
            mobileMenuContainer: document.querySelector('.mobile-menu-container'),
            closeMenuButton: document.querySelector('.close-menu'),
            mobileMenuOverlay: document.querySelector('.mobile-menu-overlay')
        };

        // Create pagination container if it doesn't exist
        if (!this.elements.paginationContainer) {
            this.elements.paginationContainer = document.createElement('div');
            this.elements.paginationContainer.className = 'pagination';
            
            const insertAfter = this.elements.productsContainer?.parentNode || document.querySelector('.main-content');
            if (insertAfter) {
                insertAfter.appendChild(this.elements.paginationContainer);
            }
        }
    }

    // Enhanced fetch with API and fallback support
    async fetchProductData() {
        const cacheKey = 'stationery-products';
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            this.allProducts = this.cache.get(cacheKey);
            console.log('📦 Loaded products from cache');
            return;
        }

        // Try API first, then fallback to JSON files
        try {
            await this.fetchFromAPI();
        } catch (apiError) {
            console.warn('⚠️ API fetch failed, trying fallback files:', apiError.message);
            await this.fetchFromFallbackFiles();
        }
    }

    // Fetch from API endpoint
    async fetchFromAPI() {
        const apiUrl = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints.products}`;
        
        console.log(`🌐 Attempting to fetch from API: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const products = this.extractProductsFromResponse(data);
        
        if (products.length === 0) {
            throw new Error('No products found in API response');
        }

        this.allProducts = products;
        this.cache.set('stationery-products', products);
        console.log(`✅ Successfully loaded ${products.length} products from API`);
    }

    // Fallback to JSON files
    async fetchFromFallbackFiles() {
        let lastError = null;

        for (const path of this.apiConfig.fallbackPaths) {
            try {
                console.log(`🔍 Attempting to fetch from: ${path}`);
                const response = await fetch(path);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                const products = this.extractProductsFromResponse(data);
                
                if (products.length === 0) {
                    throw new Error('No products found in JSON structure');
                }
                
                this.allProducts = products;
                this.cache.set('stationery-products', products);
                console.log(`✅ Successfully loaded ${products.length} products from ${path}`);
                return;
                
            } catch (error) {
                console.warn(`⚠️ Failed to fetch from ${path}:`, error.message);
                lastError = error;
                continue;
            }
        }

        // If all attempts failed, use fallback data
        console.warn('🔄 All fetch attempts failed, using fallback data');
        this.allProducts = this.getSampleData();
        
        if (lastError) {
            console.error('Last error encountered:', lastError);
        }
    }

    // Extract products from various response formats
    extractProductsFromResponse(data) {
        if (Array.isArray(data)) {
            return data;
        }
        
        // Check various possible structures
        const possibleKeys = ['stationery', 'products', 'items', 'data', 'results'];
        
        for (const key of possibleKeys) {
            if (data[key] && Array.isArray(data[key])) {
                return data[key];
            }
        }
        
        // If single product object
        if (data.title || data.name) {
            return [data];
        }
        
        return [];
    }

    // Process and normalize product data
    processProductData() {
        if (!Array.isArray(this.allProducts)) {
            console.error('❌ Product data is not an array:', this.allProducts);
            this.allProducts = [];
            return;
        }

        this.allProducts = this.allProducts.map((product, index) => {
            try {
                return {
                    id: product.id || index + 1,
                    title: product.title || product.name || `Product ${index + 1}`,
                    brand: product.brand || 'Unknown Brand',
                    category: this.normalizeCategory(product.category),
                    rating: parseFloat(product.rating) || 4.0,
                    price: parseFloat(product.price) || 0,
                    originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
                    image: product.image || null,
                    color: product.color || 'Default',
                    badge: product.badge || null,
                    popularity: product.popularity || 0,
                    releaseDate: product.releaseDate || null,
                    size: product.size || null,
                    
                    // Additional normalized fields
                    author: product.brand || 'Unknown Brand', // For compatibility
                    isPopular: (product.popularity && product.popularity > 90) || product.badge === 'Bestseller',
                    dateAdded: product.releaseDate ? new Date(product.releaseDate) : new Date(),
                    
                    // Category-specific styling
                    icon: this.getIconForCategory(product.category),
                    gradient: this.getGradientForCategory(product.category)
                };
            } catch (error) {
                console.warn(`⚠️ Error processing product at index ${index}:`, error);
                return null;
            }
        }).filter(Boolean);

        // Extract unique categories and brands
        this.categories = [...new Set(this.allProducts.map(p => p.category))].filter(Boolean).sort();
        this.brands = [...new Set(this.allProducts.map(p => p.brand))].filter(Boolean).sort();
        
        this.filteredProducts = [...this.allProducts];
        this.populateFilterDropdowns();

        console.log(`📊 Processed ${this.allProducts.length} products, ${this.categories.length} categories, ${this.brands.length} brands`);
    }

    // Normalize category names
    normalizeCategory(category) {
        if (!category) return 'Office Supplies';
        
        const categoryMap = {
            'notebooks': 'Notebooks',
            'pens': 'Writing Instruments',
            'pencils': 'Writing Instruments',
            'art supplies': 'Art Supplies',
            'markers': 'Writing Instruments',
            'highlighters': 'Writing Instruments',
            'planners': 'Planners',
            'office': 'Office Supplies',
            'gifts': 'Gift Sets',
            'writing': 'Writing Instruments'
        };

        const normalized = category.toLowerCase().trim();
        return categoryMap[normalized] || category;
    }

    // Get icon for category
    getIconForCategory(category) {
        const iconMap = {
            'Notebooks': 'fa-solid fa-book',
            'Writing Instruments': 'fa-solid fa-pen',
            'Art Supplies': 'fa-solid fa-palette',
            'Planners': 'fa-solid fa-calendar-days',
            'Office Supplies': 'fa-solid fa-folder-open',
            'Gift Sets': 'fa-solid fa-gift'
        };
        return iconMap[category] || 'fa-solid fa-pen';
    }

    // Get gradient for category
    getGradientForCategory(category) {
        const gradientMap = {
            'Notebooks': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'Writing Instruments': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'Art Supplies': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'Planners': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'Office Supplies': 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
            'Gift Sets': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        };
        return gradientMap[category] || 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)';
    }

    // Create product card matching your HTML structure
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'book-card';
        
        // Generate badge HTML
        const badgeHtml = product.badge ? 
            `<div class="book-badge ${product.badge.toLowerCase().replace(/\s+/g, '-')}">${product.badge}</div>` : '';
        
        // Generate star rating
        const starsHtml = this.generateStarRating(product.rating);
        
        // Generate price HTML
        const originalPriceHtml = product.originalPrice ? 
            `<span class="original-price">₹${product.originalPrice.toLocaleString()}</span>` : '';

        card.innerHTML = `
            ${badgeHtml}
            <div class="book-img" style="background: ${product.gradient}; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                <i class="${product.icon}"></i>
            </div>
            <div class="book-content">
                <h3>${product.title}</h3>
                <p class="author">${product.brand}${product.color && product.color !== 'Default' ? `, ${product.color}` : ''}${product.size ? `, ${product.size}` : ''}</p>
                <div class="rating">
                    ${starsHtml}
                    <span>(${product.rating})</span>
                </div>
                <div class="price">
                    ₹${product.price.toLocaleString()} 
                    ${originalPriceHtml}
                </div>
                <div class="book-actions">
                    <button class="btn-primary" onclick="stationeryStore.addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="btn-secondary heart-btn ${this.wishlist.has(product.id) ? 'active' : ''}" 
                            data-product-id="${product.id}"
                            onclick="stationeryStore.toggleWishlist(${product.id})">
                        <i class="fa-${this.wishlist.has(product.id) ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    // Generate star rating HTML
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHtml = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fa-solid fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="fa-regular fa-star"></i>';
        }
        
        return starsHtml;
    }

    // Render products with proper pagination
    renderProducts() {
        if (!this.elements.productsContainer) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
        
        this.elements.productsContainer.innerHTML = '';
        
        if (productsToShow.length === 0) {
            this.elements.productsContainer.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <i class="fa-solid fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                    <button class="btn-primary" onclick="stationeryStore.resetFilters()">Reset Filters</button>
                </div>
            `;
            return;
        }
        
        // Add products with staggered animation
        productsToShow.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            productCard.style.opacity = '0';
            productCard.style.transform = 'translateY(20px)';
            this.elements.productsContainer.appendChild(productCard);
            
            // Staggered animation
            setTimeout(() => {
                productCard.style.transition = 'all 0.3s ease';
                productCard.style.opacity = '1';
                productCard.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    // Calculate pagination
    calculatePagination() {
        this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    }

    // Render pagination controls
    renderPagination() {
        if (!this.elements.paginationContainer || this.totalPages <= 1) {
            if (this.elements.paginationContainer) {
                this.elements.paginationContainer.style.display = 'none';
            }
            return;
        }

        this.elements.paginationContainer.style.display = 'flex';
        
        let paginationHTML = `
            <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                    onclick="stationeryStore.goToPage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fa-solid fa-chevron-left"></i> Previous
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn page-number ${i === this.currentPage ? 'active' : ''}" 
                        onclick="stationeryStore.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        paginationHTML += `
            <button class="pagination-btn ${this.currentPage === this.totalPages ? 'disabled' : ''}" 
                    onclick="stationeryStore.goToPage(${this.currentPage + 1})"
                    ${this.currentPage === this.totalPages ? 'disabled' : ''}>
                Next <i class="fa-solid fa-chevron-right"></i>
            </button>
        `;

        this.elements.paginationContainer.innerHTML = paginationHTML;
    }

    // Navigate to specific page
    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        
        this.currentPage = page;
        this.renderProducts();
        this.renderPagination();
        this.updateResultsInfo();
        
        // Scroll to top of products
        if (this.elements.productsContainer) {
            this.elements.productsContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    // Apply filters
    applyFilters() {
        const selectedCategory = this.elements.categoryFilter?.value || '';
        const selectedBrand = this.elements.brandFilter?.value || '';
        const selectedPriceRange = this.elements.priceFilter?.value || '';
        
        this.filteredProducts = this.allProducts.filter(product => {
            if (selectedCategory && product.category !== selectedCategory) return false;
            if (selectedBrand && product.brand !== selectedBrand) return false;
            
            if (selectedPriceRange) {
                const price = product.price;
                switch (selectedPriceRange) {
                    case '0-199': return price < 200;
                    case '200-499': return price >= 200 && price <= 499;
                    case '500-999': return price >= 500 && price <= 999;
                    case '1000-1999': return price >= 1000 && price <= 1999;
                    case '2000+': return price >= 2000;
                    default: return true;
                }
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.calculatePagination();
        this.applySorting();
    }

    // Apply sorting
    applySorting() {
        const sortValue = this.elements.sortSelect?.value || 'featured';
        
        switch (sortValue) {
            case 'newest':
                this.filteredProducts.sort((a, b) => b.dateAdded - a.dateAdded);
                break;
            case 'popular':
                this.filteredProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'title':
                this.filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'featured':
            default:
                this.filteredProducts.sort((a, b) => {
                    const badgePriority = { 'Bestseller': 4, 'Popular': 3, 'New': 2, 'Sale': 1 };
                    const aPriority = badgePriority[a.badge] || 0;
                    const bPriority = badgePriority[b.badge] || 0;
                    return bPriority - aPriority || b.rating - a.rating;
                });
                break;
        }
        
        this.renderProducts();
        this.renderPagination();
        this.updateResultsInfo();
    }

    // Populate filter dropdowns
    populateFilterDropdowns() {
        if (this.elements.categoryFilter) {
            this.elements.categoryFilter.innerHTML = '<option value="">All Categories</option>';
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                this.elements.categoryFilter.appendChild(option);
            });
        }

        if (this.elements.brandFilter) {
            this.elements.brandFilter.innerHTML = '<option value="">All Brands</option>';
            this.brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                this.elements.brandFilter.appendChild(option);
            });
        }
    }

    // Setup event listeners
    setupEventListeners() {
        this.elements.categoryFilter?.addEventListener('change', () => {
            this.currentPage = 1;
            this.applyFilters();
        });
        
        this.elements.brandFilter?.addEventListener('change', () => {
            this.currentPage = 1;
            this.applyFilters();
        });
        
        this.elements.priceFilter?.addEventListener('change', () => {
            this.currentPage = 1;
            this.applyFilters();
        });
        
        this.elements.sortSelect?.addEventListener('change', () => {
            this.currentPage = 1;
            this.applySorting();
        });

        // Search with debouncing
        if (this.elements.searchInput) {
            let searchTimeout;
            this.elements.searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e);
                }, 300);
            });
        }
    }

    // Handle search
    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        
        this.filteredProducts = searchTerm === '' ? [...this.allProducts] : 
            this.allProducts.filter(product => 
                product.title.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        
        this.currentPage = 1;
        this.calculatePagination();
        this.applySorting();
    }

    // Add to cart
    addToCart(productId) {
        const product = this.allProducts.find(p => p.id === productId);
        if (!product) return;
        
        console.log(`Added to cart: ${product.title}`);
        this.showNotification(`Added "${product.title}" to cart!`, 'success');
    }

    // Toggle wishlist
    toggleWishlist(productId) {
        const product = this.allProducts.find(p => p.id === productId);
        if (!product) return;

        if (this.wishlist.has(productId)) {
            this.wishlist.delete(productId);
            console.log(`Removed from wishlist: ${product.title}`);
        } else {
            this.wishlist.add(productId);
            console.log(`Added to wishlist: ${product.title}`);
        }
        
        // Re-render to update heart icons
        this.renderProducts();
    }

    // Update results info
    updateResultsInfo() {
        if (this.elements.resultsCount) {
            const startItem = (this.currentPage - 1) * this.productsPerPage + 1;
            const endItem = Math.min(startItem + this.productsPerPage - 1, this.filteredProducts.length);
            this.elements.resultsCount.textContent = 
                `Showing ${startItem}-${endItem} of ${this.filteredProducts.length} products`;
        }
        
        if (this.elements.totalResults) {
            this.elements.totalResults.textContent = this.filteredProducts.length;
        }
    }

    // Reset filters
    resetFilters() {
        if (this.elements.categoryFilter) this.elements.categoryFilter.value = '';
        if (this.elements.brandFilter) this.elements.brandFilter.value = '';
        if (this.elements.priceFilter) this.elements.priceFilter.value = '';
        if (this.elements.sortSelect) this.elements.sortSelect.value = 'featured';
        if (this.elements.searchInput) this.elements.searchInput.value = '';

        this.currentPage = 1;
        this.filteredProducts = [...this.allProducts];
        this.calculatePagination();
        this.applySorting();
    }

    // Show notification
    showNotification(message, type = 'info') {
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
            `;
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Loading state
    showLoadingState() {
        if (this.elements.productsContainer) {
            this.elements.productsContainer.innerHTML = `
                <div class="loading-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                    <p>Loading products...</p>
                </div>
            `;
        }
    }

    hideLoadingState() {
        this.isLoading = false;
    }

    // Error state
    showErrorState(message) {
        if (this.elements.productsContainer) {
            this.elements.productsContainer.innerHTML = `
                <div class="error-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fa-solid fa-exclamation-triangle" style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;"></i>
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    <button class="btn-primary" onclick="location.reload()">
                        <i class="fa-solid fa-refresh"></i> Try Again
                    </button>
                </div>
            `;
        }
    }

    // Render categories (if category grid exists)
    renderCategories() {
        if (!this.elements.categoriesGrid) return;

        const categoryData = this.categories.map(category => ({
            name: category,
            count: this.allProducts.filter(p => p.category === category).length,
            icon: this.getIconForCategory(category)
        }));
        
        this.elements.categoriesGrid.innerHTML = categoryData.map(category => `
            <div class="category-card" onclick="stationeryStore.filterByCategory('${category.name}')">
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <h3>${category.name}</h3>
                <span class="book-count">${category.count} products</span>
            </div>
        `).join('');
    }

    // Filter by category
   // Filter by category
    filterByCategory(category) {
        if (this.elements.categoryFilter) {
            this.elements.categoryFilter.value = category;
            this.currentPage = 1;
            this.applyFilters();
        }
        
        // Scroll to products section
        if (this.elements.productsContainer) {
            this.elements.productsContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    // Enhanced sample data with proper structure
    getSampleData() {
        return [
            {
                id: 1,
                title: "Moleskine Classic Notebook",
                brand: "Moleskine",
                category: "Notebooks",
                rating: 4.8,
                price: 1299,
                originalPrice: 1599,
                image: "images/moleskine-classic.jpg",
                color: "Black",
                badge: "Bestseller",
                popularity: 96,
                releaseDate: "2023-03-15",
                size: "A5"
            },
            {
                id: 2,
                title: "Parker Jotter Ballpoint Pen",
                brand: "Parker",
                category: "Writing Instruments",
                rating: 4.6,
                price: 899,
                originalPrice: 1199,
                image: "images/parker-jotter.jpg",
                color: "Blue",
                badge: "Popular",
                popularity: 88,
                releaseDate: "2023-04-20",
                size: "Standard"
            },
            {
                id: 3,
                title: "Staedtler Pigment Liner Set",
                brand: "Staedtler",
                category: "Art Supplies",
                rating: 4.7,
                price: 1599,
                originalPrice: null,
                image: "images/staedtler-liner.jpg",
                color: "Black",
                badge: "New",
                popularity: 75,
                releaseDate: "2024-01-10",
                size: "Pack of 8"
            },
            {
                id: 4,
                title: "Rhodia DotPad Notebook",
                brand: "Rhodia",
                category: "Notebooks",
                rating: 4.5,
                price: 750,
                originalPrice: null,
                image: "images/rhodia-dotpad.jpg",
                color: "Orange",
                badge: null,
                popularity: 65,
                releaseDate: "2023-08-15",
                size: "A4"
            },
            {
                id: 5,
                title: "2024 Weekly Planner",
                brand: "Passion Planner",
                category: "Planners",
                rating: 4.9,
                price: 2199,
                originalPrice: 2599,
                image: "images/passion-planner.jpg",
                color: "Navy Blue",
                badge: "Bestseller",
                popularity: 93,
                releaseDate: "2023-11-01",
                size: "A5"
            },
            {
                id: 6,
                title: "Faber-Castell Highlighter Set",
                brand: "Faber-Castell",
                category: "Writing Instruments",
                rating: 4.4,
                price: 350,
                originalPrice: 450,
                image: "images/faber-highlighter.jpg",
                color: "Multicolor",
                badge: "Sale",
                popularity: 70,
                releaseDate: "2023-06-10",
                size: "Pack of 6"
            },
            {
                id: 7,
                title: "Executive Gift Set",
                brand: "Cross",
                category: "Gift Sets",
                rating: 4.8,
                price: 4999,
                originalPrice: 5999,
                image: "images/cross-gift-set.jpg",
                color: "Gold",
                badge: "Premium",
                popularity: 85,
                releaseDate: "2023-12-01",
                size: "Deluxe"
            },
            {
                id: 8,
                title: "Sticky Notes Collection",
                brand: "3M Post-it",
                category: "Office Supplies",
                rating: 4.3,
                price: 299,
                originalPrice: null,
                image: "images/post-it-notes.jpg",
                color: "Assorted",
                badge: null,
                popularity: 60,
                releaseDate: "2023-07-05",
                size: "Standard"
            },
            {
                id: 9,
                title: "Watercolor Paint Set",
                brand: "Winsor & Newton",
                category: "Art Supplies",
                rating: 4.6,
                price: 3200,
                originalPrice: 3800,
                image: "images/watercolor-set.jpg",
                color: "Multi",
                badge: "Professional",
                popularity: 78,
                releaseDate: "2023-09-20",
                size: "24 Colors"
            },
            {
                id: 10,
                title: "Mechanical Pencil Set",
                brand: "Pentel",
                category: "Writing Instruments",
                rating: 4.5,
                price: 650,
                originalPrice: 800,
                image: "images/pentel-mechanical.jpg",
                color: "Black",
                badge: null,
                popularity: 72,
                releaseDate: "2023-05-30",
                size: "0.5mm"
            },
            {
                id: 11,
                title: "Leather Bound Journal",
                brand: "Rustico",
                category: "Notebooks",
                rating: 4.7,
                price: 1899,
                originalPrice: 2299,
                image: "images/leather-journal.jpg",
                color: "Brown",
                badge: "Handcrafted",
                popularity: 82,
                releaseDate: "2023-10-15",
                size: "A5"
            },
            {
                id: 12,
                title: "Desk Organizer Set",
                brand: "Bamboo Co",
                category: "Office Supplies",
                rating: 4.4,
                price: 1250,
                originalPrice: 1500,
                image: "images/desk-organizer.jpg",
                color: "Natural",
                badge: "Eco-Friendly",
                popularity: 68,
                releaseDate: "2023-08-01",
                size: "Large"
            }
        ];
    }

    // Enhanced create product card with improved alignment
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.setAttribute('data-product-id', product.id);
        card.setAttribute('data-category', product.category);
        
        // Generate badge HTML
        const badgeHtml = product.badge ? 
            `<div class="book-badge ${product.badge.toLowerCase().replace(/\s+/g, '-')}">${product.badge}</div>` : '';
        
        // Generate star rating
        const starsHtml = this.generateStarRating(product.rating);
        
        // Generate price HTML
        const originalPriceHtml = product.originalPrice ? 
            `<span class="original-price">₹${product.originalPrice.toLocaleString()}</span>` : '';

        // Create image or icon display
        const imageHtml = product.image ? 
            `<img src="${product.image}" alt="${product.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="book-icon-fallback" style="display: none; background: ${product.gradient}; align-items: center; justify-content: center; color: white; font-size: 2rem; height: 100%;">
                 <i class="${product.icon}"></i>
             </div>` :
            `<div class="book-icon" style="background: ${product.gradient}; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; height: 100%;">
                 <i class="${product.icon}"></i>
             </div>`;

        // Build author/brand info
        const authorInfo = [
            product.brand,
            product.color && product.color !== 'Default' ? product.color : null,
            product.size ? product.size : null
        ].filter(Boolean).join(', ');

        card.innerHTML = `
            ${badgeHtml}
            <div class="book-img">
                ${imageHtml}
            </div>
            <div class="book-content">
                <h3 class="book-title" title="${product.title}">${product.title}</h3>
                <p class="author">${authorInfo}</p>
                <div class="rating">
                    <div class="stars">
                        ${starsHtml}
                    </div>
                    <span class="rating-value">(${product.rating})</span>
                </div>
                <div class="price">
                    <span class="current-price">₹${product.price.toLocaleString()}</span>
                    ${originalPriceHtml}
                </div>
                <div class="book-actions">
                    <button class="btn-primary add-to-cart-btn" 
                            data-product-id="${product.id}"
                            onclick="stationeryStore.addToCart(${product.id})">
                        <i class="fa-solid fa-cart-plus"></i>
                        Add to Cart
                    </button>
                    <button class="btn-secondary heart-btn ${this.wishlist.has(product.id) ? 'active' : ''}" 
                            data-product-id="${product.id}"
                            onclick="stationeryStore.toggleWishlist(${product.id})"
                            title="${this.wishlist.has(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}">
                        <i class="fa-${this.wishlist.has(product.id) ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    // Enhanced render products with better alignment
    renderProducts() {
        if (!this.elements.productsContainer) return;

        // Add loading class
        this.elements.productsContainer.classList.add('loading');

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
        
        // Clear container
        this.elements.productsContainer.innerHTML = '';
        
        if (productsToShow.length === 0) {
            this.elements.productsContainer.innerHTML = `
                <div class="no-products">
                    <div class="no-products-content">
                        <i class="fa-solid fa-search"></i>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                        <button class="btn-primary" onclick="stationeryStore.resetFilters()">
                            <i class="fa-solid fa-refresh"></i>
                            Reset Filters
                        </button>
                    </div>
                </div>
            `;
            this.elements.productsContainer.classList.remove('loading');
            return;
        }

        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Add products
        productsToShow.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            productCard.style.animationDelay = `${index * 0.1}s`;
            fragment.appendChild(productCard);
        });

        // Append all cards at once
        this.elements.productsContainer.appendChild(fragment);
        
        // Remove loading class
        setTimeout(() => {
            this.elements.productsContainer.classList.remove('loading');
        }, 100);

        // Trigger entrance animations
        requestAnimationFrame(() => {
            const cards = this.elements.productsContainer.querySelectorAll('.book-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 50);
            });
        });
    }

    // Enhanced database integration with better error handling
    async fetchFromDatabase() {
        const queries = [
            // Modern fetch with error handling
            this.executeDatabaseQuery('products'),
            this.executeDatabaseQuery('categories'),
            this.executeDatabaseQuery('brands')
        ];

        try {
            const [productsResult, categoriesResult, brandsResult] = await Promise.allSettled(queries);
            
            if (productsResult.status === 'fulfilled' && productsResult.value.length > 0) {
                this.allProducts = productsResult.value;
                console.log(`✅ Loaded ${this.allProducts.length} products from database`);
            } else {
                throw new Error('No products found in database');
            }

            if (categoriesResult.status === 'fulfilled' && categoriesResult.value.length > 0) {
                this.categories = categoriesResult.value;
            }

            if (brandsResult.status === 'fulfilled' && brandsResult.value.length > 0) {
                this.brands = brandsResult.value;
            }

        } catch (error) {
            console.warn('Database fetch failed:', error);
            throw error;
        }
    }

    // Execute database query with proper error handling
    async executeDatabaseQuery(endpoint) {
        const url = `${this.apiConfig.baseUrl}${this.apiConfig.endpoints[endpoint] || `/${endpoint}`}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Request-ID': this.generateRequestId()
            },
            // Add timeout
            signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return this.extractProductsFromResponse(data);
    }

    // Generate unique request ID
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Enhanced view switching
    switchView(view) {
        this.currentView = view;
        
        // Update button states
        this.elements.viewButtons?.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });

        // Update container class
        if (this.elements.productsContainer) {
            this.elements.productsContainer.classList.remove('grid-view', 'list-view');
            this.elements.productsContainer.classList.add(`${view}-view`);
        }

        // Re-render products
        this.renderProducts();
    }

    // Enhanced search with advanced filtering
    performAdvancedSearch(query) {
        const searchTerms = query.toLowerCase().trim().split(/\s+/);
        
        this.filteredProducts = this.allProducts.filter(product => {
            const searchableText = [
                product.title,
                product.brand,
                product.category,
                product.color,
                product.size
            ].filter(Boolean).join(' ').toLowerCase();

            return searchTerms.every(term => searchableText.includes(term));
        });

        this.currentPage = 1;
        this.calculatePagination();
        this.applySorting();
    }

    // Bulk operations
    async bulkAddToCart(productIds) {
        const products = productIds.map(id => this.allProducts.find(p => p.id === id)).filter(Boolean);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            products.forEach(product => {
                console.log(`Added to cart: ${product.title}`);
            });
            
            this.showNotification(`Added ${products.length} items to cart!`, 'success');
            return products;
        } catch (error) {
            this.showNotification('Failed to add items to cart', 'error');
            throw error;
        }
    }

    // Enhanced wishlist management
    getWishlistProducts() {
        return this.allProducts.filter(product => this.wishlist.has(product.id));
    }

    clearWishlist() {
        this.wishlist.clear();
        this.renderProducts();
        this.showNotification('Wishlist cleared', 'info');
    }

    // Export functionality
    exportProducts(format = 'json') {
        const data = {
            products: this.filteredProducts,
            filters: {
                category: this.elements.categoryFilter?.value || '',
                brand: this.elements.brandFilter?.value || '',
                priceRange: this.elements.priceFilter?.value || '',
                sort: this.elements.sortSelect?.value || 'featured'
            },
            timestamp: new Date().toISOString(),
            totalCount: this.filteredProducts.length
        };

        if (format === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            this.downloadFile(blob, 'stationery-products.json');
        } else if (format === 'csv') {
            const csv = this.convertToCSV(this.filteredProducts);
            const blob = new Blob([csv], { type: 'text/csv' });
            this.downloadFile(blob, 'stationery-products.csv');
        }
    }

    // Convert to CSV
    convertToCSV(products) {
        const headers = ['ID', 'Title', 'Brand', 'Category', 'Price', 'Rating', 'Color', 'Size'];
        const rows = products.map(product => [
            product.id,
            `"${product.title}"`,
            `"${product.brand}"`,
            `"${product.category}"`,
            product.price,
            product.rating,
            `"${product.color || ''}"`,
            `"${product.size || ''}"`
        ]);

        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    // Download file helper
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Enhanced error handling
    handleError(error, context = '') {
        console.error(`❌ Error ${context}:`, error);
        
        const errorMessage = error.message || 'An unexpected error occurred';
        this.showNotification(`Error: ${errorMessage}`, 'error');
        
        // Log to external service if available
        if (window.errorLogger) {
            window.errorLogger.log(error, context);
        }
    }

    // Performance monitoring
    measurePerformance(operation, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        console.log(`⏱️ ${operation} took ${(end - start).toFixed(2)}ms`);
        return result;
    }

    // Cleanup and destroy
    destroy() {
        // Remove event listeners
        Object.values(this.elements).forEach(element => {
            if (element && element.removeEventListener) {
                element.removeEventListener('change', this.applyFilters);
                element.removeEventListener('input', this.handleSearch);
            }
        });

        // Clear cache
        this.cache.clear();
        
        // Clear data
        this.allProducts = [];
        this.filteredProducts = [];
        this.wishlist.clear();
        
        console.log('🧹 Store instance destroyed');
    }

    // Initialize global instance
    static getInstance() {
        if (!window.stationeryStoreInstance) {
            window.stationeryStoreInstance = new StationeryStore();
        }
        return window.stationeryStoreInstance;
    }
}

// CSS for proper card alignment and animations
const additionalCSS = `
/* Enhanced grid layout for proper card alignment */
.books-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
    min-height: 400px;
}

/* Ensure all cards have equal height */
.book-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
}

.book-card.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.book-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Image container with consistent aspect ratio */
.book-img {
    width: 100%;
    height: 200px;
    overflow: hidden;
    position: relative;
    background: #f8f9fa;
}

.book-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Content area that grows to fill available space */
.book-content {
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

/* Title with consistent height */
.book-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
    height: 2.6em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

/* Author info */
.author {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 0.75rem 0;
    line-height: 1.4;
}

/* Rating section */
.rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.stars {
    display: flex;
    gap: 2px;
}

.stars i {
    color: #ffc107;
    font-size: 0.9rem;
}

.rating-value {
    font-size: 0.85rem;
    color: #666;
}

/* Price section */
.price {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.current-price {
    font-size: 1.2rem;
    font-weight: 700;
    color: #2c3e50;
}

.original-price {
    font-size: 0.9rem;
    color: #999;
    text-decoration: line-through;
}

/* Actions at bottom */
.book-actions {
    margin-top: auto;
    display: flex;
    gap: 0.5rem;
}

.btn-primary {
    flex: 1;
    padding: 0.75rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-primary:hover {
    background: #0056b3;
    transform: translateY(-1px);
}

.btn-secondary {
    width: 44px;
    height: 44px;
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-secondary:hover {
    border-color: #dc3545;
    color: #dc3545;
}

.btn-secondary.active {
    background: #dc3545;
    border-color: #dc3545;
    color: white;
}

/* Badge positioning */
.book-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: #dc3545;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    z-index: 2;
    text-transform: uppercase;
}

.book-badge.bestseller { background: #28a745; }
.book-badge.popular { background: #ffc107; color: #000; }
.book-badge.new { background: #17a2b8; }
.book-badge.sale { background: #fd7e14; }
.book-badge.premium { background: #6f42c1; }

/* No products state */
.no-products {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
}

.no-products-content {
    text-align: center;
    padding: 2rem;
}

.no-products-content i {
    font-size: 3rem;
    color: #ccc;
    margin-bottom: 1rem;
}

/* Loading state */
.books-container.loading {
    opacity: 0.7;
    pointer-events: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .books-container {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        padding: 0.5rem;
    }
    
    .book-card {
        border-radius: 8px;
    }
    
    .book-img {
        height: 180px;
    }
    
    .book-content {
        padding: 0.75rem;
    }
}

@media (max-width: 480px) {
    .books-container {
        grid-template-columns: 1fr;
    }
    
    .book-actions {
        flex-direction: column;
    }
    
    .btn-secondary {
        width: 100%;
        height: 44px;
    }
}

/* List view styles */
.books-container.list-view {
    grid-template-columns: 1fr;
}

.books-container.list-view .book-card {
    flex-direction: row;
    height: auto;
}

.books-container.list-view .book-img {
    width: 150px;
    height: 150px;
    flex-shrink: 0;
}

.books-container.list-view .book-content {
    flex: 1;
}

/* Animation keyframes */
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

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Notification styles */
.notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
}

.notification {
    background: #2196F3;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification.success { background: #4CAF50; }
.notification.error { background: #f44336; }
.notification.info { background: #2196F3; }
`;

// Inject CSS
if (!document.getElementById('stationery-store-css')) {
    const style = document.createElement('style');
    style.id = 'stationery-store-css';
    style.textContent = additionalCSS;
    document.head.appendChild(style);
}

// Initialize the store
const stationeryStore = StationeryStore.getInstance();

// Export for global access
window.stationeryStore = stationeryStore;

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
        body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
    }

    // Function to close mobile menu
    function closeMobileMenu() {
        mobileMenuContainer.classList.remove('active');
        body.style.overflow = ''; // Restore body scroll
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

    // Handle window resize - close menu if window becomes large
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) { // Adjust breakpoint as needed
            closeMobileMenu();
        }
    });

    // Handle escape key to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuContainer.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

// Additional functionality for view toggle buttons (grid/list view)
document.addEventListener('DOMContentLoaded', function() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsContainer = document.getElementById('productsContainer');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the view type
            const viewType = this.getAttribute('data-view');
            
            // Update container class
            if (viewType === 'list') {
                productsContainer.classList.add('list-view');
            } else {
                productsContainer.classList.remove('list-view');
            }
        });
    });
});

// Filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterSelects = document.querySelectorAll('.filter-group select');
    const resultsCount = document.getElementById('results-count');
    const totalResults = document.getElementById('total-results');

    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            // This is a placeholder for filter functionality
            // You would implement actual filtering logic here
            console.log(`Filter changed: ${this.id} = ${this.value}`);
            
            // Example: Update results count (you'd replace this with actual filtering)
            if (this.value) {
                resultsCount.textContent = '1-12';
                totalResults.textContent = '1,200';
            } else {
                resultsCount.textContent = '1-24';
                totalResults.textContent = '3,600';
            }
        });
    });
});

// Load more functionality
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.querySelector('.btn-load-more');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // This is a placeholder for load more functionality
            // You would implement actual product loading here
            console.log('Load more products clicked');
            
            // Example: Show loading state
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                // Here you would append new products to the container
            }, 1000);
        });
    }
});

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar .fa-magnifying-glass');
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            console.log(`Searching for: ${searchTerm}`);
            // Implement actual search functionality here
        }
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// Add to cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    const wishlistButtons = document.querySelectorAll('.btn-secondary');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product information
            const productCard = this.closest('.book-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            console.log(`Added to cart: ${productName} - ${productPrice}`);
            
            // Show feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 1500);
        });
    });
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const heart = this.querySelector('.fa-heart');
            const isWishlisted = heart.classList.contains('fa-solid');
            
            if (isWishlisted) {
                heart.classList.remove('fa-solid');
                heart.classList.add('fa-regular');
                this.style.color = '';
            } else {
                heart.classList.remove('fa-regular');
                heart.classList.add('fa-solid');
                this.style.color = '#e74c3c';
            }
        });
    });
});