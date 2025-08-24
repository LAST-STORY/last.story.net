

// DOM Elements
const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');
const authorFilter = document.getElementById('authorFilter');
const bookGrid = document.getElementById('bookGrid');
const bookCount = document.getElementById('bookCount');
const noBooks = document.getElementById('noBooks');

// Global variables
let allBooks = [];
let filteredBooks = [];
let allAuthors = [];
let allGenres = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Convert bookData to flat array for easier processing
    convertBookDataToFlatArray();
    
    // Populate filters
    populateAuthorFilter();
    populateGenreFilter();
    
    // Display all books initially
    displayBooks(allBooks);
    
    // Add event listeners
    searchInput.addEventListener('input', handleSearch);
    genreFilter.addEventListener('change', handleFilter);
    authorFilter.addEventListener('change', handleFilter);
}

function convertBookDataToFlatArray() {
    allBooks = [];
    bookData.forEach(book => {
        allBooks.push({
            title: book.title,
            author: book.Write,
            genre: book.genre
        });
    });
    
    // Get unique authors and genres
    allAuthors = [...new Set(allBooks.map(book => book.author))];
    allGenres = [...new Set(allBooks.map(book => book.genre))];
}

function populateAuthorFilter() {
    // Clear existing options except the first one
    authorFilter.innerHTML = '<option value="">সব লেখক</option>';
    
    // Add author options
    allAuthors.forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        authorFilter.appendChild(option);
    });
}

function populateGenreFilter() {
    // Clear existing options except the first one
    genreFilter.innerHTML = '<option value="">সব ধরন</option>';
    
    // Add genre options
    allGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // If search is empty, apply only filters
        applyFilters();
    } else {
        // Apply search and filters
        const searchResults = allBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.genre.toLowerCase().includes(searchTerm)
        );
        
        // Apply current filters to search results
        filteredBooks = applyFiltersToBooks(searchResults);
        displayBooks(filteredBooks);
    }
}

function handleFilter() {
    applyFilters();
}

function applyFilters() {
    const selectedGenre = genreFilter.value;
    const selectedAuthor = authorFilter.value;
    
    filteredBooks = allBooks.filter(book => {
        const genreMatch = selectedGenre === '' || book.genre === selectedGenre;
        const authorMatch = selectedAuthor === '' || book.author === selectedAuthor;
        
        return genreMatch && authorMatch;
    });
    
    // Apply search if there's a search term
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm !== '') {
        filteredBooks = filteredBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.genre.toLowerCase().includes(searchTerm)
        );
    }
    
    displayBooks(filteredBooks);
}

function applyFiltersToBooks(bookList) {
    const selectedGenre = genreFilter.value;
    const selectedAuthor = authorFilter.value;
    
    return bookList.filter(book => {
        const genreMatch = selectedGenre === '' || book.genre === selectedGenre;
        const authorMatch = selectedAuthor === '' || book.author === selectedAuthor;
        
        return genreMatch && authorMatch;
    });
}

function displayBooks(booksToDisplay) {
    if (booksToDisplay.length === 0) {
        bookGrid.style.display = 'none';
        noBooks.style.display = 'block';
        bookCount.textContent = '0';
    } else {
        bookGrid.style.display = 'grid';
        noBooks.style.display = 'none';
        bookCount.textContent = booksToDisplay.length;
        
        // Clear existing books
        bookGrid.innerHTML = '';
        
        // Create book cards
        booksToDisplay.forEach((book, index) => {
            const bookCard = createBookCard(book, index + 1);
            bookGrid.appendChild(bookCard);
        });
    }
}

function createBookCard(book, serialNumber) {
    const card = document.createElement('div');
    card.className = 'book-card';
    
    card.innerHTML = `
        <div class="book-title-container">
            <span class="book-serial">${serialNumber}.</span>
            <h3 class="book-title">${book.title}</h3>
        </div>
        <p class="book-author">
            <i class="fas fa-user-edit"></i>
            ${book.author}
        </p>
        <span class="book-genre">${book.genre}</span>
    `;
    
    // Add click effect
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    });
    
    return card;
}

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
function showLoading() {
    bookGrid.innerHTML = `
        <div class="loading" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #667eea;"></i>
            <p style="margin-top: 15px; color: #666;">বইগুলি লোড হচ্ছে...</p>
        </div>
    `;
}

// Add keyboard navigation support
searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        this.blur();
    }
});

// Add focus effects for better accessibility
const focusableElements = document.querySelectorAll('input, select, button');
focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    element.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Add error handling for better user experience
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // You can add user-friendly error messages here
});

// Add performance optimization
function debounce(func, wait) {
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

// Debounce search for better performance
const debouncedSearch = debounce(handleSearch, 300);
searchInput.addEventListener('input', debouncedSearch);



// Function to add new book and update filters
function addNewBook(title, author, genre) {
    const newBook = {
        title: title,
        author: author,
        genre: genre
    };
    
    allBooks.push(newBook);
    
    // Update unique lists
    if (!allAuthors.includes(author)) {
        allAuthors.push(author);
    }
    if (!allGenres.includes(genre)) {
        allGenres.push(genre);
    }
    
    // Update filters
    populateAuthorFilter();
    populateGenreFilter();
    
    // Refresh display
    applyFilters();
    
    return newBook;
}

// Function to refresh all filters
function refreshFilters() {
    convertBookDataToFlatArray();
    populateAuthorFilter();
    populateGenreFilter();
}

// Demo function to add sample books
function addSampleBooks() {
    const sampleBooks = [
        { title: "চাঁদের পাহাড়", author: "বিভূতিভূষণ বন্দ্যোপাধ্যায়", genre: "অ্যাডভেঞ্চার" },
        { title: "শেষের কবিতা", author: "রবীন্দ্রনাথ ঠাকুর", genre: "কবিতা" },
        { title: "মিসির আলি", author: "হুমায়ূন আহমেদ", genre: "রহস্য" }
    ];
    
    sampleBooks.forEach(book => {
        addNewBook(book.title, book.author, book.genre);
    });
    
    console.log("ডেমো বইগুলি যোগ করা হয়েছে!");
}

// Make functions globally accessible for console use
window.addNewBook = addNewBook;
window.refreshFilters = refreshFilters;
window.addSampleBooks = addSampleBooks;

// Export book list for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = bookData;
}
