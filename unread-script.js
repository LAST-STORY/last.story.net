

// Get DOM elements
const unreadBookGrid = document.getElementById('unreadBookGrid');
const unreadBookCount = document.getElementById('unreadBookCount');
const noUnreadBooks = document.getElementById('noUnreadBooks');
const genreFilter = document.getElementById('genreFilter');
const authorFilter = document.getElementById('authorFilter');

// Initialize the app
function initializeUnreadApp() {
    populateFilters();
    displayUnreadBooks();
    
    // Add event listeners
    genreFilter.addEventListener('change', applyFilters);
    authorFilter.addEventListener('change', applyFilters);
}

// Populate filters with unique values
function populateFilters() {
    // Get unique genres
    const genres = [...new Set(unreadBookData.map(book => book.genre))];
    genreFilter.innerHTML = '<option value="">সব ধরন</option>';
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });

    // Get unique writers
    const writers = [...new Set(unreadBookData.map(book => book.writer))];
    authorFilter.innerHTML = '<option value="">সব লেখক</option>';
    writers.forEach(writer => {
        const option = document.createElement('option');
        option.value = writer;
        option.textContent = writer;
        authorFilter.appendChild(option);
    });
}

// Display unread books
function displayUnreadBooks(booksToShow = unreadBookData) {
    if (!booksToShow || booksToShow.length === 0) {
        showNoUnreadBooks();
        return;
    }

    // Update book count
    unreadBookCount.textContent = booksToShow.length;

    // Clear existing books
    unreadBookGrid.innerHTML = '';

    // Create book cards
    booksToShow.forEach((book, index) => {
        const bookCard = createUnreadBookCard(book, index + 1);
        unreadBookGrid.appendChild(bookCard);
    });
}

// Create unread book card
function createUnreadBookCard(book, serialNumber) {
    const card = document.createElement('div');
    card.className = 'book-card unread-card';
    
    card.innerHTML = `
        <div class="book-title-container">
            <span class="book-serial">${serialNumber}.</span>
            <h3 class="book-title">${book.title}</h3>
        </div>
        <p class="book-author">
            <i class="fas fa-user-edit"></i>
            ${book.writer}
        </p>
        <span class="book-genre">${book.genre}</span>
        <div class="unread-status">
            <i class="fas fa-bookmark"></i>
            অপঠিত
        </div>
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

// Apply filters
function applyFilters() {
    const selectedGenre = genreFilter.value;
    const selectedWriter = authorFilter.value;

    let filteredBooks = unreadBookData;

    // Filter by genre
    if (selectedGenre) {
        filteredBooks = filteredBooks.filter(book => book.genre === selectedGenre);
    }

    // Filter by writer
    if (selectedWriter) {
        filteredBooks = filteredBooks.filter(book => book.writer === selectedWriter);
    }

    // Display filtered books
    displayUnreadBooks(filteredBooks);
}

// Show no books message
function showNoUnreadBooks() {
    unreadBookGrid.style.display = 'none';
    noUnreadBooks.style.display = 'block';
    unreadBookCount.textContent = '0';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeUnreadApp);
