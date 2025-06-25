// Enhanced Stationery Store JavaScript with Pagination and Optimized JSON Data Fetching
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
        this.cache = new Map(); // For caching API responses
        this.wishlist = new Set(); // Track wishlist items
        
        // DOM elements - will be initialized after DOM loads
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
            productsContainer: document.getElementById('productsContainer'),
            categoryFilter: document.getElementById('category'),
            brandFilter: document.getElementById('brand'),
            priceFilter: document.getElementById('price-range'),
            sortSelect: document.getElementById('sort'),
            resultsCount: document.getElementById('results-count'),
            totalResults: document.getElementById('total-results'),
            loadMoreBtn: document.querySelector('.btn-load-more'),
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
            
            // Insert after products container or at the end of main content
            const insertAfter = this.elements.productsContainer?.parentNode || document.querySelector('.main-content');
            if (insertAfter) {
                insertAfter.appendChild(this.elements.paginationContainer);
            }
        }
    }

    // Enhanced fetch with multiple fallback strategies
    async fetchProductData() {
        const possiblePaths = [
            './stationery.json',
            './stationery.json',
            '../stationery.json',
            '/stationery.json'
        ];

        // Check cache first
        const cacheKey = 'stationery-products';
        if (this.cache.has(cacheKey)) {
            this.allProducts = this.cache.get(cacheKey);
            console.log('📦 Loaded products from cache');
            return;
        }

        let lastError = null;

        for (const path of possiblePaths) {
            try {
                console.log(`🔍 Attempting to fetch from: ${path}`);
                const response = await fetch(path);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                // Handle multiple JSON structures
                let products = [];
                if (Array.isArray(data)) {
                    products = data;
                } else if (data.stationery && Array.isArray(data.stationery)) {
                    products = data.stationery;
                } else if (data.products && Array.isArray(data.products)) {
                    products = data.products;
                } else if (data.items && Array.isArray(data.items)) {
                    products = data.items;
                }
                
                if (products.length === 0) {
                    throw new Error('No products found in JSON structure');
                }
                
                this.allProducts = products;
                this.cache.set(cacheKey, products); // Cache the results
                console.log(`✅ Successfully loaded ${products.length} products from ${path}`);
                return;
                
            } catch (error) {
                console.warn(`⚠️ Failed to fetch from ${path}:`, error.message);
                lastError = error;
                continue;
            }
        }

        // If all paths failed, use fallback data
        console.warn('🔄 All fetch attempts failed, using fallback data');
        this.allProducts = this.getSampleData();
        
        if (lastError) {
            console.error('Last error encountered:', lastError);
        }
    }

    // Process and normalize product data with enhanced error handling
    processProductData() {
        if (!Array.isArray(this.allProducts)) {
            console.error('❌ Product data is not an array:', this.allProducts);
            this.allProducts = [];
            return;
        }

        // Normalize product data and add missing fields
        this.allProducts = this.allProducts.map((product, index) => {
            try {
                return {
                    id: product.id || index + 1,
                    name: product.title || product.name || `Product ${index + 1}`,
                    author: product.brand || 'Unknown Brand',
                    category: this.mapCategory(product.category),
                    brand: (product.brand || 'unknown').toLowerCase().replace(/\s+/g, '-'),
                    price: parseFloat(product.price) || 0,
                    originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
                    rating: parseFloat(product.rating) || 4.0,
                    badge: product.badge || null,
                    icon: this.getIconForCategory(product.category || 'office'),
                    gradient: this.getGradientForCategory(product.category || 'office'),
                    isPopular: (product.popularity && product.popularity > 90) || product.badge === 'Bestseller',
                    dateAdded: product.releaseDate ? new Date(product.releaseDate) : new Date(),
                    image: product.image || null,
                    color: product.color || 'Default',
                    size: product.size || null,
                    count: product.count || null,
                    
                    // Additional fields from your JSON
                    popularity: product.popularity || 0,
                    releaseDate: product.releaseDate || null,
                    inkType: product.inkType || null,
                    leadSize: product.leadSize || null,
                    nibSize: product.nibSize || null,
                    tipType: product.tipType || null,
                    year: product.year || null,
                    includes: product.includes || null
                };
            } catch (error) {
                console.warn(`⚠️ Error processing product at index ${index}:`, error);
                return null;
            }
        }).filter(Boolean); // Remove any null entries

        // Extract unique categories and brands with error handling
        try {
            this.categories = [...new Set(this.allProducts.map(p => p.category))].filter(Boolean).sort();
            this.brands = [...new Set(this.allProducts.map(p => p.brand))].filter(Boolean).sort();
        } catch (error) {
            console.error('❌ Error extracting categories/brands:', error);
            this.categories = [];
            this.brands = [];
        }

        // Initialize filtered products
        this.filteredProducts = [...this.allProducts];

        // Populate filter dropdowns
        this.populateFilterDropdowns();

        console.log(`📊 Processed ${this.allProducts.length} products, ${this.categories.length} categories, ${this.brands.length} brands`);
    }

    // Enhanced category mapping
    mapCategory(category) {
        if (!category) return 'office';
        
        const categoryMap = {
            'notebooks': 'notebooks',
            'pens': 'writing',
            'pencils': 'writing',
            'art supplies': 'art',
            'markers': 'writing',
            'highlighters': 'writing',
            'planners': 'planners',
            'office': 'office',
            'gifts': 'gifts',
            'writing': 'writing'
        };

        const normalized = category.toLowerCase().trim();
        return categoryMap[normalized] || 'office';
    }

    // Get icon for category
    getIconForCategory(category) {
        const iconMap = {
            'notebooks': 'fa-solid fa-book',
            'writing': 'fa-solid fa-pen',
            'art': 'fa-solid fa-palette',
            'planners': 'fa-solid fa-calendar-days',
            'office': 'fa-solid fa-folder-open',
            'gifts': 'fa-solid fa-gift',
            'tech': 'fa-solid fa-calculator'
        };

        return iconMap[category] || 'fa-solid fa-pen';
    }

    // Get gradient for category
    getGradientForCategory(category) {
        const gradientMap = {
            'notebooks': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'writing': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'art': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'planners': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'office': 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
            'gifts': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'tech': 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
        };

        return gradientMap[category] || 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)';
    }

    // Enhanced filter dropdown population
    populateFilterDropdowns() {
        // Populate category filter
        if (this.elements.categoryFilter) {
            this.elements.categoryFilter.innerHTML = '<option value="">All Categories</option>';
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = this.formatCategoryName(category);
                this.elements.categoryFilter.appendChild(option);
            });
        }

        // Populate brand filter
        if (this.elements.brandFilter) {
            this.elements.brandFilter.innerHTML = '<option value="">All Brands</option>';
            this.brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = this.formatBrandName(brand);
                this.elements.brandFilter.appendChild(option);
            });
        }
    }

    // Format category name for display
    formatCategoryName(category) {
        const nameMap = {
            'notebooks': 'Notebooks & Journals',
            'writing': 'Writing Instruments',
            'art': 'Art Supplies',
            'planners': 'Planners & Organizers',
            'office': 'Office Supplies',
            'gifts': 'Gift Sets',
            'tech': 'Technology'
        };

        return nameMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    // Format brand name for display
    formatBrandName(brand) {
        return brand.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
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
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                    data-page="${this.currentPage - 1}" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                <i class="fa-solid fa-chevron-left"></i>
                Previous
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);

        // First page + ellipsis
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn page-number" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }

        // Current range of pages
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn page-number ${i === this.currentPage ? 'active' : ''}" 
                        data-page="${i}">
                    ${i}
                </button>
            `;
        }

        // Last page + ellipsis
        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn page-number" data-page="${this.totalPages}">${this.totalPages}</button>`;
        }

        // Next button
        paginationHTML += `
            <button class="pagination-btn ${this.currentPage === this.totalPages ? 'disabled' : ''}" 
                    data-page="${this.currentPage + 1}"
                    ${this.currentPage === this.totalPages ? 'disabled' : ''}>
                Next
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        `;

        // Page info
        paginationHTML += `
            <div class="pagination-info">
                <span>Page ${this.currentPage} of ${this.totalPages}</span>
                <select class="page-size-selector" onchange="stationeryStore.changePageSize(this.value)">
                    <option value="12" ${this.productsPerPage === 12 ? 'selected' : ''}>12 per page</option>
                    <option value="24" ${this.productsPerPage === 24 ? 'selected' : ''}>24 per page</option>
                    <option value="48" ${this.productsPerPage === 48 ? 'selected' : ''}>48 per page</option>
                </select>
            </div>
        `;

        this.elements.paginationContainer.innerHTML = paginationHTML;

        // Add pagination event listeners
        this.elements.paginationContainer.querySelectorAll('.pagination-btn:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.currentTarget.dataset.page);
                if (page && page !== this.currentPage) {
                    this.goToPage(page);
                }
            });
        });
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

    // Change page size
    changePageSize(newSize) {
        this.productsPerPage = parseInt(newSize);
        this.currentPage = 1;
        this.calculatePagination();
        this.renderProducts();
        this.renderPagination();
        this.updateResultsInfo();
    }

    // Render category cards
    renderCategories() {
        if (!this.elements.categoriesGrid) return;

        const categoryData = this.getCategoryData();
        
        this.elements.categoriesGrid.innerHTML = categoryData.map(category => `
            <div class="category-card" data-category="${category.value}" onclick="stationeryStore.filterByCategory('${category.value}')">
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <h3>${category.name}</h3>
                <p>${category.description}</p>
                <span class="book-count">${category.count} products</span>
            </div>
        `).join('');
    }

    // Get category data with counts
    getCategoryData() {
        const categories = [
            {
                value: 'writing',
                name: 'Writing Instruments',
                description: 'Pens, pencils, markers, and calligraphy tools',
                icon: 'fa-solid fa-pencil'
            },
            {
                value: 'notebooks',
                name: 'Notebooks & Journals',
                description: 'Diaries, planners, sketchbooks, and journals',
                icon: 'fa-solid fa-book'
            },
            {
                value: 'office',
                name: 'Office Supplies',
                description: 'Organizers, desk accessories, and tools',
                icon: 'fa-solid fa-briefcase'
            },
            {
                value: 'gifts',
                name: 'Gift Sets',
                description: 'Curated collections and special packages',
                icon: 'fa-solid fa-gift'
            },
            {
                value: 'art',
                name: 'Art Supplies',
                description: 'Colors, brushes, canvases, and craft materials',
                icon: 'fa-solid fa-palette'
            },
            {
                value: 'planners',
                name: 'Planners & Organizers',
                description: 'Calendars, schedules, and planning tools',
                icon: 'fa-solid fa-calendar-days'
            }
        ];

        // Add product counts
        return categories.map(category => ({
            ...category,
            count: this.allProducts.filter(p => p.category === category.value).length
        }));
    }

    // Filter by category (called from category cards)
    filterByCategory(category) {
        if (this.elements.categoryFilter) {
            this.elements.categoryFilter.value = category;
            this.currentPage = 1;
            this.applyFilters();
        }
        
        // Scroll to products section
        const productsSection = document.querySelector('.main-content');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Filter and sort event listeners
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
        
        // Remove load more button functionality since we have pagination
        if (this.elements.loadMoreBtn) {
            this.elements.loadMoreBtn.style.display = 'none';
        }
        
        // View toggle buttons
        this.elements.viewButtons?.forEach(btn => {
            btn.addEventListener('click', (e) => this.toggleView(e));
        });
        
        // Search functionality with debouncing
        if (this.elements.searchInput) {
            let searchTimeout;
            this.elements.searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentPage = 1;
                    this.handleSearch(e);
                }, 300);
            });
        }
        
        // Mobile menu
        this.elements.mobileMenuButton?.addEventListener('click', () => this.openMobileMenu());
        this.elements.closeMenuButton?.addEventListener('click', () => this.closeMobileMenu());
        this.elements.mobileMenuOverlay?.addEventListener('click', () => this.closeMobileMenu());
        
        // Heart icon interactions
        document.addEventListener('click', (e) => this.handleHeartClick(e));

        // Keyboard navigation for pagination
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName.toLowerCase() === 'input') return;
            
            if (e.key === 'ArrowLeft' && this.currentPage > 1) {
                this.goToPage(this.currentPage - 1);
            } else if (e.key === 'ArrowRight' && this.currentPage < this.totalPages) {
                this.goToPage(this.currentPage + 1);
            }
        });
    }

    // Apply filters with pagination reset
    applyFilters() {
        const selectedCategory = this.elements.categoryFilter?.value || '';
        const selectedBrand = this.elements.brandFilter?.value || '';
        const selectedPriceRange = this.elements.priceFilter?.value || '';
        
        this.filteredProducts = this.allProducts.filter(product => {
            // Category filter
            if (selectedCategory && product.category !== selectedCategory) {
                return false;
            }
            
            // Brand filter
            if (selectedBrand && product.brand !== selectedBrand) {
                return false;
            }
            
            // Price filter
            if (selectedPriceRange) {
                const price = product.price;
                switch (selectedPriceRange) {
                    case '0-199':
                        return price < 200;
                    case '200-499':
                        return price >= 200 && price <= 499;
                    case '500-999':
                        return price >= 500 && price <= 999;
                    case '1000-1999':
                        return price >= 1000 && price <= 1999;
                    case '2000+':
                        return price >= 2000;
                    default:
                        return true;
                }
            }
            
            return true;
        });
        
        this.calculatePagination();
        this.applySorting();
    }

    // Apply sorting with pagination
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
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
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
        
        this.calculatePagination();
        this.renderProducts();
        this.renderPagination();
        this.updateResultsInfo();
    }

    // Enhanced search functionality
    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.filteredProducts = [...this.allProducts];
        } else {
            this.filteredProducts = this.allProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.author.toLowerCase().includes(searchTerm) ||
                (product.color && product.color.toLowerCase().includes(searchTerm)) ||
                (product.badge && product.badge.toLowerCase().includes(searchTerm)) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }
        
        this.calculatePagination();
        this.applySorting();
    }

    // Render products with pagination
    renderProducts() {
        if (!this.elements.productsContainer) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);
        
        this.elements.productsContainer.innerHTML = '';
        
        if (productsToShow.length === 0) {
            this.elements.productsContainer.innerHTML = `
                <div class="no-products">
                    <i class="fa-solid fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                    <button class="btn-primary" onclick="stationeryStore.resetFilters()">Reset Filters</button>
                </div>
            `;
            this.elements.paginationContainer.style.display = 'none';
            return;
        }
        
        // Add loading animation
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

    // Generate product details HTML
    generateProductDetails(product) {
        let details = [];
        
        if (product.color && product.color !== 'Default') {
            details.push(`<span class="product-detail">Color: ${product.color}</span>`);
        }
        if (product.size) {
            details.push(`<span class="product-detail">Size: ${product.size}</span>`);
        }
        if (product.inkType) {
            details.push(`<span class="product-detail">Ink: ${product.inkType}</span>`);
        }
        if (product.leadSize) {
            details.push(`<span class="product-detail">Lead: ${product.leadSize}</span>`);
        }
        if (product.nibSize) {
            details.push(`<span class="product-detail">Nib: ${product.nibSize}</span>`);
        }
        if (product.tipType) {
            details.push(`<span class="product-detail">Tip: ${product.tipType}</span>`);
        }
        if (product.count) {
            details.push(`<span class="product-detail">Count: ${product.count}</span>`);
        }

        return details.length > 0 ? 
            `<div class="product-details">${details.slice(0, 2).join('')}</div>` : '';
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

    // Enhanced product card creation
    // Enhanced product card creation
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = `book-card ${this.currentView === 'list' ? 'list-view' : ''}`;
        
        const badgeHtml = product.badge ? `<div class="book-badge ${product.badge.toLowerCase().replace(/\s+/g, '-')}">${product.badge}</div>` : '';
        const originalPriceHtml = product.originalPrice ? 
            `<span class="original-price">₹${product.originalPrice.toLocaleString()}</span>` : '';
        
        // Generate star rating
        const starsHtml = this.generateStarRating(product.rating);
        
        // Determine text color for gradient backgrounds
        const lightGradients = ['#a8edea', '#ffecd2', '#d299c2', '#fef9d7'];
        const isLightGradient = lightGradients.some(color => 
            product.gradient && product.gradient.includes(color)
        );
        const textColorClass = isLightGradient ? 'dark-text' : 'light-text';

        card.innerHTML = `
            <div class="book-cover" style="background: ${product.gradient}">
                <div class="book-icon ${textColorClass}">
                    <i class="${product.icon}"></i>
                </div>
                ${badgeHtml}
                <div class="book-actions">
                    <button class="action-btn heart-btn ${this.wishlist.has(product.id) ? 'active' : ''}" 
                            data-product-id="${product.id}" 
                            title="Add to Wishlist"
                            aria-label="Add to wishlist">
                        <i class="fa-${this.wishlist.has(product.id) ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                    <button class="action-btn cart-btn" 
                            onclick="stationeryStore.addToCart(${product.id})"
                            title="Add to Cart"
                            aria-label="Add to cart">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                    <button class="action-btn view-btn" 
                            onclick="stationeryStore.viewProduct(${product.id})"
                            title="Quick View"
                            aria-label="Quick view">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="book-info">
                <div class="book-category">${this.formatCategoryName(product.category)}</div>
                <h3 class="book-title">${product.name}</h3>
                <p class="book-author">${product.author}</p>
                ${this.generateProductDetails(product)}
                <div class="book-rating">
                    <div class="stars">
                        ${starsHtml}
                    </div>
                    <span class="rating-value">${product.rating}</span>
                </div>
                <div class="book-price">
                    <span class="current-price">₹${product.price.toLocaleString()}</span>
                    ${originalPriceHtml}
                    ${product.originalPrice ? 
                        `<span class="discount">${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>` 
                        : ''
                    }
                </div>
            </div>
        `;
        
        return card;
    }

    // Update results information
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

    // Toggle view between grid and list
    toggleView(event) {
        const clickedBtn = event.currentTarget;
        const newView = clickedBtn.dataset.view;
        
        if (newView === this.currentView) return;
        
        // Update button states
        this.elements.viewButtons.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
        
        this.currentView = newView;
        
        // Update products container class
        if (this.elements.productsContainer) {
            this.elements.productsContainer.className = `products-grid ${newView}-view`;
        }
        
        // Re-render products with new view
        this.renderProducts();
    }

    // Handle heart/wishlist clicks
    handleHeartClick(event) {
        if (!event.target.closest('.heart-btn')) return;
        
        event.preventDefault();
        event.stopPropagation();
        
        const heartBtn = event.target.closest('.heart-btn');
        const productId = parseInt(heartBtn.dataset.productId);
        
        if (this.wishlist.has(productId)) {
            this.wishlist.delete(productId);
            heartBtn.classList.remove('active');
            heartBtn.querySelector('i').className = 'fa-regular fa-heart';
        } else {
            this.wishlist.add(productId);
            heartBtn.classList.add('active');
            heartBtn.querySelector('i').className = 'fa-solid fa-heart';
            
            // Add a little animation
            heartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                heartBtn.style.transform = 'scale(1)';
            }, 150);
        }
        
        console.log(`Wishlist updated: ${this.wishlist.size} items`);
    }

    // Add to cart functionality
    addToCart(productId) {
        const product = this.allProducts.find(p => p.id === productId);
        if (!product) return;
        
        // Here you would typically integrate with your cart system
        console.log(`Added to cart: ${product.name}`);
        
        // Show a brief notification
        this.showNotification(`Added "${product.name}" to cart!`, 'success');
    }

    // View product details
    viewProduct(productId) {
        const product = this.allProducts.find(p => p.id === productId);
        if (!product) return;
        
        // Here you would typically open a product detail modal or navigate to product page
        console.log(`Viewing product: ${product.name}`);
        
        // For now, just show product info in console
        this.showProductModal(product);
    }

    // Show product modal (basic implementation)
    showProductModal(product) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('productModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'productModal';
            modal.className = 'product-modal';
            document.body.appendChild(modal);
        }

        const starsHtml = this.generateStarRating(product.rating);
        const detailsHtml = this.generateProductDetails(product);

        modal.innerHTML = `
            <div class="modal-overlay" onclick="stationeryStore.closeProductModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="stationeryStore.closeProductModal()">
                    <i class="fa-solid fa-times"></i>
                </button>
                <div class="modal-body">
                    <div class="product-image" style="background: ${product.gradient}">
                        <div class="product-icon">
                            <i class="${product.icon}"></i>
                        </div>
                    </div>
                    <div class="product-info">
                        <div class="product-category">${this.formatCategoryName(product.category)}</div>
                        <h2>${product.name}</h2>
                        <p class="product-brand">${product.author}</p>
                        ${detailsHtml}
                        <div class="product-rating">
                            <div class="stars">${starsHtml}</div>
                            <span class="rating-value">${product.rating}</span>
                        </div>
                        <div class="product-price">
                            <span class="current-price">₹${product.price.toLocaleString()}</span>
                            ${product.originalPrice ? 
                                `<span class="original-price">₹${product.originalPrice.toLocaleString()}</span>` : ''
                            }
                        </div>
                        <div class="modal-actions">
                            <button class="btn-primary" onclick="stationeryStore.addToCart(${product.id})">
                                <i class="fa-solid fa-cart-plus"></i>
                                Add to Cart
                            </button>
                            <button class="btn-secondary heart-btn ${this.wishlist.has(product.id) ? 'active' : ''}" 
                                    data-product-id="${product.id}">
                                <i class="fa-${this.wishlist.has(product.id) ? 'solid' : 'regular'} fa-heart"></i>
                                ${this.wishlist.has(product.id) ? 'Remove from' : 'Add to'} Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Close product modal
    closeProductModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification container if it doesn't exist
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fa-solid fa-times"></i>
            </button>
        `;

        container.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Reset all filters
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

    // Mobile menu functions
    openMobileMenu() {
        if (this.elements.mobileMenuContainer) {
            this.elements.mobileMenuContainer.classList.add('open');
        }
        if (this.elements.mobileMenuOverlay) {
            this.elements.mobileMenuOverlay.style.display = 'block';
        }
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        if (this.elements.mobileMenuContainer) {
            this.elements.mobileMenuContainer.classList.remove('open');
        }
        if (this.elements.mobileMenuOverlay) {
            this.elements.mobileMenuOverlay.style.display = 'none';
        }
        document.body.style.overflow = 'auto';
    }

    // Loading state management
    showLoadingState() {
        if (this.elements.productsContainer) {
            this.elements.productsContainer.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            `;
        }
        this.isLoading = true;
    }

    hideLoadingState() {
        this.isLoading = false;
    }

    // Error state management
    showErrorState(message) {
        if (this.elements.productsContainer) {
            this.elements.productsContainer.innerHTML = `
                <div class="error-state">
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    <button class="btn-primary" onclick="location.reload()">
                        <i class="fa-solid fa-refresh"></i>
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    // Fallback sample data for when JSON fails to load
    getSampleData() {
        return [
            {
                id: 1,
                title: "Premium Fountain Pen Set",
                brand: "Parker",
                category: "writing",
                price: 2499,
                originalPrice: 2999,
                rating: 4.8,
                badge: "Bestseller",
                color: "Black",
                inkType: "Blue",
                nibSize: "Medium",
                popularity: 95,
                releaseDate: "2024-01-15"
            },
            {
                id: 2,
                title: "Leather Journal Notebook",
                brand: "Moleskine",
                category: "notebooks",
                price: 1299,
                rating: 4.6,
                badge: "Popular",
                color: "Brown",
                size: "A5",
                popularity: 88,
                releaseDate: "2024-02-01"
            },
            {
                id: 3,
                title: "Watercolor Paint Set",
                brand: "Winsor & Newton",
                category: "art",
                price: 3499,
                originalPrice: 3999,
                rating: 4.9,
                badge: "New",
                count: "24 colors",
                includes: "Brushes included",
                popularity: 92,
                releaseDate: "2024-03-10"
            },
            {
                id: 4,
                title: "Executive Desk Organizer",
                brand: "Umbra",
                category: "office",
                price: 1899,
                rating: 4.4,
                color: "Walnut",
                size: "Large",
                popularity: 75,
                releaseDate: "2024-01-20"
            },
            {
                id: 5,
                title: "2024 Daily Planner",
                brand: "Passion Planner",
                category: "planners",
                price: 2199,
                rating: 4.7,
                badge: "Sale",
                color: "Navy Blue",
                size: "A4",
                year: "2024",
                popularity: 85,
                releaseDate: "2023-12-01"
            },
            {
                id: 6,
                title: "Calligraphy Gift Set",
                brand: "Sheaffer",
                category: "gifts",
                price: 4299,
                originalPrice: 4999,
                rating: 4.8,
                badge: "Bestseller",
                includes: "Ink bottles, nibs, paper",
                popularity: 90,
                releaseDate: "2024-02-14"
            }
        ];
    }

    // Utility method to get current filters state
    getCurrentFilters() {
        return {
            category: this.elements.categoryFilter?.value || '',
            brand: this.elements.brandFilter?.value || '',
            priceRange: this.elements.priceFilter?.value || '',
            sort: this.elements.sortSelect?.value || 'featured',
            search: this.elements.searchInput?.value || '',
            page: this.currentPage,
            view: this.currentView
        };
    }

    // Method to get statistics
    getStatistics() {
        return {
            totalProducts: this.allProducts.length,
            filteredProducts: this.filteredProducts.length,
            categories: this.categories.length,
            brands: this.brands.length,
            wishlistItems: this.wishlist.size,
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            productsPerPage: this.productsPerPage
        };
    }
}

// Initialize the store when the script loads
const stationeryStore = new StationeryStore();