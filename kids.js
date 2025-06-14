// Kids Books Store - Optimized for Dynamic Data Loading

class KidsBooksStore {
    constructor() {
        this.kidsBooks = [];
        this.filteredBooks = [];
        this.currentPage = 1;
        this.booksPerPage = 12;
        this.currentView = 'grid';
        this.isLoading = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadData();
    }

    // Initialize DOM elements
    initializeElements() {
        this.elements = {
            booksContainer: document.getElementById('booksContainer'),
            resultsCount: document.getElementById('results-count'),
            totalResults: document.getElementById('total-results'),
            paginationContainer: document.querySelector('.pagination'),
            searchInput: document.querySelector('.search-bar input'),
            loadingIndicator: this.createLoadingIndicator(),
            
            // Filter elements
            ageGroupFilter: document.getElementById('age-group'),
            categoryFilter: document.getElementById('category'),
            authorFilter: document.getElementById('author'),
            priceRangeFilter: document.getElementById('price-range'),
            sortFilter: document.getElementById('sort'),
            viewButtons: document.querySelectorAll('.view-btn'),
            
            // Mobile menu elements
            mobileMenuBtn: document.querySelector('.fa-bars'),
            mobileMenuContainer: document.querySelector('.mobile-menu-container'),
            closeMenuBtn: document.querySelector('.close-menu'),
            mobileMenuOverlay: document.querySelector('.mobile-menu-overlay')
        };
    }

    // Create loading indicator
    createLoadingIndicator() {
        const loader = document.createElement('div');
        loader.className = 'loading-indicator';
        loader.innerHTML = `
            <div class="spinner"></div>
            <p>Loading books...</p>
        `;
        loader.style.cssText = `
            display: none;
            text-align: center;
            padding: 40px;
            color: #666;
        `;
        
        // Add spinner styles
        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #ff6b6b;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        return loader;
    }

    // Load data dynamically
    async loadData() {
        try {
            this.showLoading(true);
            
            // Try to fetch from kids.json file first
            const data = await this.fetchBooksData();
            this.kidsBooks = data.kids || data || [];
            
            if (this.kidsBooks.length === 0) {
                throw new Error('No books data found');
            }
            
            this.filteredBooks = [...this.kidsBooks];
            this.populateFilterOptions();
            this.applyFilters();
            
        } catch (error) {
            console.error('Error loading books data:', error);
            this.handleDataLoadError();
        } finally {
            this.showLoading(false);
        }
    }

    // Fetch books data with multiple fallback strategies
    async fetchBooksData() {
        const dataSources = [
            'kids.json',
            './kids.json',
            '/kids.json',
            'data/kids.json'
        ];

        // Try each data source
        for (const source of dataSources) {
            try {
                const response = await fetch(source);
                if (response.ok) {
                    const data = await response.json();
                    console.log(`Successfully loaded data from: ${source}`);
                    return data;
                }
            } catch (error) {
                console.warn(`Failed to load from ${source}:`, error);
            }
        }

        // Fallback to hardcoded data if file loading fails
        console.warn('Using fallback data - could not load from JSON file');
        return this.getFallbackData();
    }

    // Fallback data (subset of original data)
    getFallbackData() {
        return {
            kids: [
                {
                    "title": "The Very Hungry Caterpillar",
                    "author": "Eric Carle",
                    "category": "picture book",
                    "rating": 4.8,
                    "price": 320,
                    "image": "images/hungry_caterpillar.jpg",
                    "releaseDate": "2023-03-15",
                    "popularity": 98,
                    "ageGroup": "0-5",
                    "pages": 22
                },
                {
                    "title": "Where the Wild Things Are",
                    "author": "Maurice Sendak",
                    "category": "adventure",
                    "rating": 4.7,
                    "price": 385,
                    "image": "images/wild_things.jpg",
                    "releaseDate": "2023-05-10",
                    "popularity": 94,
                    "ageGroup": "3-8",
                    "pages": 48
                },
                {
                    "title": "Goodnight Moon",
                    "author": "Margaret Wise Brown",
                    "category": "bedtime",
                    "rating": 4.9,
                    "price": 295,
                    "image": "images/goodnight_moon.jpg",
                    "releaseDate": "2023-02-20",
                    "popularity": 96,
                    "ageGroup": "0-4",
                    "pages": 32
                },
                {
                    "title": "The Cat in the Hat",
                    "author": "Dr. Seuss",
                    "category": "early reader",
                    "rating": 4.8,
                    "price": 340,
                    "image": "images/cat_in_hat.jpg",
                    "releaseDate": "2023-04-12",
                    "popularity": 97,
                    "ageGroup": "4-8",
                    "pages": 62
                }
            ]
        };
    }

