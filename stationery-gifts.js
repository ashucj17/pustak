// Products data array with all product information
const productsData = [
    {
        id: 1,
        name: "Moleskine Classic Notebook",
        author: "Hard Cover, Large, Ruled",
        category: "notebooks",
        brand: "moleskine",
        price: 1299,
        originalPrice: 1599,
        rating: 4.8,
        badge: "Bestseller",
        icon: "fa-solid fa-book",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        isPopular: true,
        dateAdded: new Date('2024-01-15')
    },
    {
        id: 2,
        name: "Parker Jotter Premium Pen",
        author: "Stainless Steel, Blue Ink",
        category: "writing",
        brand: "parker",
        price: 899,
        originalPrice: null,
        rating: 4.6,
        badge: "New",
        icon: "fa-solid fa-pen-fancy",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        isPopular: false,
        dateAdded: new Date('2024-12-01')
    },
    {
        id: 3,
        name: "2025 Daily Planner",
        author: "Leather Bound, A5 Size",
        category: "planners",
        brand: "leuchtturm",
        price: 1499,
        originalPrice: null,
        rating: 4.9,
        badge: null,
        icon: "fa-solid fa-calendar-days",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        isPopular: false,
        dateAdded: new Date('2024-11-10')
    },
    {
        id: 4,
        name: "Executive Gift Set",
        author: "Pen, Notebook & Card Holder",
        category: "gifts",
        brand: "moleskine",
        price: 2499,
        originalPrice: 2999,
        rating: 4.7,
        badge: "Popular",
        icon: "fa-solid fa-gift",
        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        isPopular: true,
        dateAdded: new Date('2024-10-20')
    },
    {
        id: 5,
        name: "Watercolor Paint Set",
        author: "36 Colors with Brushes",
        category: "art",
        brand: "faber-castell",
        price: 1799,
        originalPrice: null,
        rating: 4.5,
        badge: null,
        icon: "fa-solid fa-palette",
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        isPopular: false,
        dateAdded: new Date('2024-09-05')
    },
    {
        id: 6,
        name: "Highlighter Set Premium",
        author: "12 Fluorescent Colors",
        category: "writing",
        brand: "pilot",
        price: 599,
        originalPrice: null,
        rating: 4.4,
        badge: null,
        icon: "fa-solid fa-marker",
        gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        isPopular: false,
        dateAdded: new Date('2024-08-15')
    },
    {
        id: 7,
        name: "Desktop Organizer",
        author: "Bamboo Wood, Multi-compartment",
        category: "office",
        brand: "rhodia",
        price: 899,
        originalPrice: 1299,
        rating: 4.8,
        badge: "Sale",
        icon: "fa-solid fa-folder-open",
        gradient: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
        isPopular: false,
        dateAdded: new Date('2024-07-20')
    },
    {
        id: 8,
        name: "Sticky Notes Collection",
        author: "Assorted Sizes & Colors",
        category: "office",
        brand: "pilot",
        price: 299,
        originalPrice: null,
        rating: 4.3,
        badge: null,
        icon: "fa-solid fa-sticky-note",
        gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        isPopular: false,
        dateAdded: new Date('2024-06-10')
    },
    {
        id: 9,
        name: "Craft Supplies Kit",
        author: "Scissors, Glue, Decorative Items",
        category: "art",
        brand: "faber-castell",
        price: 1199,
        originalPrice: null,
        rating: 4.2,
        badge: null,
        icon: "fa-solid fa-scissors",
        gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        isPopular: false,
        dateAdded: new Date('2024-05-25')
    },
    {
        id: 10,
        name: "Personalized Stamps",
        author: "Custom Design, Self-Inking",
        category: "office",
        brand: "rhodia",
        price: 799,
        originalPrice: null,
        rating: 4.9,
        badge: null,
        icon: "fa-solid fa-stamp",
        gradient: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)",
        isPopular: false,
        dateAdded: new Date('2024-04-15')
    },
    {
        id: 11,
        name: "Portfolio Case Leather",
        author: "A4 Size, Document Organizer",
        category: "bags",
        brand: "moleskine",
        price: 1899,
        originalPrice: null,
        rating: 4.6,
        badge: null,
        icon: "fa-solid fa-briefcase",
        gradient: "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
        isPopular: false,
        dateAdded: new Date('2024-03-20')
    },
    {
        id: 12,
        name: "Scientific Calculator",
        author: "Advanced Functions, Solar Powered",
        category: "tech",
        brand: "pilot",
        price: 1299,
        originalPrice: 1599,
        rating: 4.7,
        badge: "Trending",
        icon: "fa-solid fa-calculator",
        gradient: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
        isPopular: true,
        dateAdded: new Date('2024-02-10')
    }
];

