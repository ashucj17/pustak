// Books dataset (from the provided JSON)
const booksData = [
    {
        "title": "Visual Mathematics",
        "author": "John Derbyshire",
        "category": "science",
        "rating": 4.9,
        "price": 599,
        "image": "images/mathematics.jpg",
        "releaseDate": "2024-01-15",
        "popularity": 95
    },
    {
        "title": "The Art of Fiction",
        "author": "Jane Austen",
        "category": "literature",
        "rating": 4.7,
        "price": 450,
        "image": "images/art_fiction.jpg",
        "releaseDate": "2023-11-20",
        "popularity": 88
    },
    {
        "title": "Modern Physics Explained",
        "author": "Dr. Sarah Chen",
        "category": "science",
        "rating": 4.8,
        "price": 750,
        "image": "images/modern_physics.jpg",
        "releaseDate": "2024-03-10",
        "popularity": 92
    },
    {
        "title": "Digital Marketing Mastery",
        "author": "Michael Rodriguez",
        "category": "business",
        "rating": 4.6,
        "price": 520,
        "image": "images/digital_marketing.jpg",
        "releaseDate": "2023-12-05",
        "popularity": 85
    },
    {
        "title": "Ancient Civilizations",
        "author": "Prof. Elizabeth Harper",
        "category": "history",
        "rating": 4.5,
        "price": 680,
        "image": "images/ancient_civilizations.jpg",
        "releaseDate": "2024-02-18",
        "popularity": 78
    },
    {
        "title": "The Psychology of Success",
        "author": "Dr. Robert Williams",
        "category": "psychology",
        "rating": 4.4,
        "price": 390,
        "image": "images/psychology_success.jpg",
        "releaseDate": "2023-10-12",
        "popularity": 82
    },
    {
        "title": "Quantum Computing Revolution",
        "author": "Dr. Alan Turing Jr.",
        "category": "technology",
        "rating": 4.9,
        "price": 850,
        "image": "images/quantum_computing.jpg",
        "releaseDate": "2024-01-08",
        "popularity": 96
    },
    {
        "title": "Culinary Adventures",
        "author": "Chef Maria Gonzalez",
        "category": "cooking",
        "rating": 4.3,
        "price": 420,
        "image": "images/culinary_adventures.jpg",
        "releaseDate": "2023-09-25",
        "popularity": 75
    },
    {
        "title": "Financial Independence",
        "author": "Warren Smith",
        "category": "finance",
        "rating": 4.7,
        "price": 560,
        "image": "images/financial_independence.jpg",
        "releaseDate": "2024-01-30",
        "popularity": 89
    },
    {
        "title": "The Great Gatsby Revisited",
        "author": "F. Scott Modern",
        "category": "literature",
        "rating": 4.2,
        "price": 380,
        "image": "images/gatsby_revisited.jpg",
        "releaseDate": "2023-08-15",
        "popularity": 71
    },
    {
        "title": "Machine Learning Fundamentals",
        "author": "Dr. Lisa Zhang",
        "category": "technology",
        "rating": 4.8,
        "price": 720,
        "image": "images/ml_fundamentals.jpg",
        "releaseDate": "2024-02-22",
        "popularity": 93
    },
    {
        "title": "World War II Chronicles",
        "author": "Historian David Brown",
        "category": "history",
        "rating": 4.6,
        "price": 640,
        "image": "images/wwii_chronicles.jpg",
        "releaseDate": "2023-11-08",
        "popularity": 84
    },
    {
        "title": "Mindfulness and Meditation",
        "author": "Dr. Sarah Peaceful",
        "category": "self-help",
        "rating": 4.5,
        "price": 350,
        "image": "images/mindfulness.jpg",
        "releaseDate": "2024-01-12",
        "popularity": 79
    },
    {
        "title": "Advanced Calculus",
        "author": "Prof. James Newton",
        "category": "science",
        "rating": 4.4,
        "price": 780,
        "image": "images/advanced_calculus.jpg",
        "releaseDate": "2023-12-20",
        "popularity": 76
    },
    {
        "title": "The Entrepreneur's Guide",
        "author": "Steve Innovation",
        "category": "business",
        "rating": 4.7,
        "price": 490,
        "image": "images/entrepreneur_guide.jpg",
        "releaseDate": "2024-03-05",
        "popularity": 87
    },
    {
        "title": "Climate Change Solutions",
        "author": "Dr. Green Environment",
        "category": "science",
        "rating": 4.8,
        "price": 620,
        "image": "images/climate_solutions.jpg",
        "releaseDate": "2024-02-14",
        "popularity": 91
    },
    {
        "title": "Photography Masterclass",
        "author": "Annie Lens",
        "category": "arts",
        "rating": 4.3,
        "price": 460,
        "image": "images/photography_masterclass.jpg",
        "releaseDate": "2023-10-30",
        "popularity": 73
    },
    {
        "title": "Blockchain Technology",
        "author": "Crypto Expert",
        "category": "technology",
        "rating": 4.6,
        "price": 680,
        "image": "images/blockchain_tech.jpg",
        "releaseDate": "2024-01-25",
        "popularity": 85
    },
    {
        "title": "The Art of Negotiation",
        "author": "Deal Master",
        "category": "business",
        "rating": 4.5,
        "price": 410,
        "image": "images/negotiation_art.jpg",
        "releaseDate": "2023-11-15",
        "popularity": 80
    },
    {
        "title": "Organic Chemistry Simplified",
        "author": "Dr. Molecule Science",
        "category": "science",
        "rating": 4.4,
        "price": 590,
        "image": "images/organic_chemistry.jpg",
        "releaseDate": "2024-02-08",
        "popularity": 77
    },
    {
        "title": "Mystery of the Lost City",
        "author": "Adventure Writer",
        "category": "fiction",
        "rating": 4.2,
        "price": 340,
        "image": "images/mystery_lost_city.jpg",
        "releaseDate": "2023-09-10",
        "popularity": 69
    },
    {
        "title": "Data Science Handbook",
        "author": "Dr. Big Data",
        "category": "technology",
        "rating": 4.9,
        "price": 820,
        "image": "images/data_science.jpg",
        "releaseDate": "2024-03-12",
        "popularity": 97
    },
    {
        "title": "Renaissance Art History",
        "author": "Prof. Art Historian",
        "category": "arts",
        "rating": 4.6,
        "price": 580,
        "image": "images/renaissance_art.jpg",
        "releaseDate": "2023-12-03",
        "popularity": 83
    },
    {
        "title": "Fitness and Nutrition",
        "author": "Health Coach Pro",
        "category": "health",
        "rating": 4.3,
        "price": 380,
        "image": "images/fitness_nutrition.jpg",
        "releaseDate": "2024-01-20",
        "popularity": 72
    },
    {
        "title": "Space Exploration",
        "author": "Dr. Cosmos Explorer",
        "category": "science",
        "rating": 4.8,
        "price": 710,
        "image": "images/space_exploration.jpg",
        "releaseDate": "2024-02-28",
        "popularity": 94
    },
    {
        "title": "Investment Strategies",
        "author": "Wall Street Guru",
        "category": "finance",
        "rating": 4.7,
        "price": 650,
        "image": "images/investment_strategies.jpg",
        "releaseDate": "2023-11-22",
        "popularity": 88
    },
    {
        "title": "The Philosophy of Mind",
        "author": "Dr. Deep Thinker",
        "category": "philosophy",
        "rating": 4.5,
        "price": 520,
        "image": "images/philosophy_mind.jpg",
        "releaseDate": "2024-01-18",
        "popularity": 78
    },
    {
        "title": "Creative Writing Workshop",
        "author": "Master Storyteller",
        "category": "literature",
        "rating": 4.4,
        "price": 420,
        "image": "images/creative_writing.jpg",
        "releaseDate": "2023-10-08",
        "popularity": 74
    },
    {
        "title": "AI and Machine Ethics",
        "author": "Dr. Tech Ethics",
        "category": "technology",
        "rating": 4.8,
        "price": 690,
        "image": "images/ai_ethics.jpg",
        "releaseDate": "2024-03-08",
        "popularity": 92
    },
    {
        "title": "Home Gardening Guide",
        "author": "Green Thumb Expert",
        "category": "lifestyle",
        "rating": 4.2,
        "price": 320,
        "image": "images/home_gardening.jpg",
        "releaseDate": "2023-08-28",
        "popularity": 68
    },
    {
        "title": "Molecular Biology",
        "author": "Dr. Gene Researcher",
        "category": "science",
        "rating": 4.7,
        "price": 760,
        "image": "images/molecular_biology.jpg",
        "releaseDate": "2024-02-12",
        "popularity": 86
    },
    {
        "title": "Leadership Excellence",
        "author": "CEO Mentor",
        "category": "business",
        "rating": 4.6,
        "price": 480,
        "image": "images/leadership_excellence.jpg",
        "releaseDate": "2023-12-18",
        "popularity": 81
    },
    {
        "title": "The Science of Happiness",
        "author": "Dr. Joy Researcher",
        "category": "psychology",
        "rating": 4.5,
        "price": 370,
        "image": "images/science_happiness.jpg",
        "releaseDate": "2024-01-05",
        "popularity": 77
    },
    {
        "title": "Cybersecurity Essentials",
        "author": "Security Expert",
        "category": "technology",
        "rating": 4.8,
        "price": 730,
        "image": "images/cybersecurity.jpg",
        "releaseDate": "2024-02-25",
        "popularity": 90
    },
    {
        "title": "Classical Music Appreciation",
        "author": "Maestro Composer",
        "category": "arts",
        "rating": 4.3,
        "price": 390,
        "image": "images/classical_music.jpg",
        "releaseDate": "2023-09-18",
        "popularity": 70
    },
    {
        "title": "Environmental Science",
        "author": "Dr. Earth Protector",
        "category": "science",
        "rating": 4.6,
        "price": 580,
        "image": "images/environmental_science.jpg",
        "releaseDate": "2024-01-28",
        "popularity": 84
    },
    {
        "title": "Time Management Mastery",
        "author": "Productivity Expert",
        "category": "self-help",
        "rating": 4.4,
        "price": 360,
        "image": "images/time_management.jpg",
        "releaseDate": "2023-11-12",
        "popularity": 75
    },
    {
        "title": "The Romance Novel",
        "author": "Love Story Writer",
        "category": "fiction",
        "rating": 4.1,
        "price": 310,
        "image": "images/romance_novel.jpg",
        "releaseDate": "2023-07-22",
        "popularity": 66
    },
    {
        "title": "Robotics Engineering",
        "author": "Dr. Robot Builder",
        "category": "technology",
        "rating": 4.9,
        "price": 890,
        "image": "images/robotics_engineering.jpg",
        "releaseDate": "2024-03-15",
        "popularity": 98
    },
    {
        "title": "World Geography Atlas",
        "author": "Map Expert",
        "category": "geography",
        "rating": 4.5,
        "price": 450,
        "image": "images/world_geography.jpg",
        "releaseDate": "2023-10-25",
        "popularity": 79
    },
    {
        "title": "Cognitive Behavioral Therapy",
        "author": "Dr. Mind Healer",
        "category": "psychology",
        "rating": 4.7,
        "price": 540,
        "image": "images/cbt_therapy.jpg",
        "releaseDate": "2024-02-05",
        "popularity": 87
    },
    {
        "title": "Sustainable Energy",
        "author": "Dr. Solar Power",
        "category": "science",
        "rating": 4.8,
        "price": 670,
        "image": "images/sustainable_energy.jpg",
        "releaseDate": "2024-01-22",
        "popularity": 91
    },
    {
        "title": "Marketing Psychology",
        "author": "Brand Strategist",
        "category": "business",
        "rating": 4.6,
        "price": 510,
        "image": "images/marketing_psychology.jpg",
        "releaseDate": "2023-12-08",
        "popularity": 82
    },
    {
        "title": "The Thriller Novel",
        "author": "Suspense Master",
        "category": "fiction",
        "rating": 4.3,
        "price": 350,
        "image": "images/thriller_novel.jpg",
        "releaseDate": "2023-08-12",
        "popularity": 73
    },
    {
        "title": "Statistics Made Simple",
        "author": "Prof. Number Cruncher",
        "category": "science",
        "rating": 4.4,
        "price": 520,
        "image": "images/statistics_simple.jpg",
        "releaseDate": "2024-02-18",
        "popularity": 76
    },
    {
        "title": "Interior Design Principles",
        "author": "Design Guru",
        "category": "arts",
        "rating": 4.2,
        "price": 480,
        "image": "images/interior_design.jpg",
        "releaseDate": "2023-09-30",
        "popularity": 71
    },
    {
        "title": "Artificial Intelligence Ethics",
        "author": "Dr. AI Philosopher",
        "category": "technology",
        "rating": 4.9,
        "price": 780,
        "image": "images/ai_philosophy.jpg",
        "releaseDate": "2024-03-20",
        "popularity": 95
    },
    {
        "title": "Ancient Philosophy",
        "author": "Prof. Wisdom Seeker",
        "category": "philosophy",
        "rating": 4.6,
        "price": 590,
        "image": "images/ancient_philosophy.jpg",
        "releaseDate": "2023-11-28",
        "popularity": 83
    },
    {
        "title": "Personal Finance 101",
        "author": "Money Advisor",
        "category": "finance",
        "rating": 4.5,
        "price": 330,
        "image": "images/personal_finance.jpg",
        "releaseDate": "2024-01-10",
        "popularity": 78
    },
    {
        "title": "The Science Fiction Epic",
        "author": "Future Writer",
        "category": "fiction",
        "rating": 4.4,
        "price": 380,
        "image": "images/scifi_epic.jpg",
        "releaseDate": "2023-10-05",
        "popularity": 74
    },
    {
        "title": "Biochemistry Fundamentals",
        "author": "Dr. Life Science",
        "category": "science",
        "rating": 4.7,
        "price": 720,
        "image": "images/biochemistry.jpg",
        "releaseDate": "2024-02-22",
        "popularity": 88
    },
    {
        "title": "Shakespeare Complete Works",
        "author": "William Shakespeare",
        "category": "literature",
        "rating": 4.9,
        "price": 450,
        "image": "images/shakespeare_complete.jpg",
        "releaseDate": "2023-12-01",
        "popularity": 96
    },
    {
        "title": "Nanotechnology Revolution",
        "author": "Dr. Nano Scientist",
        "category": "science",
        "rating": 4.9,
        "price": 800,
        "image": "images/nanotechnology.jpg",
        "releaseDate": "2024-03-12",
        "popularity": 94
    }
];