    // Show/hide loading indicator
    showLoading(show) {
        this.isLoading = show;
        
        if (show) {
            this.elements.booksContainer.appendChild(this.elements.loadingIndicator);
            this.elements.loadingIndicator.style.display = 'block';
        } else {
            this.elements.loadingIndicator.style.display = 'none';
            if (this.elements.loadingIndicator.parentNode) {
                this.elements.loadingIndicator.parentNode.removeChild(this.elements.loadingIndicator);
            }
        }
    }

    // Handle data loading errors
    handleDataLoadError() {
        this.elements.booksContainer.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 40px; color: #e74c3c;">
                <h3>Oops! Something went wrong</h3>
                <p>We couldn't load the books data. Please try refreshing the page.</p>
                <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Refresh Page
                </button>
            </div>
        `;
    }

    // Dynamically populate filter options based on loaded data
    populateFilterOptions() {
        this.populateAuthors();
        this.populateCategories();
        this.populateAgeGroups();
    }

    populateAuthors() {
        const authors = [...new Set(this.kidsBooks.map(book => book.author))].sort();
        const authorFilter = this.elements.authorFilter;
        
        // Clear existing options except the first one
        while (authorFilter.children.length > 1) {
            authorFilter.removeChild(authorFilter.lastChild);
        }
        
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author.toLowerCase();
            option.textContent = author;
            authorFilter.appendChild(option);
        });
    }

    populateCategories() {
        const categories = [...new Set(this.kidsBooks.map(book => book.category))].sort();
        const categoryFilter = this.elements.categoryFilter;
        
        // Clear existing options except the first one
        while (categoryFilter.children.length > 1) {
            categoryFilter.removeChild(categoryFilter.lastChild);
        }
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.toLowerCase();
            option.textContent = this.capitalizeWords(category);
            categoryFilter.appendChild(option);
        });
    }

    populateAgeGroups() {
        const ageGroups = [...new Set(this.kidsBooks.map(book => book.ageGroup))].sort();
        const ageGroupFilter = this.elements.ageGroupFilter;
        
        // Clear existing options except the first one
        while (ageGroupFilter.children.length > 1) {
            ageGroupFilter.removeChild(ageGroupFilter.lastChild);
        }
        
        ageGroups.forEach(ageGroup => {
            const option = document.createElement('option');
            option.value = ageGroup;
            option.textContent = `${ageGroup} Years`;
            ageGroupFilter.appendChild(option);
        });
    }

    // Utility function to capitalize words
    capitalizeWords(str) {
        return str.replace(/\b\w/g, l => l.toUpperCase());
    }

    // Utility functions
    parseAgeGroup(ageGroup) {
        if (!ageGroup) return { min: 0, max: 20 };
        
        const parts = ageGroup.split('-');
        if (parts.length === 2) {
            return {
                min: parseInt(parts[0]),
                max: parseInt(parts[1])
            };
        }
        return { min: 0, max: 20 };
    }

    matchesAgeGroup(bookAgeGroup, filterAgeGroup) {
        if (!filterAgeGroup) return true;
        
        const bookAge = this.parseAgeGroup(bookAgeGroup);
        const filterAge = this.parseAgeGroup(filterAgeGroup);
        
        return bookAge.min <= filterAge.max && bookAge.max >= filterAge.min;
    }

    getBookBadge(book, index) {
        if (book.popularity >= 95) return 'Bestseller';
        if (book.popularity >= 90) return 'Popular';
        if (new Date(book.releaseDate) > new Date('2024-01-01')) return 'New';
        if (index % 7 === 0) return 'Sale';
        if (index % 5 === 0) return 'Trending';
        return '';
    }

    generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fa-solid fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="fa-regular fa-star"></i>';
        }
        
        return stars;
    }

    formatPrice(price) {
        const originalPrice = Math.floor(price * 1.2);
        const hasDiscount = Math.random() > 0.7;
        
        if (hasDiscount) {
            return `₹${price} <span class="original-price">₹${originalPrice}</span>`;
        }
        return `₹${price}`;
    }

    // Filter and sort functions
    applyFilters() {
        if (this.isLoading) return;
        
        this.filteredBooks = this.kidsBooks.filter(book => {
            // Search filter
            const searchTerm = this.elements.searchInput.value.toLowerCase();
            const matchesSearch = !searchTerm || 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.category.toLowerCase().includes(searchTerm);

            // Age group filter
            const selectedAgeGroup = this.elements.ageGroupFilter.value;
            const matchesAge = !selectedAgeGroup || this.matchesAgeGroup(book.ageGroup, selectedAgeGroup);

            // Category filter
            const selectedCategory = this.elements.categoryFilter.value;
            const matchesCategory = !selectedCategory || 
                book.category.toLowerCase().includes(selectedCategory.toLowerCase());

            // Author filter
            const selectedAuthor = this.elements.authorFilter.value;
            const matchesAuthor = !selectedAuthor || 
                book.author.toLowerCase().includes(selectedAuthor.toLowerCase());

            // Price range filter
            const selectedPriceRange = this.elements.priceRangeFilter.value;
            let matchesPrice = true;
            if (selectedPriceRange) {
                const [min, max] = selectedPriceRange.split('-').map(p => p.replace('+', ''));
                const minPrice = parseInt(min) || 0;
                const maxPrice = max ? parseInt(max) : Infinity;
                matchesPrice = book.price >= minPrice && book.price <= maxPrice;
            }

            return matchesSearch && matchesAge && matchesCategory && matchesAuthor && matchesPrice;
        });

        // Apply sorting
        this.applySorting();
        
        this.currentPage = 1;
        this.renderBooks();
        this.renderPagination();
        this.updateResultsInfo();
    }

    applySorting() {
        const sortValue = this.elements.sortFilter.value;
        
        switch (sortValue) {
            case 'newest':
                this.filteredBooks.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
            case 'popular':
                this.filteredBooks.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'rating':
                this.filteredBooks.sort((a, b) => b.rating - a.rating);
                break;
            case 'price-low':
                this.filteredBooks.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredBooks.sort((a, b) => b.price - a.price);
                break;
            case 'title':
                this.filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'age':
                this.filteredBooks.sort((a, b) => {
                    const ageA = this.parseAgeGroup(a.ageGroup);
                    const ageB = this.parseAgeGroup(b.ageGroup);
                    return ageA.min - ageB.min;
                });
                break;
            default: // featured
                this.filteredBooks.sort((a, b) => b.popularity - a.popularity);
        }
    }

    // Render functions
    renderBooks() {
        if (this.isLoading) return;
        
        const startIndex = (this.currentPage - 1) * this.booksPerPage;
        const endIndex = startIndex + this.booksPerPage;
        const booksToShow = this.filteredBooks.slice(startIndex, endIndex);

        this.elements.booksContainer.innerHTML = booksToShow.map((book, index) => {
            const badge = this.getBookBadge(book, startIndex + index);
            const stars = this.generateStars(book.rating);
            const price = this.formatPrice(book.price);
            
            return `
                <div class="book-card ${this.currentView === 'list' ? 'list-view' : ''}">
                    ${badge ? `<div class="book-badge">${badge}</div>` : ''}
                    <div class="age-badge">${book.ageGroup} Years</div>
                    <div class="book-img" style="background-image: url('${book.image}')"></div>
                    <div class="book-content">
                        <h3>${book.title}</h3>
                        <p class="author">by ${book.author}</p>
                        <div class="rating">
                            ${stars}
                            <span>(${book.rating})</span>
                        </div>
                        <div class="price">${price}</div>
                        <div class="book-actions">
                            <button class="btn-primary" onclick="bookStore.addToCart('${book.title}')">Add to Cart</button>
                            <button class="btn-secondary" onclick="bookStore.toggleWishlist('${book.title}')">
                                <i class="fa-solid fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredBooks.length / this.booksPerPage);
        
        if (totalPages <= 1) {
            this.elements.paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="bookStore.changePage(${this.currentPage - 1})">Previous</button>
        `;
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            paginationHTML += `<button class="page-btn" onclick="bookStore.changePage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="page-dots">...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="bookStore.changePage(${i})">${i}</button>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="page-dots">...</span>`;
            }
            paginationHTML += `<button class="page-btn" onclick="bookStore.changePage(${totalPages})">${totalPages}</button>`;
        }
        
