// toys-games.js - Complete functionality with working pagination

class ToysGamesApp {
    constructor() {
        this.allProducts = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.filters = {
            ageGroup: '',
            category: '',
            brand: '',
            priceRange: '',
            sort: 'featured'
        };
        
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.applyFilters();
        this.renderProducts();
        this.updateResultsInfo();
        this.renderPagination();
    }

    async loadProducts() {
        try {
            // Load from JSON file
            const response = await fetch('toys-games.json');
            const data = await response.json();
            this.allProducts = data['toys-games'] || [];
            this.filteredProducts = [...this.allProducts];
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to sample data if JSON file is not available
            this.allProducts = this.getSampleData();
            this.filteredProducts = [...this.allProducts];
        }
    }

    getSampleData() {
        // Sample data based on your JSON structure
        return [
            {
                title: "LEGO Creator 3-in-1 Deep Sea Creatures",
                manufacturer: "LEGO",
                category: "Building Sets",
                rating: 4.7,
                price: 1299,
                image: "images/lego-deep-sea.jpg",
                ageGroup: "7-12",
                badge: "Best Seller",
                popularity: 89,
                releaseDate: "2024-03-15"
            },
            {
                title: "Monopoly Classic Board Game",
                manufacturer: "Hasbro",
                category: "Board Games",
                rating: 4.5,
                price: 2499,
                image: "images/monopoly-classic.jpg",
                ageGroup: "8+",
                badge: "Classic",
                popularity: 95,
                releaseDate: "2023-01-10"
            },
            {
                title: "Hot Wheels Track Builder Unlimited",
                manufacturer: "Mattel",
                category: "Vehicles",
                rating: 4.6,
                price: 3999,
                image: "images/hotwheels-track.jpg",
                ageGroup: "4-10",
                badge: "New",
                popularity: 82,
                releaseDate: "2024-05-20"
            },
            {
                title: "Barbie Dreamhouse Adventures",
                manufacturer: "Mattel",
                category: "Dolls",
                rating: 4.8,
                price: 15999,
                image: "images/barbie-dreamhouse.jpg",
                ageGroup: "3-9",
                badge: "Premium",
                popularity: 91,
                releaseDate: "2024-02-14"
            },
            {
                title: "Fisher-Price Rock-a-Stack",
                manufacturer: "Fisher-Price",
                category: "Baby Toys",
                rating: 4.9,
                price: 799,
                image: "images/rock-a-stack.jpg",
                ageGroup: "6m-3y",
                badge: "Classic",
                popularity: 96,
                releaseDate: "2023-04-03"
            },
            {
                title: "Magnetic Tiles Building Set",
                manufacturer: "PicassoTiles",
                category: "Building Sets",
                rating: 4.8,
                price: 3999,
                image: "images/magnetic-tiles.jpg",
                ageGroup: "3+",
                badge: "Creative",
                popularity: 89,
                releaseDate: "2023-10-21"
            },
            // Add more sample products to test pagination
            {
                title: "Scrabble Classic Word Game",
                manufacturer: "Hasbro",
                category: "Board Games",
                rating: 4.4,
                price: 1899,
                image: "images/scrabble.jpg",
                ageGroup: "8+",
                badge: "Classic",
                popularity: 88,
                releaseDate: "2023-02-10"
            },
            {
                title: "Nerf Ultra One Motorized Blaster",
                manufacturer: "Nerf",
                category: "Action Toys",
                rating: 4.5,
                price: 4999,
                image: "images/nerf-ultra.jpg",
                ageGroup: "8+",
                badge: "New",
                popularity: 85,
                releaseDate: "2024-01-15"
            },
            {
                title: "Play-Doh Modeling Compound 10-Pack",
                manufacturer: "Play-Doh",
                category: "Arts & Crafts",
                rating: 4.6,
                price: 1299,
                image: "images/play-doh.jpg",
                ageGroup: "3+",
                badge: "Creative",
                popularity: 92,
                releaseDate: "2023-08-20"
            },
            {
                title: "Rubik's Cube 3x3",
                manufacturer: "Rubik's",
                category: "Puzzles",
                rating: 4.7,
                price: 899,
                image: "images/rubiks-cube.jpg",
                ageGroup: "8+",
                badge: "Classic",
                popularity: 90,
                releaseDate: "2023-05-10"
            },
            {
                title: "Remote Control Racing Car",
                manufacturer: "RC Pro",
                category: "Vehicles",
                rating: 4.3,
                price: 2999,
                image: "images/rc-car.jpg",
                ageGroup: "6+",
                badge: "Fast",
                popularity: 83,
                releaseDate: "2024-04-05"
            },
            {
                title: "Wooden Puzzle Set",
                manufacturer: "Melissa & Doug",
                category: "Puzzles",
                rating: 4.8,
                price: 1599,
                image: "images/wooden-puzzle.jpg",
                ageGroup: "3-6",
                badge: "Educational",
                popularity: 87,
                releaseDate: "2023-09-15"
            },
            {
                title: "Action Figure Superhero Set",
                manufacturer: "Marvel",
                category: "Action Figures",
                rating: 4.5,
                price: 3499,
                image: "images/superhero-set.jpg",
                ageGroup: "4+",
                badge: "Popular",
                popularity: 91,
                releaseDate: "2024-06-10"
            },
            {
                title: "Electronic Learning Tablet",
                manufacturer: "VTech",
                category: "Educational",
                rating: 4.6,
                price: 5999,
                image: "images/learning-tablet.jpg",
                ageGroup: "3-9",
                badge: "STEM",
                popularity: 89,
                releaseDate: "2024-02-28"
            },
            {
                title: "Dollhouse Furniture Set",
                manufacturer: "KidKraft",
                category: "Dolls",
                rating: 4.7,
                price: 2799,
                image: "images/dollhouse-furniture.jpg",
                ageGroup: "3-8",
                badge: "Detailed",
                popularity: 86,
                releaseDate: "2023-11-20"
            }
        ];
    }