// Global variables
let filteredBooks = [...booksData];
let currentPage = 1;
const booksPerPage = 9;
let currentView = 'grid';

// DOM elements
const categoryFilter = document.getElementById('category');
const sortSelect = document.getElementById('sort');
const booksContainer = document.getElementById('booksContainer');
const viewBtns = document.querySelectorAll('.view-btn');
const paginationContainer = document.querySelector('.pagination');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Populate category filter with unique categories from the data
    populateCategoryFilter();
    
    // Sort books by rating initially (for Top 50 ranking)
    sortBooks('rating');
    
    // Initial render
    renderBooks();
    renderPagination();
    
    // Event listeners
    categoryFilter.addEventListener('change', handleFilter);
    sortSelect.addEventListener('change', handleSort);
    
    // View toggle functionality
    viewBtns.forEach(btn => {
        btn.addEventListener('click', handleViewToggle);
    });
});

// Populate category filter dropdown
function populateCategoryFilter() {
    const categories = [...new Set(booksData.map(book => book.category))];
    categories.sort();
    
    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
}

// Handle category filtering
function handleFilter() {
    const selectedCategory = categoryFilter.value;
    
    if (selectedCategory === '') {
        filteredBooks = [...booksData];
    } else {
        filteredBooks = booksData.filter(book => book.category === selectedCategory);
    }
    
    // Re-sort the filtered books
    const currentSort = sortSelect.value;
    sortBooks(currentSort);
    
    currentPage = 1;
    renderBooks();
    renderPagination();
}