// Additional products to demonstrate pagination
const additionalProducts = [
    {
        id: 13,
        name: "Fountain Pen Classic",
        author: "Gold Nib, Ink Converter",
        category: "writing",
        brand: "parker",
        price: 2299,
        originalPrice: null,
        rating: 4.8,
        badge: "Premium",
        icon: "fa-solid fa-pen",
        gradient: "linear-gradient(135deg, #ff7675 0%, #d63031 100%)",
        isPopular: true,
        dateAdded: new Date('2024-01-05')
    },
    {
        id: 14,
        name: "Sketch Pad Professional",
        author: "180gsm Paper, A3 Size",
        category: "art",
        brand: "faber-castell",
        price: 799,
        originalPrice: null,
        rating: 4.5,
        badge: null,
        icon: "fa-solid fa-image",
        gradient: "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
        isPopular: false,
        dateAdded: new Date('2023-12-15')
    },
    {
        id: 15,
        name: "Wireless Mouse Pad",
        author: "Charging Pad, Large Size",
        category: "tech",
        brand: "leuchtturm",
        price: 1999,
        originalPrice: 2299,
        rating: 4.6,
        badge: "Tech",
        icon: "fa-solid fa-computer-mouse",
        gradient: "linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)",
        isPopular: false,
        dateAdded: new Date('2023-11-20')
    }
];

// Combine all products
const allProducts = [...productsData, ...additionalProducts];

// Global variables
let filteredProducts = [...allProducts];
let currentPage = 1;
const productsPerPage = 12;
let currentView = 'grid';

// DOM elements
const productsContainer = document.getElementById('productsContainer');
const categoryFilter = document.getElementById('category');
const brandFilter = document.getElementById('brand');
const priceFilter = document.getElementById('price-range');
const sortSelect = document.getElementById('sort');
const resultsCount = document.getElementById('results-count');
const totalResults = document.getElementById('total-results');
const loadMoreBtn = document.querySelector('.btn-load-more');
const viewButtons = document.querySelectorAll('.view-btn');
const mobileMenuButton = document.querySelector('.fa-bars');
const mobileMenuContainer = document.querySelector('.mobile-menu-container');
const closeMenuButton = document.querySelector('.close-menu');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateResultsInfo();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Filter and sort event listeners
    categoryFilter.addEventListener('change', applyFilters);
    brandFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applySorting);
    
    // Load more button
    loadMoreBtn.addEventListener('click', loadMoreProducts);
    
    // View toggle buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', toggleView);
    });
    
    // Mobile menu
    mobileMenuButton.addEventListener('click', openMobileMenu);
    closeMenuButton.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    // Search functionality
    const searchInput = document.querySelector('input[type="search"]');
    searchInput.addEventListener('input', handleSearch);
    
    // Heart icon interactions
    document.addEventListener('click', handleHeartClick);
}

// Apply filters
function applyFilters() {
    const selectedCategory = categoryFilter.value;
    const selectedBrand = brandFilter.value;
    const selectedPriceRange = priceFilter.value;
    
    filteredProducts = allProducts.filter(product => {
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
    
    currentPage = 1;
    applySorting();
}

// Apply sorting
function applySorting() {
    const sortValue = sortSelect.value;
    
    switch (sortValue) {
        case 'newest':
            filteredProducts.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.isPopular - a.isPopular || b.rating - a.rating);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'title':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'featured':
        default:
            // Sort by badge priority, then rating
            filteredProducts.sort((a, b) => {
                const badgePriority = { 'Bestseller': 4, 'Popular': 3, 'New': 2, 'Sale': 1 };
                const aPriority = badgePriority[a.badge] || 0;
                const bPriority = badgePriority[b.badge] || 0;
                return bPriority - aPriority || b.rating - a.rating;
            });
            break;
    }
    
    renderProducts();
    updateResultsInfo();
}

// Handle search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    if (searchTerm === '') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.author.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    applySorting();
}

