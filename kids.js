// Optimized Kids Books Store - Database Driven
class KidsBooksStore {
    constructor(config = {}) {
        this.config = {
            apiEndpoint: config.apiEndpoint || 'kids.json',
            fallbackEndpoint: config.fallbackEndpoint || null,
            booksPerPage: config.booksPerPage || 12,
            enableCache: config.enableCache !== false,
            cacheExpiry: config.cacheExpiry || 5 * 60 * 1000 // 5 minutes
        };
        
        this.allBooks = [];
        this.filteredBooks = [];
        this.currentPage = 1;
        this.isLoading = false;
        this.cache = new Map();
        
        this.initializeElements();
        this.bindEvents();
        this.loadBooks();
    }

    // Initialize DOM elements with error handling
    initializeElements() {
        this.elements = {
            booksContainer: this.getElement('booksContainer'),
            resultsCount: this.getElement('results-count'),
            totalResults: this.getElement('total-results'),
            paginationContainer: this.getElement('.pagination'),
            loadMoreBtn: this.getElement('.btn-load-more'),
            searchInput: this.getElement('.search-bar input'),
            sortFilter: this.getElement('#sort'),
            ageGroupFilter: this.getElement('#age-group'),
            categoryFilter: this.getElement('#category'),
            errorContainer: this.getElement('#error-container')
        };
    }

    getElement(selector) {
        return selector.startsWith('#') || selector.startsWith('.') 
            ? document.querySelector(selector) 
            : document.getElementById(selector);
    }

    // Enhanced book loading with proper error handling and caching
    async loadBooks(forceRefresh = false) {
        this.showLoading(true);
        
        try {
            // Check cache first
            if (!forceRefresh && this.config.enableCache && this.isCacheValid()) {
                const cachedData = this.cache.get('books');
                this.allBooks = cachedData.books;
                this.processLoadedBooks();
                return;
            }

            // Fetch from primary endpoint
            const books = await this.fetchBooks(this.config.apiEndpoint);
            
            // Cache the data
            if (this.config.enableCache) {
                this.cache.set('books', {
                    books,
                    timestamp: Date.now()
                });
            }
            
            this.allBooks = books;
            this.processLoadedBooks();
            
        } catch (error) {
            await this.handleLoadError(error);
        } finally {
            this.showLoading(false);
        }
    }

    // Fetch books from API with proper error handling
    async fetchBooks(endpoint) {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Handle different API response formats
        if (Array.isArray(data)) {
            return data;
        } else if (data.books && Array.isArray(data.books)) {
            return data.books;
        } else if (data.kids && Array.isArray(data.kids)) {
            return data.kids;
        } else if (data.data && Array.isArray(data.data)) {
            return data.data;
        }
        
        throw new Error('Invalid API response format');
    }

