// Sales Timer Functionality
let timerInterval;
let targetDate = new Date().getTime() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (32 * 60 * 1000) + (45 * 1000);

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

function resetTimer() {
    if (timerInterval) clearInterval(timerInterval);
    document.getElementById('days').innerHTML = '03';
    document.getElementById('hours').innerHTML = '14';
    document.getElementById('minutes').innerHTML = '32';
    document.getElementById('seconds').innerHTML = '45';
}

// Flash Sale Navigation
function setupFlashSaleNavigation() {
    const flashSaleCards = document.querySelectorAll('.flash-sale-section .category-card');
    
    flashSaleCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h3').textContent.trim();
            
            // Navigation mapping based on card titles
            const navigationMap = {
                'Fiction Books': 'books.html?category=fiction',
                'Toys & Games': 'toys-games.html',
                'Stationery': 'stationery-gifts.html',
                'Kids Books': 'kids.html'
            };
            
            const targetPage = navigationMap[cardTitle];
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Sample data for filtering and pagination
const saleItems = Array.from(document.querySelectorAll('.book-card')).map((card, index) => {
    const title = card.querySelector('h3').textContent.trim();
    const author = card.querySelector('.author').textContent.trim();
    const priceText = card.querySelector('.price').textContent.trim();
    const originalPriceText = card.querySelector('.original-price')?.textContent.trim() || '';
    const discountBadge = card.querySelector('.discount-badge').textContent.trim();
    const rating = card.querySelectorAll('.fa-solid.fa-star').length + (card.querySelectorAll('.fa-regular.fa-star').length * 0.5);
    
    // Extract prices
    const price = parseInt(priceText.replace(/[^\d]/g, ''));
    const originalPrice = originalPriceText ? parseInt(originalPriceText.replace(/[^\d]/g, '')) : price * 2;
    
    // Determine category
    let category = 'books';
    if (title.includes('Notebook') || title.includes('Planner')) category = 'stationery';
    if (title.includes('Puzzle') || title.includes('Educational')) category = 'toys';
    if (title.includes('Gift Card')) category = 'gift-cards';
    if (discountBadge.includes('Kids') || title.includes('Harry Potter')) category = 'kids';
    
    // Calculate discount percentage
    const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
    
    return {
        id: index,
        element: card.cloneNode(true),
        title,
        author,
        price,
        originalPrice,
        discountPercent,
        category,
        rating,
        isPopular: rating >= 4.7,
        isNew: index < 3 // First 3 items are considered new
    };
});

// Pagination variables
let currentPage = 1;
const itemsPerPage = 12;
let filteredItems = [...saleItems];

// Filter functionality
function applyFilters() {
    const categoryFilter = document.getElementById('sale-category').value;
    const discountFilter = document.getElementById('discount').value;
    const priceFilter = document.getElementById('price-range').value;
    const sortFilter = document.getElementById('sort').value;
    
    // Reset filtered items
    filteredItems = [...saleItems];
    
    // Apply category filter
    if (categoryFilter) {
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
            filteredItems.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filteredItems.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
    }
    
    // Reset to first page after filtering
    currentPage = 1;
    displayItems();
    updatePagination();
    updateResultsInfo();
}

// Display items based on current page and view mode
function displayItems() {
    const container = document.getElementById('saleContainer');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = filteredItems.slice(startIndex, endIndex);
    
    // Clear container
    container.innerHTML = '';
    
    // Check view mode
    const isListView = document.querySelector('.view-btn[data-view="list"]').classList.contains('active');
    
    if (isListView) {
        container.classList.add('list-view');
    } else {
        container.classList.remove('list-view');
    }
    
    // Add items to container
    itemsToShow.forEach(item => {
        const itemElement = item.element.cloneNode(true);
        
        // Add click handlers for buttons
        const addToCartBtn = itemElement.querySelector('.btn-primary');
        const wishlistBtn = itemElement.querySelector('.btn-secondary');
        
        addToCartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCart(item);
        });
        
        wishlistBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleWishlist(item);
        });
        
        container.appendChild(itemElement);
    });
}

// View toggle functionality
function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Re-display items with new view
            displayItems();
        });
    });
}

