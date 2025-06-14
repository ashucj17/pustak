// Kids Books Dataset - Combined from both documents
const kidsBooks = [
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
    },
    {
        "title": "Green Eggs and Ham",
        "author": "Dr. Seuss",
        "category": "early reader",
        "rating": 4.7,
        "price": 315,
        "image": "images/green_eggs_ham.jpg",
        "releaseDate": "2023-06-08",
        "popularity": 93,
        "ageGroup": "4-8",
        "pages": 62
    },
    {
        "title": "Brown Bear, Brown Bear, What Do You See?",
        "author": "Bill Martin Jr.",
        "category": "picture book",
        "rating": 4.6,
        "price": 280,
        "image": "images/brown_bear.jpg",
        "releaseDate": "2023-01-25",
        "popularity": 91,
        "ageGroup": "0-5",
        "pages": 32
    },
    {
        "title": "The Giving Tree",
        "author": "Shel Silverstein",
        "category": "philosophy",
        "rating": 4.8,
        "price": 425,
        "image": "images/giving_tree.jpg",
        "releaseDate": "2023-03-30",
        "popularity": 89,
        "ageGroup": "5-10",
        "pages": 64
    },
    {
        "title": "Chicka Chicka Boom Boom",
        "author": "Bill Martin Jr.",
        "category": "alphabet",
        "rating": 4.5,
        "price": 325,
        "image": "images/chicka_boom.jpg",
        "releaseDate": "2023-07-15",
        "popularity": 87,
        "ageGroup": "2-6",
        "pages": 40
    },
    {
        "title": "The Rainbow Fish",
        "author": "Marcus Pfister",
        "category": "friendship",
        "rating": 4.6,
        "price": 395,
        "image": "images/rainbow_fish.jpg",
        "releaseDate": "2023-08-20",
        "popularity": 85,
        "ageGroup": "3-7",
        "pages": 32
    },
    {
        "title": "Corduroy",
        "author": "Don Freeman",
        "category": "friendship",
        "rating": 4.7,
        "price": 350,
        "image": "images/corduroy.jpg",
        "releaseDate": "2023-09-10",
        "popularity": 88,
        "ageGroup": "3-8",
        "pages": 32
    },
    {
        "title": "If You Give a Mouse a Cookie",
        "author": "Laura Numeroff",
        "category": "humor",
        "rating": 4.5,
        "price": 330,
        "image": "images/mouse_cookie.jpg",
        "releaseDate": "2023-10-05",
        "popularity": 86,
        "ageGroup": "3-8",
        "pages": 32
    },
    {
        "title": "The Polar Express",
        "author": "Chris Van Allsburg",
        "category": "holiday",
        "rating": 4.8,
        "price": 450,
        "image": "images/polar_express.jpg",
        "releaseDate": "2023-11-15",
        "popularity": 92,
        "ageGroup": "4-10",
        "pages": 32
    },
    {
        "title": "Goldilocks and the Three Bears",
        "author": "Jan Brett",
        "category": "folk tale",
        "rating": 4.5,
        "price": 340,
        "image": "images/goldilocks.jpg",
        "releaseDate": "2023-07-03",
        "popularity": 82,
        "ageGroup": "3-7",
        "pages": 32
    },
    {
        "title": "The Gingerbread Man",
        "author": "Paul Galdone",
        "category": "folk tale",
        "rating": 4.4,
        "price": 295,
        "image": "images/gingerbread_man.jpg",
        "releaseDate": "2023-09-15",
        "popularity": 80,
        "ageGroup": "3-7",
        "pages": 40
    },
    {
        "title": "Cloudy with a Chance of Meatballs",
        "author": "Judi Barrett",
        "category": "fantasy",
        "rating": 4.6,
        "price": 385,
        "image": "images/cloudy_meatballs.jpg",
        "releaseDate": "2023-11-08",
        "popularity": 85,
        "ageGroup": "4-8",
        "pages": 32
    },
    {
        "title": "Sylvester and the Magic Pebble",
        "author": "William Steig",
        "category": "fantasy",
        "rating": 4.7,
        "price": 370,
        "image": "images/sylvester_pebble.jpg",
        "releaseDate": "2024-01-05",
        "popularity": 84,
        "ageGroup": "4-8",
        "pages": 32
    },
    {
        "title": "Strega Nona",
        "author": "Tomie dePaola",
        "category": "folk tale",
        "rating": 4.5,
        "price": 325,
        "image": "images/strega_nona.jpg",
        "releaseDate": "2024-02-28",
        "popularity": 81,
        "ageGroup": "4-8",
        "pages": 32
    },
    {
        "title": "The Z Was Zapped",
        "author": "Chris Van Allsburg",
        "category": "alphabet",
        "rating": 4.4,
        "price": 360,
        "image": "images/z_zapped.jpg",
        "releaseDate": "2024-04-15",
        "popularity": 78,
        "ageGroup": "5-9",
        "pages": 56
    },
    {
        "title": "Time Flies",
        "author": "Eric Rohmann",
        "category": "wordless",
        "rating": 4.3,
        "price": 395,
        "image": "images/time_flies.jpg",
        "releaseDate": "2024-06-20",
        "popularity": 77,
        "ageGroup": "4-8",
        "pages": 32
    },
    {
        "title": "A Dark, Dark Tale",
        "author": "Ruth Brown",
        "category": "mystery",
        "rating": 4.2,
        "price": 280,
        "image": "images/dark_tale.jpg",
        "releaseDate": "2024-08-10",
        "popularity": 75,
        "ageGroup": "3-7",
        "pages": 32
    },
    {
        "title": "The Important Thing About Margaret Wise Brown",
        "author": "Mac Barnett",
        "category": "biography",
        "rating": 4.6,
        "price": 415,
        "image": "images/margaret_brown.jpg",
        "releaseDate": "2024-10-28",
        "popularity": 83,
        "ageGroup": "6-10",
        "pages": 48
    },
    {
        "title": "National Geographic Kids: Sharks",
        "author": "Anne Schreiber",
        "category": "educational",
        "rating": 4.7,
        "price": 225,
        "image": "images/sharks_kids.jpg",
        "releaseDate": "2023-04-05",
        "popularity": 87,
        "ageGroup": "6-10",
        "pages": 48
    },
    {
        "title": "Dog Man: Unleashed",
        "author": "Dav Pilkey",
        "category": "graphic novel",
        "rating": 4.8,
        "price": 395,
        "image": "images/dog_man.jpg",
        "releaseDate": "2023-06-18",
        "popularity": 94,
        "ageGroup": "7-12",
        "pages": 224
    },
    {
        "title": "Captain Underpants: The First Epic Novel",
        "author": "Dav Pilkey",
        "category": "graphic novel",
        "rating": 4.7,
        "price": 350,
        "image": "images/captain_underpants.jpg",
        "releaseDate": "2023-08-25",
        "popularity": 92,
        "ageGroup": "7-12",
        "pages": 128
    },
    {
        "title": "The Bad Seed",
        "author": "Jory John",
        "category": "character building",
        "rating": 4.5,
        "price": 385,
        "image": "images/bad_seed.jpg",
        "releaseDate": "2023-10-12",
        "popularity": 86,
        "ageGroup": "3-8",
        "pages": 40
    },
    {
        "title": "The Good Egg",
        "author": "Jory John",
        "category": "character building",
        "rating": 4.4,
        "price": 375,
        "image": "images/good_egg.jpg",
        "releaseDate": "2023-12-08",
        "popularity": 84,
        "ageGroup": "3-8",
        "pages": 40
    },
    {
        "title": "Last Stop on Market Street",
        "author": "Matt de la Peña",
        "category": "diversity",
        "rating": 4.8,
        "price": 420,
        "image": "images/market_street.jpg",
        "releaseDate": "2024-02-15",
        "popularity": 89,
        "ageGroup": "4-8",
        "pages": 32
    }
];