        // Next button
        paginationHTML += `
            <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="bookStore.changePage(${this.currentPage + 1})">Next</button>
        `;
        
        this.elements.paginationContainer.innerHTML = paginationHTML;
    }

    updateResultsInfo() {
        const startIndex = (this.currentPage - 1) * this.booksPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.booksPerPage, this.filteredBooks.length);
        
        this.elements.resultsCount.textContent = `${startIndex}-${endIndex}`;
        this.elements.totalResults.textContent = this.filteredBooks.length.toLocaleString();
    }

    // Event handlers
    changePage(page) {
        this.currentPage = page;
        this.renderBooks();
        this.renderPagination();
        this.updateResultsInfo();
        
        // Scroll to top of books section
        document.querySelector('.books-grid')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    toggleView(view) {
        this.currentView = view;
        
        // Update active view button
        this.elements.viewButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Update books container class
        this.elements.booksContainer.classList.toggle('list-view', view === 'list');
        
        this.renderBooks();
    }

    addToCart(bookTitle) {
        const book = this.kidsBooks.find(b => b.title === bookTitle);
        if (book) {
            // Here you could integrate with a real cart system
            alert(`"${book.title}" has been added to your cart!`);
            
            // Example of how you might handle this in a real app:
            // this.cartService.addItem(book);
            // this.updateCartUI();
        }
    }

    toggleWishlist(bookTitle) {
        const book = this.kidsBooks.find(b => b.title === bookTitle);
        if (book) {
            // Here you could integrate with a real wishlist system
            alert(`"${book.title}" has been added to your wishlist!`);
            
            // Example of how you might handle this in a real app:
            // this.wishlistService.toggleItem(book);
            // this.updateWishlistUI();
        }
    }

    filterByAgeGroup(ageRange) {
        this.elements.ageGroupFilter.value = ageRange;
        this.applyFilters();
        
        document.querySelector('.books-grid')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    filterByCategory(category) {
        const categoryMap = {
            'Picture Books': 'picture',
            'Adventure & Fantasy': 'adventure',
            'Educational': 'educational',
            'Bedtime Stories': 'bedtime',
            'Animals & Nature': 'animals',
            'Activity Books': 'activity'
        };
        
        const filterValue = categoryMap[category] || category.toLowerCase();
        this.elements.categoryFilter.value = filterValue;
        this.applyFilters();
        
        document.querySelector('.books-grid')?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    toggleMobileMenu() {
        this.elements.mobileMenuContainer?.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    closeMobileMenu() {
        this.elements.mobileMenuContainer?.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Bind all event listeners
    bindEvents() {
        // Search functionality with debounce
        let searchTimeout;
        this.elements.searchInput?.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => this.applyFilters(), 300);
        });
        
        // Filter event listeners
        this.elements.ageGroupFilter?.addEventListener('change', () => this.applyFilters());
        this.elements.categoryFilter?.addEventListener('change', () => this.applyFilters());
        this.elements.authorFilter?.addEventListener('change', () => this.applyFilters());
        this.elements.priceRangeFilter?.addEventListener('change', () => this.applyFilters());
        this.elements.sortFilter?.addEventListener('change', () => this.applyFilters());
        
        // View toggle buttons
        this.elements.viewButtons.forEach(btn => {
            btn.addEventListener('click', () => this.toggleView(btn.dataset.view));
        });
        
        // Mobile menu
        this.elements.mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());
        this.elements.closeMenuBtn?.addEventListener('click', () => this.closeMobileMenu());
        this.elements.mobileMenuOverlay?.addEventListener('click', () => this.closeMobileMenu());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
            
            if (e.key === 'ArrowLeft' && this.currentPage > 1) {
                this.changePage(this.currentPage - 1);
            } else if (e.key === 'ArrowRight') {
                const totalPages = Math.ceil(this.filteredBooks.length / this.booksPerPage);
                if (this.currentPage < totalPages) {
                    this.changePage(this.currentPage + 1);
                }
            }
        });

        // Age group and category cards (setup after data loads)
        setTimeout(() => this.setupCardClickHandlers(), 1000);
    }

    setupCardClickHandlers() {
        // Age group cards
        const ageGroupCards = document.querySelectorAll('.age-group-card');
        const ageRanges = ['0-2', '3-5', '6-8', '9-12'];
        
        ageGroupCards.forEach((card, index) => {
            if (ageRanges[index]) {
                card.addEventListener('click', () => this.filterByAgeGroup(ageRanges[index]));
                card.style.cursor = 'pointer';
            }
        });
        
        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            const categoryTitle = card.querySelector('h3')?.textContent;
            if (categoryTitle) {
                card.addEventListener('click', () => this.filterByCategory(categoryTitle));
                card.style.cursor = 'pointer';
            }
        });
    }

    // Method to refresh data (can be called externally)
    async refreshData() {
        await this.loadData();
    }

    // Method to update data source (for dynamic API endpoints)
    setDataSource(source) {
        this.dataSource = source;
        return this.loadData();
    }
}

// Initialize the store when DOM is ready
let bookStore;

document.addEventListener('DOMContentLoaded', function() {
    bookStore = new KidsBooksStore();
    
    // Make bookStore globally accessible for onclick handlers
    window.bookStore = bookStore;
    
    // Hide load more button if it exists
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Legacy function support for existing onclick handlers
function changePage(page) {
    bookStore?.changePage(page);
}

function addToCart(bookTitle) {
    bookStore?.addToCart(bookTitle);
}

function toggleWishlist(bookTitle) {
    bookStore?.toggleWishlist(bookTitle);
}