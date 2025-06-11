// Books data and functionality
class BookStore {
    constructor() {
        this.books = [];
        this.filteredBooks = [];
        this.currentPage = 1;
        this.booksPerPage = 12;
        this.currentView = 'grid';
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        this.init();
    }

   async init() {
    await this.loadBooks();
    this.setupEventListeners();
    this.renderBooks();
    this.updateResultsCount();
    this.renderPagination(); // ADD THIS LINE
}

    async loadBooks() {
        try {
            // Try to fetch from the JSON file first
            const response = await fetch('books.json');
            if (response.ok) {
                const data = await response.json();
                this.books = data.books;
            } else {
                // Fallback to embedded data if file not found
                this.books = this.getFallbackData();
            }
            this.filteredBooks = [...this.books];
        } catch (error) {
            console.log('Loading fallback data...');
            this.books = this.getFallbackData();
            this.filteredBooks = [...this.books];
        }
    }

    getFallbackData() {
        return [
            {
                title: "Visual Mathematics",
                author: "John Derbyshire",
                category: "science",
                rating: 4.9,
                price: 599,
                image: "images/mathematics.jpg",
                releaseDate: "2024-01-15",
                popularity: 95,
                badge: "New"
            },
            {
                title: "The Art of Fiction",
                author: "Jane Austen",
                category: "fiction",
                rating: 4.7,
                price: 450,
                image: "images/art_fiction.jpg",
                releaseDate: "2023-11-20",
                popularity: 88,
                badge: "Popular"
            },
            {
                title: "Modern Physics Explained",
                author: "Dr. Sarah Chen",
                category: "science",
                rating: 4.8,
                price: 750,
                image: "images/modern_physics.jpg",
                releaseDate: "2024-03-10",
                popularity: 92,
                badge: "Bestseller"
            },
            {
                title: "Digital Marketing Mastery",
                author: "Michael Rodriguez",
                category: "business",
                rating: 4.6,
                price: 520,
                image: "images/digital_marketing.jpg",
                releaseDate: "2023-12-05",
                popularity: 85
            },
            {
                title: "Ancient Civilizations",
                author: "Prof. Elizabeth Harper",
                category: "history",
                rating: 4.5,
                price: 680,
                image: "images/ancient_civilizations.jpg",
                releaseDate: "2024-02-18",
                popularity: 78
            },
            {
                title: "The Psychology of Success",
                author: "Dr. Robert Williams",
                category: "self-help",
                rating: 4.4,
                price: 390,
                image: "images/psychology_success.jpg",
                releaseDate: "2023-10-12",
                popularity: 82
            },
            {
                title: "Quantum Computing Revolution",
                author: "Dr. Alan Turing Jr.",
                category: "technology",
                rating: 4.9,
                price: 850,
                image: "images/quantum_computing.jpg",
                releaseDate: "2024-01-08",
                popularity: 96,
                badge: "Trending"
            },
            {
                title: "Financial Independence",
                author: "Warren Smith",
                category: "business",
                rating: 4.7,
                price: 560,
                image: "images/financial_independence.jpg",
                releaseDate: "2024-01-30",
                popularity: 89
            },
            {
                title: "Machine Learning Fundamentals",
                author: "Dr. Lisa Zhang",
                category: "technology",
                rating: 4.8,
                price: 720,
                image: "images/ml_fundamentals.jpg",
                releaseDate: "2024-02-22",
                popularity: 93
            },
            {
                title: "Mindfulness and Meditation",
                author: "Dr. Sarah Peaceful",
                category: "self-help",
                rating: 4.5,
                price: 350,
                image: "images/mindfulness.jpg",
                releaseDate: "2024-01-12",
                popularity: 79,
                badge: "Sale"
            },
            {
                title: "The Entrepreneur's Guide",
                author: "Steve Innovation",
                category: "business",
                rating: 4.7,
                price: 490,
                image: "images/entrepreneur_guide.jpg",
                releaseDate: "2024-03-05",
                popularity: 87
            },
            {
                title: "Data Science Handbook",
                author: "Dr. Big Data",
                category: "technology",
                rating: 4.9,
                price: 820,
                image: "images/data_science.jpg",
                releaseDate: "2024-03-12",
                popularity: 97,
                badge: "Bestseller"
            }
        ];
    }