// Pagination functionality
function updatePagination() {
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    paginationContainer.innerHTML = '';
    
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
        document.querySelector('.books-grid').scrollIntoView({ behavior: 'smooth' });
    });
    return button;
}

// Update results info
function updateResultsInfo() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredItems.length);
    
    document.getElementById('results-count').textContent = `${startIndex}-${endIndex}`;
    document.getElementById('total-results').textContent = filteredItems.length.toLocaleString();
}

// Add to cart functionality
function addToCart(item) {
    // Add animation to the button
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        if (btn.textContent === 'Add to Cart') {
            btn.style.transform = 'scale(0.95)';
            btn.style.transition = 'transform 0.1s ease';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 100);
        }
    });
    
    // Show notification (you can customize this)
    showNotification(`${item.title} added to cart!`, 'success');
}

// Toggle wishlist functionality
function toggleWishlist(item) {
    const wishlistBtns = document.querySelectorAll('.btn-secondary i');
    wishlistBtns.forEach(icon => {
        if (icon.classList.contains('fa-heart')) {
            if (icon.classList.contains('fa-solid')) {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                showNotification(`${item.title} removed from wishlist`, 'info');
            } else {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = '#e74c3c';
                showNotification(`${item.title} added to wishlist!`, 'success');
            }
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <i class="fa-solid fa-times close-notification"></i>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
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
    
    // Close notification
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => notification.remove());
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Mobile menu functionality
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

// Newsletter subscription
function setupNewsletterSubscription() {
    const newsletterForms = document.querySelectorAll('input[type="email"]');
    const submitButtons = document.querySelectorAll('.card-btn, .btn-primary');
    
    newsletterForms.forEach((input, index) => {
        const submitBtn = submitButtons[index];
        if (submitBtn && (submitBtn.textContent.includes('Submit') || submitBtn.textContent.includes('Subscribe'))) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const email = input.value.trim();
                
                if (email && validateEmail(email)) {
                    showNotification('Successfully subscribed to newsletter!', 'success');
                    input.value = '';
                } else {
                    showNotification('Please enter a valid email address', 'error');
                }
            });
        }
    });
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize all functionality
function initializePage() {
    // Set up filter event listeners
    const filterSelects = document.querySelectorAll('#sale-category, #discount, #price-range, #sort');
    filterSelects.forEach(select => {
        select.addEventListener('change', applyFilters);
    });
    
    // Initialize components
    setupFlashSaleNavigation();
    setupViewToggle();
    setupMobileMenu();
    setupNewsletterSubscription();
    
    // Initial display
    displayItems();
    updatePagination();
    updateResultsInfo();
    
    // Initialize timer
    updateTimer();
    
    // Remove load more button since we're using pagination
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

// Add CSS animations
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
    
    .books-container.list-view {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .books-container.list-view .book-card {
        display: flex;
        flex-direction: row;
        max-width: 100%;
        height: auto;
    }
    
    .books-container.list-view .book-img {
        width: 150px;
        height: 200px;
        flex-shrink: 0;
    }
    
    .books-container.list-view .book-content {
        flex: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 40px;
        flex-wrap: wrap;
    }
    
    .pagination-btn {
        padding: 10px 15px;
        border: 1px solid #ddd;
        background: white;
        color: #333;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        min-width: 40px;
    }
    
    .pagination-btn:hover {
        background: #f8f9fa;
        border-color: #007bff;
    }
    
    .pagination-btn.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
    }
    
    .pagination-ellipsis {
        padding: 10px 5px;
        color: #666;
    }
    
    .mobile-menu-container.active {
        display: block;
    }
    
    .close-notification {
        cursor: pointer;
        margin-left: auto;
    }
    
    .close-notification:hover {
        opacity: 0.7;
    }
    
    @media (max-width: 768px) {
        .books-container.list-view .book-card {
            flex-direction: column;
        }
        
        .books-container.list-view .book-img {
            width: 100%;
            height: 250px;
        }
        
        .pagination {
            gap: 5px;
        }
        
        .pagination-btn {
            padding: 8px 12px;
            font-size: 12px;
            min-width: 35px;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// Initialize timer on page load
window.addEventListener('load', function() {
    updateTimer();
});