// Render products
function renderProducts() {
    const startIndex = 0;
    const endIndex = currentPage * productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    productsContainer.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    // Show/hide load more button
    if (endIndex >= filteredProducts.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = `book-card ${currentView === 'list' ? 'list-view' : ''}`;
    
    const badgeHtml = product.badge ? `<div class="book-badge">${product.badge}</div>` : '';
    const originalPriceHtml = product.originalPrice ? 
        `<span class="original-price">₹${product.originalPrice.toLocaleString()}</span>` : '';
    
    // Generate star rating
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        starsHtml += '<i class="fa-regular fa-star"></i>';
    }
    
    card.innerHTML = `
        ${badgeHtml}
        <div class="book-img" style="background: ${product.gradient}; display: flex; align-items: center; justify-content: center; color: ${product.gradient.includes('#a8edea') || product.gradient.includes('#ffecd2') || product.gradient.includes('#d299c2') ? '#333' : 'white'}; font-size: 2rem;">
            <i class="${product.icon}"></i>
        </div>
        <div class="book-content">
            <h3>${product.name}</h3>
            <p class="author">${product.author}</p>
            <div class="rating">
                ${starsHtml}
                <span>(${product.rating})</span>
            </div>
            <div class="price">₹${product.price.toLocaleString()} ${originalPriceHtml}</div>
            <div class="book-actions">
                <button class="btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="btn-secondary heart-btn" data-product-id="${product.id}">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Load more products
function loadMoreProducts() {
    currentPage++;
    renderProducts();
    updateResultsInfo();
}

// Toggle view (grid/list)
function toggleView(event) {
    const viewType = event.currentTarget.dataset.view;
    currentView = viewType;
    
    viewButtons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    productsContainer.className = viewType === 'list' ? 'books-container list-view' : 'books-container';
    
    renderProducts();
}

// Update results info
function updateResultsInfo() {
    const currentlyShowing = Math.min(currentPage * productsPerPage, filteredProducts.length);
    resultsCount.textContent = `1-${currentlyShowing}`;
    totalResults.textContent = filteredProducts.length.toLocaleString();
}

// Mobile menu functions
function openMobileMenu() {
    mobileMenuContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenuContainer.classList.remove('active');
    document.body.style.overflow = '';
}

// Handle heart icon clicks (wishlist)
function handleHeartClick(event) {
    if (event.target.closest('.heart-btn')) {
        const heartBtn = event.target.closest('.heart-btn');
        const heartIcon = heartBtn.querySelector('i');
        
        heartBtn.classList.toggle('active');
        
        if (heartBtn.classList.contains('active')) {
            heartIcon.style.color = '#e74c3c';
            showToast('Added to wishlist!');
        } else {
            heartIcon.style.color = '';
            showToast('Removed from wishlist!');
        }
    }
}

// Add to cart function
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        showToast(`${product.name} added to cart!`);
        // Here you would typically update cart state/localStorage
        console.log('Added to cart:', product);
    }
}

// Show toast notification
function showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2d3436;
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS for animations
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
    
    .heart-btn.active i {
        color: #e74c3c !important;
    }
    
    .books-container.list-view {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .books-container.list-view .book-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 20px;
        max-width: none;
    }
    
    .books-container.list-view .book-img {
        width: 120px;
        height: 120px;
        margin-right: 20px;
        flex-shrink: 0;
    }
    
    .books-container.list-view .book-content {
        flex: 1;
        text-align: left;
    }
    
    .books-container.list-view .book-actions {
        margin-left: auto;
        flex-direction: column;
        gap: 10px;
    }
    
    .mobile-menu-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        visibility: hidden;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .mobile-menu-container.active {
        visibility: visible;
        opacity: 1;
    }
    
    .mobile-menu {
        position: absolute;
        left: -300px;
        top: 0;
        width: 300px;
        height: 100%;
        background: white;
        transition: left 0.3s ease;
        z-index: 10000;
    }
    
    .mobile-menu-container.active .mobile-menu {
        left: 0;
    }
    
    .mobile-menu-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
    }
    
    .view-btn.active {
        background: #007bff;
        color: white;
    }
    
    .view-btn {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        padding: 8px 12px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .view-toggle {
        display: flex;
        gap: 5px;
    }
`;

document.head.appendChild(style);

// Additional utility functions

// Reset all filters
function resetFilters() {
    categoryFilter.value = '';
    brandFilter.value = '';
    priceFilter.value = '';
    sortSelect.value = 'featured';
    document.querySelector('input[type="search"]').value = '';
    
    filteredProducts = [...allProducts];
    currentPage = 1;
    applySorting();
}

// Get random products for recommendations
function getRandomProducts(count = 4) {
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Price range helper
function getPriceRange(price) {
    if (price < 200) return '0-199';
    if (price <= 499) return '200-499';
    if (price <= 999) return '500-999';
    if (price <= 1999) return '1000-1999';
    return '2000+';
}

// Format currency
function formatCurrency(amount) {
    return `₹${amount.toLocaleString()}`;
}

// Export functions for potential use in other scripts
window.StationeryApp = {
    addToCart,
    resetFilters,
    getRandomProducts,
    formatCurrency,
    getPriceRange
};