    setupEventListeners() {
        // Mobile menu
        const menuToggle = document.querySelector('.fa-bars');
        const mobileMenu = document.querySelector('.mobile-menu-container');
        const closeMenu = document.querySelector('.close-menu');
        const menuOverlay = document.querySelector('.mobile-menu-overlay');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.add('active');
            });
        }

        if (closeMenu) {
            closeMenu.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        }

        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        }

        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filter controls
        const categoryFilter = document.getElementById('category');
        const authorFilter = document.getElementById('author');
        const priceFilter = document.getElementById('price-range');
        const sortFilter = document.getElementById('sort');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        if (authorFilter) {
            authorFilter.addEventListener('change', () => this.applyFilters());
        }
        if (priceFilter) {
            priceFilter.addEventListener('change', () => this.applyFilters());
        }
        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.applyFilters());
        }

        // View toggle
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                viewButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.renderBooks();
            });
        });

        // Load more button
        const loadMoreBtn = document.querySelector('.btn-load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.booksPerPage += 12;
                this.renderBooks();
            });
        }

        // Pagination
        this.setupPagination();

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryName = card.querySelector('h3').textContent.toLowerCase();
                this.filterByCategory(categoryName);
            });
        });
    }

    handleSearch(query) {
    if (!query.trim()) {
        this.filteredBooks = [...this.books];
    } else {
        const searchTerm = query.toLowerCase();
        this.filteredBooks = this.books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm)
        );
    }
    this.currentPage = 1; // RESET TO FIRST PAGE
    this.renderBooks();
    this.updateResultsCount();
    this.renderPagination(); // UPDATE PAGINATION
}

    filterByCategory(category) {
        const categoryFilter = document.getElementById('category');
        if (categoryFilter) {
            // Map display names to filter values
            const categoryMap = {
                'fiction': 'fiction',
                'science': 'science',
                'technology': 'technology',
                'history': 'history',
                'business': 'business',
                'health & wellness': 'health'
            };
            
            categoryFilter.value = categoryMap[category] || category;
            this.applyFilters();
        }
    }

    applyFilters() {
    let filtered = [...this.books];

    // Category filter
    const category = document.getElementById('category')?.value;
    if (category) {
        filtered = filtered.filter(book => book.category === category);
    }

    // Author filter
    const author = document.getElementById('author')?.value;
    if (author) {
        filtered = filtered.filter(book => 
            book.author.toLowerCase().includes(author.toLowerCase())
        );
    }

    // Price filter
    const priceRange = document.getElementById('price-range')?.value;
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(p => 
            p.includes('+') ? Infinity : parseInt(p)
        );
        filtered = filtered.filter(book => {
            if (max === Infinity) return book.price >= min;
            return book.price >= min && book.price <= max;
        });
    }

    // Sort
    const sortBy = document.getElementById('sort')?.value;
    if (sortBy) {
        filtered = this.sortBooks(filtered, sortBy);
    }

    this.filteredBooks = filtered;
    this.currentPage = 1; // RESET TO FIRST PAGE
    this.renderBooks();
    this.updateResultsCount();
    this.renderPagination(); // UPDATE PAGINATION
}


    sortBooks(books, sortBy) {
        const sorted = [...books];
        
        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            case 'popular':
                return sorted.sort((a, b) => b.popularity - a.popularity);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'title':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return sorted.sort((a, b) => b.popularity - a.popularity);
        }
    }

   renderBooks() {
    const container = document.getElementById('booksContainer');
    if (!container) return;

    // FIXED: Properly paginate the books
    const startIndex = (this.currentPage - 1) * this.booksPerPage;
    const endIndex = startIndex + this.booksPerPage;
    const booksToShow = this.filteredBooks.slice(startIndex, endIndex);

    container.innerHTML = '';
    container.className = `books-container ${this.currentView}-view`;

    booksToShow.forEach(book => {
        const bookCard = this.createBookCard(book);
        container.appendChild(bookCard);
    });

    // Update load more button visibility
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) {
        const totalPages = Math.ceil(this.filteredBooks.length / this.booksPerPage);
        loadMoreBtn.style.display = this.currentPage >= totalPages ? 'none' : 'block';
    }
}

    createBookCard(book) {
        const card = document.createElement('div');
        card.className = 'book-card';
        
        const isFavorite = this.favorites.includes(book.title);
        const heartClass = isFavorite ? 'fa-solid' : 'fa-regular';
        
        // Generate star rating
        const stars = this.generateStarRating(book.rating);
        
        // Generate badge if exists
        const badge = book.badge ? `<div class="book-badge">${book.badge}</div>` : '';
        
        // Calculate discount if any
        const originalPrice = book.originalPrice ? 
            `<span class="original-price">₹${book.originalPrice}</span>` : '';

        card.innerHTML = `
            ${badge}
            <div class="book-img" style="background-image: url('${book.image}')"></div>
            <div class="book-content">
                <h3>${book.title}</h3>
                <p class="author">by ${book.author}</p>
                <div class="rating">
                    ${stars}
                    <span>(${book.rating})</span>
                </div>
                <div class="price">₹${book.price} ${originalPrice}</div>
                <div class="book-actions">
                    <button class="btn-primary" onclick="bookStore.addToCart('${book.title}')">
                        Add to Cart
                    </button>
                    <button class="btn-secondary" onclick="bookStore.toggleFavorite('${book.title}')">
                        <i class="${heartClass} fa-heart"></i>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fa-solid fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        }

        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars += '<i class="fa-regular fa-star"></i>';
        }

        return stars;
    }

    addToCart(bookTitle) {
        const book = this.books.find(b => b.title === bookTitle);
        if (!book) return;

        const existingItem = this.cart.find(item => item.title === bookTitle);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...book, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.showNotification(`"${bookTitle}" added to cart!`);
        this.updateCartCount();
    }

    toggleFavorite(bookTitle) {
        const index = this.favorites.indexOf(bookTitle);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showNotification(`"${bookTitle}" removed from favorites!`);
        } else {
            this.favorites.push(bookTitle);
            this.showNotification(`"${bookTitle}" added to favorites!`);
        }

        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.renderBooks(); // Re-render to update heart icons
        this.updateFavoritesCount();
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateCartCount() {
        const cartCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        // Update cart icon if exists
        const cartIcon = document.querySelector('.fa-bag-shopping');
        if (cartIcon && cartCount > 0) {
            let badge = cartIcon.parentElement.querySelector('.cart-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.style.cssText = `
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #dc3545;
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                cartIcon.parentElement.style.position = 'relative';
                cartIcon.parentElement.appendChild(badge);
            }
            badge.textContent = cartCount;
        }
    }

    updateFavoritesCount() {
        const favoritesCount = this.favorites.length;
        // Update favorites icon if exists
        const heartIcon = document.querySelector('.social-icons .fa-heart');
        if (heartIcon && favoritesCount > 0) {
            let badge = heartIcon.parentElement.querySelector('.favorites-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'favorites-badge';
                badge.style.cssText = `
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #dc3545;
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                heartIcon.parentElement.style.position = 'relative';
                heartIcon.parentElement.appendChild(badge);
            }
            badge.textContent = favoritesCount;
        }
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('results-count');
        const totalResults = document.getElementById('total-results');
        
        if (resultsCount && totalResults) {
            const showing = Math.min(this.booksPerPage, this.filteredBooks.length);
            resultsCount.textContent = `1-${showing}`;
            totalResults.textContent = this.filteredBooks.length.toLocaleString();
        }
    }

   setupPagination() {
    // Clear any existing event listeners by re-generating pagination
    this.renderPagination();
}

// Add this new method to dynamically update your existing HTML structure:
renderPagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(this.filteredBooks.length / this.booksPerPage);
    
    // Hide pagination if only one page or no results
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    } else {
        paginationContainer.style.display = 'flex';
    }

    // Clear existing pagination
    paginationContainer.innerHTML = '';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = this.currentPage === 1;
    paginationContainer.appendChild(prevBtn);

    // Calculate which pages to show
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're near the beginning or end
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page if not in range
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'page-btn';
        firstBtn.textContent = '1';
        paginationContainer.appendChild(firstBtn);

        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.className = 'page-dots';
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = i === this.currentPage ? 'page-btn active' : 'page-btn';
        pageBtn.textContent = i;
        paginationContainer.appendChild(pageBtn);
    }

    // Last page if not in range
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.className = 'page-dots';
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }

        const lastBtn = document.createElement('button');
        lastBtn.className = 'page-btn';
        lastBtn.textContent = totalPages;
        paginationContainer.appendChild(lastBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = 'Next';
    nextBtn.disabled = this.currentPage === totalPages;
    paginationContainer.appendChild(nextBtn);

    // Add event listeners
    this.addPaginationEventListeners();
}

   addPaginationEventListeners() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(this.filteredBooks.length / this.booksPerPage);
    
    // Add click events to all buttons
    paginationContainer.addEventListener('click', (e) => {
        if (!e.target.classList.contains('page-btn') || e.target.disabled) return;

        const buttonText = e.target.textContent;
        
        if (buttonText === 'Previous' && this.currentPage > 1) {
            this.currentPage--;
        } else if (buttonText === 'Next' && this.currentPage < totalPages) {
            this.currentPage++;
        } else if (!isNaN(buttonText)) {
            this.currentPage = parseInt(buttonText);
        }

        // Update display
        this.renderBooks();
        this.updateResultsCount();
        this.renderPagination();
        
        // Optional: Scroll to top of results
        const booksContainer = document.getElementById('booksContainer');
        if (booksContainer) {
            booksContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

    // Newsletter subscription
    setupNewsletterSubscription() {
        const submitBtn = document.querySelector('.card-btn');
        const emailInput = document.querySelector('input[type="email"]');
        
        if (submitBtn && emailInput) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = emailInput.value.trim();
                
                if (this.validateEmail(email)) {
                    this.showNotification('Successfully subscribed to newsletter!');
                    emailInput.value = '';
                } else {
                    this.showNotification('Please enter a valid email address!');
                }
            });
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Initialize the book store when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bookStore = new BookStore();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .book-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .book-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .books-container.list-view .book-card {
            display: flex;
            flex-direction: row;
            max-width: none;
            margin-bottom: 20px;
        }
        
        .books-container.list-view .book-img {
            width: 120px;
            height: 160px;
            flex-shrink: 0;
        }
        
        .books-container.list-view .book-content {
            padding: 20px;
            flex: 1;
        }
        
        .notification {
            animation: slideIn 0.3s ease;
        }
        
        .mobile-menu-container.active {
            display: block;
        }
        
        .mobile-menu-container {
            display: none;
        }
        
        @media (max-width: 768px) {
            .books-container.list-view .book-card {
                flex-direction: column;
            }
            
            .books-container.list-view .book-img {
                width: 100%;
                height: 200px;
            }
        }
    `;
    document.head.appendChild(style);
});