// State management
let currentPage = 1;
let booksPerPage = 12;
let filteredBooks = [...kidsBooks];
let currentView = 'grid';

// DOM elements
const booksContainer = document.getElementById('booksContainer');
const resultsCount = document.getElementById('results-count');
const totalResults = document.getElementById('total-results');
const paginationContainer = document.querySelector('.pagination');
const searchInput = document.querySelector('.search-bar input');

// Filter elements
const ageGroupFilter = document.getElementById('age-group');
const categoryFilter = document.getElementById('category');
const authorFilter = document.getElementById('author');
const priceRangeFilter = document.getElementById('price-range');
const sortFilter = document.getElementById('sort');
const viewButtons = document.querySelectorAll('.view-btn');

// Mobile menu elements
const mobileMenuBtn = document.querySelector('.fa-bars');
const mobileMenuContainer = document.querySelector('.mobile-menu-container');
const closeMenuBtn = document.querySelector('.close-menu');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

// Utility functions
function parseAgeGroup(ageGroup) {
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

function matchesAgeGroup(bookAgeGroup, filterAgeGroup) {
    if (!filterAgeGroup) return true;
    
    const bookAge = parseAgeGroup(bookAgeGroup);
    const filterAge = parseAgeGroup(filterAgeGroup);
    
    return bookAge.min <= filterAge.max && bookAge.max >= filterAge.min;
}

function getBookBadge(book, index) {
    if (book.popularity >= 95) return 'Bestseller';
    if (book.popularity >= 90) return 'Popular';
    if (new Date(book.releaseDate) > new Date('2024-01-01')) return 'New';
    if (index % 7 === 0) return 'Sale';
    if (index % 5 === 0) return 'Trending';
    return '';
}

function generateStars(rating) {
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

function formatPrice(price) {
    const originalPrice = Math.floor(price * 1.2);
    const hasDiscount = Math.random() > 0.7;
    
    if (hasDiscount) {
        return `₹${price} <span class="original-price">₹${originalPrice}</span>`;
    }
    return `₹${price}`;
}

// Filter functions
function applyFilters() {
    filteredBooks = kidsBooks.filter(book => {
        // Search filter
        const searchTerm = searchInput.value.toLowerCase();
        const matchesSearch = !searchTerm || 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm);

        // Age group filter
        const selectedAgeGroup = ageGroupFilter.value;
        const matchesAge = !selectedAgeGroup || matchesAgeGroup(book.ageGroup, selectedAgeGroup);

        // Category filter
        const selectedCategory = categoryFilter.value;
        const matchesCategory = !selectedCategory || 
            book.category.toLowerCase().includes(selectedCategory.toLowerCase());

        // Author filter
        const selectedAuthor = authorFilter.value;
        const matchesAuthor = !selectedAuthor || 
            book.author.toLowerCase().includes(selectedAuthor.toLowerCase());

        // Price range filter
        const selectedPriceRange = priceRangeFilter.value;
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
    const sortValue = sortFilter.value;
    switch (sortValue) {
        case 'newest':
            filteredBooks.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            break;
        case 'popular':
            filteredBooks.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'rating':
            filteredBooks.sort((a, b) => b.rating - a.rating);
            break;
        case 'price-low':
            filteredBooks.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredBooks.sort((a, b) => b.price - a.price);
            break;
        case 'title':
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'age':
            filteredBooks.sort((a, b) => {
                const ageA = parseAgeGroup(a.ageGroup);
                const ageB = parseAgeGroup(b.ageGroup);
                return ageA.min - ageB.min;
            });
            break;
        default: // featured
            filteredBooks.sort((a, b) => b.popularity - a.popularity);
    }

    currentPage = 1;
    renderBooks();
    renderPagination();
    updateResultsInfo();
}

// Render functions
function renderBooks() {
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToShow = filteredBooks.slice(startIndex, endIndex);

    booksContainer.innerHTML = booksToShow.map((book, index) => {
        const badge = getBookBadge(book, startIndex + index);
        const stars = generateStars(book.rating);
        const price = formatPrice(book.price);
        const globalIndex = startIndex + index;
        
        return `
            <div class="book-card ${currentView === 'list' ? 'list-view' : ''}">
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
                        <button class="btn-primary" onclick="addToCart('${book.title}')">Add to Cart</button>
                        <button class="btn-secondary" onclick="toggleWishlist('${book.title}')">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} 
                onclick="changePage(${currentPage - 1})">Previous</button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="page-dots">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">${i}</button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="page-dots">...</span>`;
        }
        paginationHTML += `<button class="page-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} 
                onclick="changePage(${currentPage + 1})">Next</button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

function updateResultsInfo() {
    const startIndex = (currentPage - 1) * booksPerPage + 1;
    const endIndex = Math.min(currentPage * booksPerPage, filteredBooks.length);
    
    resultsCount.textContent = `${startIndex}-${endIndex}`;
    totalResults.textContent = filteredBooks.length.toLocaleString();
}

// Event handlers
function changePage(page) {
    currentPage = page;
    renderBooks();
    renderPagination();
    updateResultsInfo();
    
    // Scroll to top of books section
    document.querySelector('.books-grid').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function toggleView(view) {
    currentView = view;
    
    // Update active view button
    viewButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // Update books container class
    booksContainer.classList.toggle('list-view', view === 'list');
    
    renderBooks();
}

function addToCart(bookTitle) {
    // Simulate add to cart functionality
    const book = kidsBooks.find(b => b.title === bookTitle);
    if (book) {
        alert(`"${book.title}" has been added to your cart!`);
        // Here you would typically update cart state/localStorage
    }
}

function toggleWishlist(bookTitle) {
    // Simulate wishlist functionality
    const book = kidsBooks.find(b => b.title === bookTitle);
    if (book) {
        alert(`"${book.title}" has been added to your wishlist!`);
        // Here you would typically update wishlist state/localStorage
    }
}

// Age group card click handlers
function filterByAgeGroup(ageRange) {
    ageGroupFilter.value = ageRange;
    applyFilters();
    
    // Scroll to books section
    document.querySelector('.books-grid').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Category card click handlers
function filterByCategory(category) {
    // Map display categories to filter values
    const categoryMap = {
        'Picture Books': 'picture',
        'Adventure & Fantasy': 'adventure',
        'Educational': 'educational',
        'Bedtime Stories': 'bedtime',
        'Animals & Nature': 'animals',
        'Activity Books': 'activity'
    };
    
    const filterValue = categoryMap[category] || category.toLowerCase();
    categoryFilter.value = filterValue;
    applyFilters();
    
    // Scroll to books section
    document.querySelector('.books-grid').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Mobile menu functionality
function toggleMobileMenu() {
    mobileMenuContainer.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

function closeMobileMenu() {
    mobileMenuContainer.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initial render
    applyFilters();
    
    // Search functionality
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
    });
    
    // Filter event listeners
    ageGroupFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    authorFilter.addEventListener('change', applyFilters);
    priceRangeFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    
    // View toggle buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => toggleView(btn.dataset.view));
    });
    
    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Age group cards click handlers
    document.querySelectorAll('.age-group-card').forEach((card, index) => {
        const ageRanges = ['0-2', '3-5', '6-8', '9-12'];
        card.addEventListener('click', () => filterByAgeGroup(ageRanges[index]));
        card.style.cursor = 'pointer';
    });
    
    // Category cards click handlers
    document.querySelectorAll('.category-card').forEach(card => {
        const categoryTitle = card.querySelector('h3').textContent;
        card.addEventListener('click', () => filterByCategory(categoryTitle));
        card.style.cursor = 'pointer';
    });
    
    // Remove load more button and hide it
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

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Pagination with arrow keys
    if (e.key === 'ArrowLeft' && currentPage > 1) {
        changePage(currentPage - 1);
    } else if (e.key === 'ArrowRight') {
        const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
        if (currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    }
});

// Expose functions globally for onclick handlers
window.changePage = changePage;
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.fa-bars');
  const closeMenu = document.querySelector('.close-menu');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  const body = document.body;
  
  // Check if elements exist before adding event listeners
  if(menuToggle) {
    menuToggle.addEventListener('click', function() {
      body.classList.add('mobile-menu-active');
    });
  }
  
  function closeMenuFunction() {
    body.classList.remove('mobile-menu-active');
  }
  
  if(closeMenu) {
    closeMenu.addEventListener('click', closeMenuFunction);
  }
  
  if(menuOverlay) {
    menuOverlay.addEventListener('click', closeMenuFunction);
  }
});