    // Handle loading errors with fallback options
    async handleLoadError(error) {
        console.error('Failed to load books:', error);
        
        // Try fallback endpoint if available
        if (this.config.fallbackEndpoint) {
            try {
                const books = await this.fetchBooks(this.config.fallbackEndpoint);
                this.allBooks = books;
                this.processLoadedBooks();
                this.showNotification('Loaded from backup source', 'warning');
                return;
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        }
        
        // Show error message
        this.showError('Failed to load books. Please try again later.', error.message);
        this.allBooks = [];
        this.processLoadedBooks();
    }

    // Check if cached data is still valid
    isCacheValid() {
        const cached = this.cache.get('books');
        if (!cached) return false;
        
        return (Date.now() - cached.timestamp) < this.config.cacheExpiry;
    }

    // Process loaded books (validation, filtering, rendering)
    processLoadedBooks() {
        // Validate and sanitize book data
        this.allBooks = this.validateBooksData(this.allBooks);
        
        this.filteredBooks = [...this.allBooks];
        this.populateFilterOptions();
        this.renderBooks();
        this.updatePagination();
        this.updateResultsInfo();
        
        // Trigger custom event for external listeners
        this.dispatchEvent('booksLoaded', { books: this.allBooks });
    }

    // Validate and sanitize book data
    validateBooksData(books) {
        return books.filter(book => {
            // Required fields validation
            if (!book.title || !book.author) {
                console.warn('Book missing required fields:', book);
                return false;
            }
            
            // Sanitize and set defaults
            book.id = book.id || this.generateBookId(book);
            book.rating = Math.max(0, Math.min(5, parseFloat(book.rating) || 0));
            book.price = Math.max(0, parseInt(book.price) || 0);
            book.category = book.category || 'Uncategorized';
            book.ageGroup = book.ageGroup || 'All Ages';
            book.image = book.image || 'images/default-book.jpg';
            book.popularity = Math.max(0, Math.min(100, parseInt(book.popularity) || 50));
            book.releaseDate = book.releaseDate || new Date().toISOString().split('T')[0];
            
            return true;
        });
    }

    // Generate unique book ID if missing
    generateBookId(book) {
        return btoa(`${book.title}-${book.author}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
    }

    // Populate filter options dynamically from loaded data
    populateFilterOptions() {
        if (this.allBooks.length === 0) return;

        // Age groups
        const ageGroups = [...new Set(this.allBooks.map(book => book.ageGroup))].filter(Boolean);
        if (this.elements.ageGroupFilter) {
            this.populateSelectOptions(this.elements.ageGroupFilter, ageGroups, 'All Ages');
        }

        // Categories
        const categories = [...new Set(this.allBooks.map(book => book.category))].filter(Boolean);
        if (this.elements.categoryFilter) {
            this.populateSelectOptions(this.elements.categoryFilter, categories, 'All Categories');
        }
    }

    populateSelectOptions(selectElement, options, defaultText) {
        const currentValue = selectElement.value;
        selectElement.innerHTML = `<option value="">${defaultText}</option>`;
        
        options.sort().forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
        
        // Restore previous selection if still valid
        if (currentValue && options.includes(currentValue)) {
            selectElement.value = currentValue;
        }
    }

    // Enhanced filtering with better performance
    applyFilters() {
        const filters = this.getActiveFilters();
        
        this.filteredBooks = this.allBooks.filter(book => {
            // Search filter
            if (filters.search && !this.matchesSearch(book, filters.search)) {
                return false;
            }
            
            // Age group filter
            if (filters.ageGroup && book.ageGroup !== filters.ageGroup) {
                return false;
            }
            
            // Category filter
            if (filters.category && book.category !== filters.category) {
                return false;
            }
            
            return true;
        });

        // Apply sorting
        this.sortBooks(this.filteredBooks, filters.sort);

        this.currentPage = 1;
        this.renderBooks();
        this.updatePagination();
        this.updateResultsInfo();
        
        // Trigger custom event
        this.dispatchEvent('booksFiltered', { 
            filteredBooks: this.filteredBooks, 
            filters 
        });
    }

    // Get active filters
    getActiveFilters() {
        return {
            search: this.elements.searchInput?.value.toLowerCase().trim() || '',
            ageGroup: this.elements.ageGroupFilter?.value || '',
            category: this.elements.categoryFilter?.value || '',
            sort: this.elements.sortFilter?.value || 'popularity'
        };
    }

    // Enhanced search matching
    matchesSearch(book, searchTerm) {
        const searchFields = [
            book.title,
            book.author,
            book.category,
            book.ageGroup
        ];
        
        return searchFields.some(field => 
            field && field.toLowerCase().includes(searchTerm)
        );
    }

    // Enhanced sorting with more options
    sortBooks(books, sortBy) {
        const sortFunctions = {
            'title': (a, b) => a.title.localeCompare(b.title),
            'author': (a, b) => a.author.localeCompare(b.author),
            'price-low': (a, b) => a.price - b.price,
            'price-high': (a, b) => b.price - a.price,
            'rating': (a, b) => b.rating - a.rating,
            'newest': (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate),
            'oldest': (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate),
            'popularity': (a, b) => b.popularity - a.popularity
        };

        const sortFunction = sortFunctions[sortBy] || sortFunctions.popularity;
        books.sort(sortFunction);
    }

    // Render books with error handling
    renderBooks() {
        if (!this.elements.booksContainer) return;

        const startIndex = (this.currentPage - 1) * this.config.booksPerPage;
        const endIndex = startIndex + this.config.booksPerPage;
        const booksToShow = this.filteredBooks.slice(startIndex, endIndex);

        if (booksToShow.length === 0) {
            this.elements.booksContainer.innerHTML = this.getEmptyStateHTML();
            return;
        }

        this.elements.booksContainer.innerHTML = booksToShow
            .map(book => this.createBookCard(book))
            .join('');
    }

    // Empty state HTML
    getEmptyStateHTML() {
        return `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 4em; margin-bottom: 20px;">📚</div>
                <h3>No books found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button class="btn-primary" onclick="bookStore.clearFilters()" style="margin-top: 20px;">
                    Clear Filters
                </button>
            </div>
        `;
    }

    // Create book card with improved error handling
    createBookCard(book) {
        try {
            const stars = this.generateStars(book.rating);
            const priceHTML = book.originalPrice 
                ? `₹${book.price} <span class="original-price">₹${book.originalPrice}</span>`
                : `₹${book.price}`;

            return `
                <div class="book-card" data-book-id="${book.id}">
                    ${book.badge ? `<div class="book-badge">${this.escapeHtml(book.badge)}</div>` : ''}
                    <div class="age-badge">${this.escapeHtml(book.ageGroup)} Years</div>
                    <div class="book-img" style="background-image: url('${book.image}')" 
                         onerror="this.style.backgroundImage='url(images/default-book.jpg)'"></div>
                    <div class="book-content">
                        <h3>${this.escapeHtml(book.title)}</h3>
                        <p class="author">by ${this.escapeHtml(book.author)}</p>
                        <div class="rating">
                            ${stars}
                            <span>(${book.rating})</span>
                        </div>
                        <div class="price">${priceHTML}</div>
                        <div class="book-actions">
                            <button class="btn-primary" onclick="bookStore.addToCart('${book.id}')">Add to Cart</button>
                            <button class="btn-secondary" onclick="bookStore.toggleWishlist('${book.id}')">
                                <i class="fa-solid fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering book card:', book, error);
            return '';
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Generate star ratings
    generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
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

    // Enhanced pagination
    updatePagination() {
        if (!this.elements.paginationContainer) return;

        const totalPages = Math.ceil(this.filteredBooks.length / this.config.booksPerPage);
        
        if (totalPages <= 1) {
            this.elements.paginationContainer.innerHTML = '';
            return;
        }

        const paginationHTML = this.generatePaginationHTML(totalPages);
        this.elements.paginationContainer.innerHTML = paginationHTML;
        
        if (this.elements.loadMoreBtn) {
            this.elements.loadMoreBtn.style.display = 'none';
        }
    }

    generatePaginationHTML(totalPages) {
        let html = '';
        
        // Previous button
        html += `
            <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="bookStore.goToPage(${this.currentPage - 1})" 
                    aria-label="Previous page">Previous</button>
        `;
        
        // Smart page number generation
        const { startPage, endPage, showStartEllipsis, showEndEllipsis } = 
            this.calculatePageRange(totalPages);
        
        if (showStartEllipsis) {
            html += `<button class="page-btn" onclick="bookStore.goToPage(1)">1</button>`;
            html += `<span class="page-dots">...</span>`;
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="bookStore.goToPage(${i})" 
                        aria-label="Page ${i}">${i}</button>
            `;
        }
        
        if (showEndEllipsis) {
            html += `<span class="page-dots">...</span>`;
            html += `<button class="page-btn" onclick="bookStore.goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        // Next button
        html += `
            <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="bookStore.goToPage(${this.currentPage + 1})" 
                    aria-label="Next page">Next</button>
        `;
        
        return html;
    }

    calculatePageRange(totalPages) {
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);
        
        let startPage = Math.max(1, this.currentPage - halfVisible);
        let endPage = Math.min(totalPages, this.currentPage + halfVisible);
        
        // Adjust if we're near the beginning or end
        if (endPage - startPage + 1 < maxVisiblePages) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
        }
        
        const showStartEllipsis = startPage > 1;
        const showEndEllipsis = endPage < totalPages;
        
        return { startPage, endPage, showStartEllipsis, showEndEllipsis };
    }

    // Update results info
    updateResultsInfo() {
        if (!this.elements.resultsCount || !this.elements.totalResults) return;

        const startIndex = (this.currentPage - 1) * this.config.booksPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.config.booksPerPage, this.filteredBooks.length);
        
        this.elements.resultsCount.textContent = this.filteredBooks.length > 0 
            ? `${startIndex}-${endIndex}` 
            : '0';
        this.elements.totalResults.textContent = this.filteredBooks.length.toLocaleString();
    }

    // Navigation
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredBooks.length / this.config.booksPerPage);
        if (page >= 1 && page <= totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.renderBooks();
            this.updatePagination();
            this.updateResultsInfo();
            
            this.elements.booksContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            this.dispatchEvent('pageChanged', { page, totalPages });
        }
    }

    // Show loading state
    showLoading(show) {
        this.isLoading = show;
        
        if (show && this.elements.booksContainer) {
            this.elements.booksContainer.innerHTML = `
                <div class="loading-message" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <div class="loading-spinner"></div>
                    <p>Loading amazing books for kids...</p>
                </div>
            `;
        }
    }

    // Show error message
    showError(message, details = '') {
        const errorHTML = `
            <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <div style="font-size: 3em; margin-bottom: 20px; color: #ff6b6b;">⚠️</div>
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                ${details ? `<details><summary>Technical details</summary><pre>${details}</pre></details>` : ''}
                <button class="btn-primary" onclick="bookStore.refresh()" style="margin-top: 20px;">
                    Try Again
                </button>
            </div>
        `;
        
        if (this.elements.booksContainer) {
            this.elements.booksContainer.innerHTML = errorHTML;
        }
    }

    // User actions
    async addToCart(bookId) {
        const book = this.allBooks.find(b => b.id === bookId);
        if (!book) return;

        try {
            // Call API to add to cart
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, quantity: 1 })
            });

            if (response.ok) {
                this.showNotification(`"${book.title}" added to cart!`, 'success');
                this.dispatchEvent('bookAddedToCart', { book });
            } else {
                throw new Error('Failed to add to cart');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            this.showNotification('Failed to add to cart. Please try again.', 'error');
        }
    }

    async toggleWishlist(bookId) {
        const book = this.allBooks.find(b => b.id === bookId);
        if (!book) return;

        try {
            // Call API to toggle wishlist
            const response = await fetch('/api/wishlist/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId })
            });

            if (response.ok) {
                const result = await response.json();
                const action = result.added ? 'added to' : 'removed from';
                this.showNotification(`"${book.title}" ${action} wishlist!`, 'info');
                this.dispatchEvent('bookWishlistToggled', { book, added: result.added });
            } else {
                throw new Error('Failed to update wishlist');
            }
        } catch (error) {
            console.error('Wishlist error:', error);
            this.showNotification('Failed to update wishlist. Please try again.', 'error');
        }
    }

    // Utility methods
    clearFilters() {
        if (this.elements.searchInput) this.elements.searchInput.value = '';
        if (this.elements.ageGroupFilter) this.elements.ageGroupFilter.value = '';
        if (this.elements.categoryFilter) this.elements.categoryFilter.value = '';
        if (this.elements.sortFilter) this.elements.sortFilter.value = 'popularity';
        
        this.applyFilters();
    }

    refresh() {
        this.cache.clear();
        this.loadBooks(true);
    }

    // Event system
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(`bookstore:${eventName}`, { detail: data });
        document.dispatchEvent(event);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 1000;
            background: ${colors[type] || colors.info}; color: white;
            padding: 15px 20px; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Bind events with proper cleanup
    bindEvents() {
        // Search with debounce
        if (this.elements.searchInput) {
            this.debounceSearch = this.debounce(() => this.applyFilters(), 300);
            this.elements.searchInput.addEventListener('input', this.debounceSearch);
        }

        // Filter changes
        const filterElements = [
            this.elements.ageGroupFilter, 
            this.elements.categoryFilter, 
            this.elements.sortFilter
        ];
        
        filterElements.forEach(element => {
            if (element) {
                element.addEventListener('change', () => this.applyFilters());
            }
        });

        // Keyboard navigation
        this.keydownHandler = (e) => {
            const totalPages = Math.ceil(this.filteredBooks.length / this.config.booksPerPage);
            
            if (e.key === 'ArrowLeft' && this.currentPage > 1) {
                e.preventDefault();
                this.goToPage(this.currentPage - 1);
            } else if (e.key === 'ArrowRight' && this.currentPage < totalPages) {
                e.preventDefault();
                this.goToPage(this.currentPage + 1);
            }
        };
        
        document.addEventListener('keydown', this.keydownHandler);
    }

    // Debounce utility
    debounce(func, wait) {
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

    // Cleanup method
    destroy() {
        // Remove event listeners
        if (this.debounceSearch) {
            this.elements.searchInput?.removeEventListener('input', this.debounceSearch);
        }
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }
        
        // Clear cache
        this.cache.clear();
        
        // Clear DOM references
        this.elements = {};
    }

    // Public API methods
    setFilter(filterType, value) {
        const filterMap = {
            ageGroup: this.elements.ageGroupFilter,
            category: this.elements.categoryFilter,
            search: this.elements.searchInput,
            sort: this.elements.sortFilter
        };
        
        const element = filterMap[filterType];
        if (element) {
            element.value = value;
            this.applyFilters();
        }
    }

    getBooks() {
        return [...this.allBooks];
    }

    getFilteredBooks() {
        return [...this.filteredBooks];
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getTotalPages() {
        return Math.ceil(this.filteredBooks.length / this.config.booksPerPage);
    }
}

// Initialize the store
let bookStore;

document.addEventListener('DOMContentLoaded', function() {
    // Configuration can be customized
    const config = {
        apiEndpoint: 'kids.json',
        fallbackEndpoint: null, // Add fallback URL if needed
        booksPerPage: 12,
        enableCache: true,
        cacheExpiry: 5 * 60 * 1000 // 5 minutes
    };
    
    bookStore = new KidsBooksStore(config);
    window.bookStore = bookStore;
    
    // Add CSS for loading spinner and animations
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #ff6b6b;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .empty-state h3 { margin-bottom: 10px; color: #666; }
        .empty-state p { color: #999; }
        .error-message h3 { margin-bottom: 10px; color: #666; }
        .error-message details { margin-top: 20px; text-align: left; }
        .error-message pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
    `;
    document.head.appendChild(style);
    
    console.log('Kids Books Store initialized - Database driven');
});

// Legacy support
function changePage(page) {
    if (bookStore) bookStore.goToPage(page);
}

function addToCart(bookId) {
    if (bookStore) bookStore.addToCart(bookId);
}

function toggleWishlist(bookId) {
    if (bookStore) bookStore.toggleWishlist(bookId);
}