    setupEventListeners() {
        // Mobile menu functionality
        const mobileMenuBtn = document.querySelector('.fa-bars');
        const closeMenuBtn = document.querySelector('.close-menu');
        const mobileMenuContainer = document.querySelector('.mobile-menu-container');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuContainer.classList.add('active');
            });
        }

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                mobileMenuContainer.classList.remove('active');
            });
        }

        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', () => {
                mobileMenuContainer.classList.remove('active');
            });
        }

        // Age group cards
        document.querySelectorAll('.age-group-card').forEach(card => {
            card.addEventListener('click', () => {
                const ageText = card.querySelector('h3').textContent;
                this.handleAgeGroupClick(ageText);
            });
        });

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryText = card.querySelector('h3').textContent;
                this.handleCategoryClick(categoryText);
            });
        });

        // Filter controls
        document.getElementById('age-group').addEventListener('change', (e) => {
            this.filters.ageGroup = e.target.value;
            this.applyFilters();
        });

        document.getElementById('category').addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.applyFilters();
        });

        document.getElementById('brand').addEventListener('change', (e) => {
            this.filters.brand = e.target.value;
            this.applyFilters();
        });

        document.getElementById('price-range').addEventListener('change', (e) => {
            this.filters.priceRange = e.target.value;
            this.applyFilters();
        });

        document.getElementById('sort').addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.applyFilters();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentView = btn.dataset.view;
                this.renderProducts();
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    handleAgeGroupClick(ageText) {
        let ageValue = '';
        switch (ageText) {
            case '0-2 Years':
                ageValue = '0-2';
                break;
            case '3-5 Years':
                ageValue = '3-5';
                break;
            case '6-8 Years':
                ageValue = '6-8';
                break;
            case '9-12 Years':
                ageValue = '9-12';
                break;
        }
        
        document.getElementById('age-group').value = ageValue;
        this.filters.ageGroup = ageValue;
        this.applyFilters();
        
        // Scroll to products section
        document.querySelector('.products-grid').scrollIntoView({ behavior: 'smooth' });
    }

    handleCategoryClick(categoryText) {
        let categoryValue = '';
        switch (categoryText) {
            case 'Building & Construction':
                categoryValue = 'building';
                break;
            case 'Board Games & Puzzles':
                categoryValue = 'board-games';
                break;
            case 'Arts & Crafts':
                categoryValue = 'arts-crafts';
                break;
            case 'Dolls & Stuffed Animals':
                categoryValue = 'dolls';
                break;
            case 'Vehicles & Remote Control':
                categoryValue = 'vehicles';
                break;
            case 'STEM & Educational':
                categoryValue = 'stem';
                break;
        }
        
        document.getElementById('category').value = categoryValue;
        this.filters.category = categoryValue;
        this.applyFilters();
        
        // Scroll to products section
        document.querySelector('.products-grid').scrollIntoView({ behavior: 'smooth' });
    }

    handleSearch(query) {
        if (query.length === 0) {
            this.filteredProducts = [...this.allProducts];
        } else {
            this.filteredProducts = this.allProducts.filter(product => 
                product.title.toLowerCase().includes(query.toLowerCase()) ||
                product.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        this.currentPage = 1;
        this.applyFilters();
    }

    applyFilters() {
        let filtered = [...this.allProducts];

        // Age group filter
        if (this.filters.ageGroup) {
            filtered = filtered.filter(product => {
                return this.matchesAgeGroup(product.ageGroup, this.filters.ageGroup);
            });
        }

        // Category filter
        if (this.filters.category) {
            filtered = filtered.filter(product => {
                return this.matchesCategory(product.category, this.filters.category);
            });
        }

        // Brand filter
        if (this.filters.brand) {
            filtered = filtered.filter(product => {
                return product.manufacturer.toLowerCase().includes(this.filters.brand.toLowerCase());
            });
        }

        // Price range filter
        if (this.filters.priceRange) {
            filtered = filtered.filter(product => {
                return this.matchesPriceRange(product.price, this.filters.priceRange);
            });
        }

        // Apply sorting
        filtered = this.sortProducts(filtered, this.filters.sort);

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
        this.updateResultsInfo();
        this.renderPagination();
    }

    matchesAgeGroup(productAge, filterAge) {
        // Convert product age to numeric ranges for comparison
        const ageRanges = {
            '0-2': [0, 2],
            '3-5': [3, 5],
            '6-8': [6, 8],
            '9-12': [9, 12],
            'teen': [13, 18]
        };

        if (!ageRanges[filterAge]) return true;

        // Simple matching for now - you can make this more sophisticated
        if (productAge.includes(filterAge)) return true;
        if (filterAge === '0-2' && (productAge.includes('6m') || productAge.includes('0-'))) return true;
        if (filterAge === '3-5' && productAge.includes('3-')) return true;
        if (filterAge === '6-8' && productAge.includes('7-')) return true;
        if (filterAge === '9-12' && productAge.includes('8+')) return true;
        if (filterAge === 'teen' && productAge.includes('8+')) return true;

        return false;
    }

    matchesCategory(productCategory, filterCategory) {
        const categoryMap = {
            'building': ['Building Sets', 'Building & Construction'],
            'board-games': ['Board Games', 'Dice Games', 'Card Games'],
            'arts-crafts': ['Arts & Crafts'],
            'dolls': ['Dolls', 'Baby Toys'],
            'vehicles': ['Vehicles', 'Action Toys'],
            'stem': ['Educational Toys', 'Puzzles', 'Educational'],
            'outdoor': ['Sports Toys'],
            'electronic': ['Electronic Toys', 'Electronic Games']
        };

        if (categoryMap[filterCategory]) {
            return categoryMap[filterCategory].some(cat => 
                productCategory.toLowerCase().includes(cat.toLowerCase())
            );
        }

        return true;
    }

    matchesPriceRange(price, range) {
        switch (range) {
            case '0-299':
                return price < 300;
            case '300-599':
                return price >= 300 && price <= 599;
            case '600-999':
                return price >= 600 && price <= 999;
            case '1000-1999':
                return price >= 1000 && price <= 1999;
            case '2000+':
                return price >= 2000;
            default:
                return true;
        }
    }

    sortProducts(products, sortBy) {
        const sorted = [...products];
        
        switch (sortBy) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            case 'popular':
                return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'title':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'age':
                return sorted.sort((a, b) => a.ageGroup.localeCompare(b.ageGroup));
            case 'featured':
            default:
                return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        }
    }

    renderProducts() {
        const container = document.getElementById('productsContainer');
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (this.currentView === 'grid') {
            container.className = 'products-container';
        } else {
            container.className = 'products-container list-view';
        }

        container.innerHTML = productsToShow.map(product => this.createProductCard(product)).join('');

        // Add event listeners to product cards
        this.addProductEventListeners();
    }

    createProductCard(product) {
        const badgeHtml = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';
        const ageGroupHtml = `<div class="age-badge">${this.formatAgeGroup(product.ageGroup)}</div>`;
        const starsHtml = this.createStarsHtml(product.rating);
        const originalPrice = product.price > 1000 ? Math.round(product.price * 1.2) : null;
        const originalPriceHtml = originalPrice ? `<span class="original-price">₹${originalPrice.toLocaleString()}</span>` : '';

        return `
            <div class="product-card" data-id="${product.title}">
                ${badgeHtml}
                ${ageGroupHtml}
                <div class="product-img" style="background-image: url('${product.image}')"></div>
                <div class="product-content">
                    <h3>${product.title}</h3>
                    <p class="brand">by ${product.manufacturer}</p>
                    <div class="rating">
                        ${starsHtml}
                        <span>(${product.rating})</span>
                    </div>
                    <div class="price">₹${product.price.toLocaleString()} ${originalPriceHtml}</div>
                    <div class="product-actions">
                        <button class="btn-primary add-to-cart">Add to Cart</button>
                        <button class="btn-secondary wishlist-btn"><i class="fa-solid fa-heart"></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    formatAgeGroup(ageGroup) {
        // Convert age group to display format
        if (ageGroup.includes('m')) return '0-2 Years';
        if (ageGroup.includes('3-9')) return '3-9 Years';
        if (ageGroup.includes('4-10')) return '4-10 Years';
        if (ageGroup.includes('7-12')) return '7-12 Years';
        if (ageGroup.includes('8+')) return '8+ Years';
        if (ageGroup.includes('6+')) return '6+ Years';
        if (ageGroup.includes('3+')) return '3+ Years';
        return ageGroup;
    }

    createStarsHtml(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fa-solid fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="fa-regular fa-star"></i>';
        }

        return starsHtml;
    }

    addProductEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = btn.closest('.product-card');
                const productTitle = productCard.querySelector('h3').textContent;
                this.addToCart(productTitle);
            });
        });

        // Wishlist buttons
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = btn.closest('.product-card');
                const productTitle = productCard.querySelector('h3').textContent;
                this.toggleWishlist(btn, productTitle);
            });
        });
    }

    addToCart(productTitle) {
        // Add visual feedback
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = `${productTitle} added to cart!`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);

        console.log(`Added to cart: ${productTitle}`);
    }

    toggleWishlist(btn, productTitle) {
        const icon = btn.querySelector('i');
        const isWishlisted = icon.classList.contains('fa-solid');
        
        if (isWishlisted) {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            btn.style.color = '';
            console.log(`Removed from wishlist: ${productTitle}`);
        } else {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            btn.style.color = '#e74c3c';
            console.log(`Added to wishlist: ${productTitle}`);
        }
    }

    // NEW PAGINATION METHODS
    renderPagination() {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="app.goToPage(${this.currentPage - 1})">
                Previous
            </button>
        `;

        // Page numbers
        const visiblePages = this.getVisiblePages(this.currentPage, totalPages);
        
        visiblePages.forEach(page => {
            if (page === '...') {
                paginationHTML += '<span class="page-dots">...</span>';
            } else {
                paginationHTML += `
                    <button class="page-btn ${page === this.currentPage ? 'active' : ''}" 
                            onclick="app.goToPage(${page})">
                        ${page}
                    </button>
                `;
            }
        });

        // Next button
        paginationHTML += `
            <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="app.goToPage(${this.currentPage + 1})">
                Next
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    }

    getVisiblePages(currentPage, totalPages) {
        const pages = [];
        const maxVisible = 7; // Maximum number of page buttons to show
        
        if (totalPages <= maxVisible) {
            // Show all pages if total is less than max
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push('...');
            }
            
            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                    pages.push(i);
                }
            }
            
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }
            
            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }
        
        return pages;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderProducts();
        this.updateResultsInfo();
        this.renderPagination();
        
        // Scroll to top of products section
        document.querySelector('.products-grid').scrollIntoView({ behavior: 'smooth' });
    }

    updateResultsInfo() {
        const resultsCount = document.getElementById('results-count');
        const totalResults = document.getElementById('total-results');
        
        if (resultsCount && totalResults) {
            const startIndex = (this.currentPage - 1) * this.productsPerPage + 1;
            const endIndex = Math.min(this.currentPage * this.productsPerPage, this.filteredProducts.length);
            
            resultsCount.textContent = `${startIndex}-${endIndex}`;
            totalResults.textContent = this.filteredProducts.length.toLocaleString();
        }
    }
}

// Initialize the app when the DOM is loaded
let app; // Global reference for pagination buttons
document.addEventListener('DOMContentLoaded', () => {
    app = new ToysGamesApp();
});

// Add some CSS animations via JavaScript
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
    
    .products-container.list-view .product-card {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        margin-bottom: 20px !important;
    }
    
    .products-container.list-view .product-img {
        width: 150px !important;
        height: 150px !important;
        flex-shrink: 0 !important;
        margin-right: 20px !important;
    }
    
    .products-container.list-view .product-content {
        flex: 1 !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
    }
    
    .mobile-menu-container.active {
        display: block !important;
    }
    
    .product-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    
    .btn-primary, .btn-secondary {
        transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .page-btn {
    padding: 12px 16px;
    border: 2px solid #ff6b6b;
    background: linear-gradient(135deg, #fff, #ffeaa7);
    color: #ff6b6b;
    border-radius: 12px;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    min-width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    text-decoration: none;
    box-shadow: 0 2px 8px rgba(255,107,107,0.2);
}

.page-btn:hover {
    background: linear-gradient(135deg, #ff6b6b, #ff8e53);
    color: white;
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 15px rgba(255,107,107,0.3);
    border-color: #ff8e53;
}

.page-btn.active {
    background: linear-gradient(135deg, #ff6b6b, #ff8e53);
    color: white;
    border-color: #ff6b6b;
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255,107,107,0.4);
}

.page-btn:disabled {
    background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
    color: #ccc;
    border-color: #ddd;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.page-btn:disabled:hover {
    background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
    color: #ccc;
    transform: none;
    box-shadow: none;
}

.page-dots {
    color: #666;
    font-weight: bold;
    font-size: 16px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
}
`;
document.head.appendChild(style);