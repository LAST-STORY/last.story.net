import { books } from './book-list.js';

const readTab = document.getElementById('read');
const unreadTab = document.getElementById('unread');
const readCountEl = document.getElementById('readCount');
const unreadCountEl = document.getElementById('unreadCount');
const searchInput = document.getElementById('searchInput');
const authorDropdown = document.getElementById('authorDropdown');

// ডার্ক/লাইট মোড টগল লজিক
const lampStringLight = document.getElementById('lampStringLight');
const lampStringDark = document.getElementById('lampStringDark');
const lampShade = document.querySelector('.lamp-shade');
const body = document.body;

function setMode(mode) {
    if (mode === 'dark') {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        lampStringDark.classList.add('active');
        lampStringLight.classList.remove('active');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        lampStringLight.classList.add('active');
        lampStringDark.classList.remove('active');
    }
    // glow/shade animation
    lampShade.classList.add('lamp-animate');
    setTimeout(() => lampShade.classList.remove('lamp-animate'), 400);
}

function pullString(e) {
    e.target.classList.add('pull');
    setTimeout(() => e.target.classList.remove('pull'), 400);
}
lampStringLight.addEventListener('click', e => { pullString(e); setMode('light'); });
lampStringDark.addEventListener('click', e => { pullString(e); setMode('dark'); });

// পেজ লোডে ইউজারের পছন্দ অনুযায়ী থিম সেট
(function () {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setMode('dark');
    else setMode('light');
})();

function setupAuthorDropdown() {
    const allAuthors = new Set();
    
    books.read.forEach(author => allAuthors.add(author.author));
    books.unread.forEach(author => allAuthors.add(author.author));
    
    allAuthors.forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        authorDropdown.appendChild(option);
    });
    
    authorDropdown.addEventListener('change', filterBooks);
}

function updateBookCounts() {
    const readCount = books.read.reduce((total, author) => total + author.books.length, 0);
    const unreadCount = books.unread.reduce((total, author) => total + author.books.length, 0);
    
    readCountEl.textContent = readCount;
    unreadCountEl.textContent = unreadCount;
}

function generateBookLists() {
    generateBookList('read', books.read);
    generateBookList('unread', books.unread);
}

function generateBookList(tabId, bookData) {
    const tab = document.getElementById(tabId);
    let html = '';
    
    bookData.forEach(author => {
        // গ্রুপ books by genre
        const genreMap = {};
        author.books.forEach(book => {
            if (!genreMap[book.genre]) genreMap[book.genre] = [];
            genreMap[book.genre].push(book);
        });
        let genresHTML = '';
        Object.entries(genreMap).forEach(([genre, books]) => {
            let booksHTML = '';
            books.forEach((book, idx) => {
                booksHTML += `
                    <div class="book-card" data-title="${book.title.toLowerCase()}" data-author="${author.author}" data-genre="${genre}">
                        <div class="book-title">${idx + 1}. ${book.title}</div>
                        <div class="book-author">${author.author}</div>
                        <div class="book-genre">${genre}</div>
                    </div>
                `;
            });
            genresHTML += `
                <div class="genre-section" data-genre="${genre}">
                    <h3 class="genre-name">${genre}</h3>
                    <div class="book-list">${booksHTML}</div>
                </div>
            `;
        });
        html += `
            <div class="author-section" data-author="${author.author}">
                <h2 class="author-name">${author.author}</h2>
                ${genresHTML}
            </div>
        `;
    });
    
    tab.innerHTML = html || `
        <div class="no-results">
            <div class="no-results-icon">📭</div>
            <div class="no-results-text">কোনো বই পাওয়া যায়নি</div>
        </div>
    `;
}

function filterBooks() {
    const activeTab = document.querySelector('.tab-content.active');
    const selectedAuthor = authorDropdown.value;
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!selectedAuthor && !searchTerm) {
        if (activeTab.id === 'read') {
            generateBookList('read', books.read);
        } else {
            generateBookList('unread', books.unread);
        }
        return;
    }
    
    let hasResults = false;
    activeTab.querySelectorAll('.author-section').forEach(section => {
        const author = section.dataset.author;
        let authorHasBooks = false;
        
        section.querySelectorAll('.book-card').forEach(card => {
            const matchesAuthor = !selectedAuthor || author === selectedAuthor;
            const matchesSearch = !searchTerm || card.dataset.title.includes(searchTerm);
            
            if (matchesAuthor && matchesSearch) {
                card.style.display = 'block';
                authorHasBooks = true;
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        section.style.display = authorHasBooks ? 'block' : 'none';
    });
    
    if (!hasResults) {
        activeTab.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">📭</div>
                <div class="no-results-text">
                    ${selectedAuthor ? `"${selectedAuthor}" এর` : ''}
                    ${searchTerm ? `"${searchTerm}" এর সাথে মিলে এমন` : ''}
                    কোনো বই পাওয়া যায়নি
                </div>
            </div>
        `;
    }
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
            
            searchInput.value = '';
            authorDropdown.value = '';
            filterBooks();
        });
    });
}

function init() {
    setupAuthorDropdown();
    generateBookLists();
    updateBookCounts();
    setupTabs();
    
    searchInput.addEventListener('input', filterBooks);
    authorDropdown.addEventListener('change', filterBooks);
}

init();