// Handle sorting
function handleSort() {
    const sortBy = sortSelect.value;
    sortBooks(sortBy);
    renderBooks();
}

// Sort books based on criteria
function sortBooks(sortBy) {
    switch (sortBy) {
        case 'rating':
            filteredBooks.sort((a, b) => b.rating - a.rating);
            break;
        case 'reviews':
            filteredBooks.sort((a, b) => b.popularity - a.popularity);
            break;
        case 'price-low':
            filteredBooks.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredBooks.sort((a, b) => b.price - a.price);
            break;
        case 'rank':
        default:
            // For ranking, we'll use a combination of rating and popularity
            filteredBooks.sort((a, b) => {
                const scoreA = (a.rating * 0.7) + ((a.popularity / 100) * 0.3);
                const scoreB = (b.rating * 0.7) + ((b.popularity / 100) * 0.3);
                return scoreB - scoreA;
            });
            break;
    }
}

// Handle view toggle
function handleViewToggle(e) {
    viewBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    const view = e.target.getAttribute('data-view');
    currentView = view;
    
    if (view === 'list') {
        booksContainer.classList.add('list-view');
    } else {
        booksContainer.classList.remove('list-view');
    }
}

// Render books for current page
function renderBooks() {
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToShow = filteredBooks.slice(startIndex, endIndex);
    
    booksContainer.innerHTML = '';
    
    booksToShow.forEach((book, index) => {
        const rankNumber = startIndex + index + 1;
        const bookCard = createBookCard(book, rankNumber);
        booksContainer.appendChild(bookCard);
    });
    
    // Add event listeners to new buttons
    addBookCardEventListeners();
}

// Create a book card element
function createBookCard(book, rank) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    
    const stars = generateStars(book.rating);
    
    bookCard.innerHTML = `
        <div class="rank-number">${rank}</div>
        <div class="book-img" style="background-image: url('${book.image}')"></div>
        <div class="book-content">
            <h3>${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <div class="rating">
                ${stars}
                <span>(${book.rating})</span>
            </div>
            <div class="price">₹${book.price}</div>
            <div class="book-actions">
                <button class="btn-primary">Add to Cart</button>
                <button class="btn-secondary"><i class="fa-regular fa-heart"></i></button>
            </div>
        </div>
    `;
    
    return bookCard;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fa-solid fa-star"></i>';
    }
    
    if (halfStar) {
        starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="fa-regular fa-star"></i>';
    }
    
    return starsHTML;
}

// Add event listeners to book card buttons
function addBookCardEventListeners() {
    // Add to cart functionality
    const addToCartBtns = document.querySelectorAll('.btn-primary');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = btn.textContent;
            btn.textContent = 'Added!';
            btn.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 2000);
        });
    });

    // Wishlist functionality
    const wishlistBtns = document.querySelectorAll('.btn-secondary');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const heartIcon = btn.querySelector('i');
            if (heartIcon.classList.contains('fa-regular')) {
                heartIcon.classList.remove('fa-regular');
                heartIcon.classList.add('fa-solid');
                btn.style.backgroundColor = '#ad0b0b';
                btn.style.color = 'white';
            } else {
                heartIcon.classList.remove('fa-solid');
                heartIcon.classList.add('fa-regular');
                btn.style.backgroundColor = '';
                btn.style.color = '#ad0b0b';
            }
        });
    });
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    paginationContainer.appendChild(prevBtn);
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn';
        pageBtn.textContent = i;
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.addEventListener('click', () => goToPage(i));
        paginationContainer.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
    paginationContainer.appendChild(nextBtn);
}

// Go to specific page
function goToPage(page) {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderBooks();
    renderPagination();
    
    // Scroll to top of books section
    document.querySelector('.books-grid').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Search functionality (if you want to add search to the search bar)
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredBooks = [...booksData];
    } else {
        filteredBooks = booksData.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply current category filter if any
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== '') {
        filteredBooks = filteredBooks.filter(book => book.category === selectedCategory);
    }
    
    // Re-sort the filtered books
    const currentSort = sortSelect.value;
    sortBooks(currentSort);
    
    currentPage = 1;
    renderBooks();
    renderPagination();
}

// Mobile menu functionality (keeping existing code)
const menuToggle = document.querySelector('.fa-bars');
const mobileMenuContainer = document.querySelector('.mobile-menu-container');
const closeMenu = document.querySelector('.close-menu');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

function openMobileMenu() {
    document.body.classList.add('mobile-menu-active');
}

function closeMobileMenu() {
    document.body.classList.remove('mobile-menu-active');
}

if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);
if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);