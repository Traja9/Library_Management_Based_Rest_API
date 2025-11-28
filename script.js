const API_BASE_URL = 'http://localhost:5000/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    loadBooks();
    loadAuthors();
    loadBorrowings('all');
    
    // Setup form submissions
    document.getElementById('addBookForm').addEventListener('submit', handleAddBook);
    document.getElementById('addAuthorForm').addEventListener('submit', handleAddAuthor);
    document.getElementById('borrowBookForm').addEventListener('submit', handleBorrowBook);
});

// Tab functionality
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// ==================== BOOKS ====================

async function loadBooks() {
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        const data = await response.json();
        
        if (data.success) {
            displayBooks(data.data);
        }
    } catch (error) {
        console.error('Error loading books:', error);
        showError('Failed to load books');
    }
}

function displayBooks(books) {
    const booksList = document.getElementById('booksList');
    
    if (books.length === 0) {
        booksList.innerHTML = '<div class="empty-state"><h3>No books found</h3><p>Add your first book to get started!</p></div>';
        return;
    }
    
    booksList.innerHTML = books.map(book => `
        <div class="card">
            <h3>${book.title}</h3>
            <div class="card-info"><strong>ISBN:</strong> ${book.isbn}</div>
            <div class="card-info"><strong>Genre:</strong> ${book.genre}</div>
            <div class="card-info"><strong>Year:</strong> ${book.publication_year || 'N/A'}</div>
            <div class="card-info"><strong>Available:</strong> ${book.copies_available} / ${book.total_copies}</div>
            <span class="status-badge ${book.copies_available > 0 ? 'status-available' : 'status-borrowed'}">
                ${book.copies_available > 0 ? 'Available' : 'Out of Stock'}
            </span>
            <div class="card-actions">
                <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

async function searchBooks() {
    const query = document.getElementById('bookSearchInput').value;
    const genre = document.getElementById('genreFilter').value;
    
    try {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (genre) params.append('genre', genre);
        
        const response = await fetch(`${API_BASE_URL}/books/search?${params}`);
        const data = await response.json();
        
        if (data.success) {
            displayBooks(data.data);
        }
    } catch (error) {
        console.error('Error searching books:', error);
        showError('Failed to search books');
    }
}

function showAddBookModal() {
    loadAuthorsForDropdown();
    document.getElementById('addBookModal').style.display = 'block';
}

async function loadAuthorsForDropdown() {
    try {
        const response = await fetch(`${API_BASE_URL}/authors`);
        const data = await response.json();
        
        if (data.success) {
            const select = document.getElementById('bookAuthor');
            select.innerHTML = '<option value="">Select Author</option>' + 
                data.data.map(author => `<option value="${author.id}">${author.name}</option>`).join('');
        }
    } catch (error) {
        console.error('Error loading authors:', error);
    }
}

async function handleAddBook(e) {
    e.preventDefault();
    
    const bookData = {
        title: document.getElementById('bookTitle').value,
        author_id: parseInt(document.getElementById('bookAuthor').value),
        isbn: document.getElementById('bookISBN').value,
        genre: document.getElementById('bookGenre').value,
        publication_year: parseInt(document.getElementById('bookYear').value) || null,
        total_copies: parseInt(document.getElementById('bookCopies').value),
        copies_available: parseInt(document.getElementById('bookCopies').value)
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Book added successfully!');
            closeModal('addBookModal');
            document.getElementById('addBookForm').reset();
            loadBooks();
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Error adding book:', error);
        showError('Failed to add book');
    }
}

async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Book deleted successfully!');
            loadBooks();
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        showError('Failed to delete book');
    }
}

// ==================== AUTHORS ====================

async function loadAuthors() {
    try {
        const response = await fetch(`${API_BASE_URL}/authors`);
        const data = await response.json();
        
        if (data.success) {
            displayAuthors(data.data);
        }
    } catch (error) {
        console.error('Error loading authors:', error);
        showError('Failed to load authors');
    }
}

function displayAuthors(authors) {
    const authorsList = document.getElementById('authorsList');
    
    if (authors.length === 0) {
        authorsList.innerHTML = '<div class="empty-state"><h3>No authors found</h3><p>Add your first author to get started!</p></div>';
        return;
    }
    
    authorsList.innerHTML = authors.map(author => `
        <div class="card">
            <h3>${author.name}</h3>
            <div class="card-info"><strong>Birth Year:</strong> ${author.birth_year || 'N/A'}</div>
            <div class="card-info"><strong>Nationality:</strong> ${author.nationality || 'N/A'}</div>
            <div class="card-info"><strong>Bio:</strong> ${author.bio || 'No biography available'}</div>
            <div class="card-actions">
                <button class="btn" onclick="viewAuthorBooks(${author.id})">View Books</button>
            </div>
        </div>
    `).join('');
}

function showAddAuthorModal() {
    document.getElementById('addAuthorModal').style.display = 'block';
}

async function handleAddAuthor(e) {
    e.preventDefault();
    
    const authorData = {
        name: document.getElementById('authorName').value,
        bio: document.getElementById('authorBio').value,
        birth_year: parseInt(document.getElementById('authorBirthYear').value) || null,
        nationality: document.getElementById('authorNationality').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/authors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authorData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Author added successfully!');
            closeModal('addAuthorModal');
            document.getElementById('addAuthorForm').reset();
            loadAuthors();
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Error adding author:', error);
        showError('Failed to add author');
    }
}

async function viewAuthorBooks(authorId) {
    try {
        const response = await fetch(`${API_BASE_URL}/authors/${authorId}/books`);
        const data = await response.json();
        
        if (data.success) {
            // Switch to books tab and display filtered books
            document.querySelector('[data-tab="books"]').click();
            displayBooks(data.data);
        }
    } catch (error) {
        console.error('Error loading author books:', error);
        showError('Failed to load author books');
    }
}

// ==================== BORROWINGS ====================

async function loadBorrowings(filter = 'all') {
    try {
        let url = `${API_BASE_URL}/borrowings`;
        
        if (filter === 'overdue') {
            url = `${API_BASE_URL}/borrowings/overdue`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            let borrowings = data.data;
            
            // Apply filter
            if (filter === 'borrowed') {
                borrowings = borrowings.filter(b => b.status === 'borrowed');
            } else if (filter === 'returned') {
                borrowings = borrowings.filter(b => b.status === 'returned');
            }
            
            displayBorrowings(borrowings);
        }
    } catch (error) {
        console.error('Error loading borrowings:', error);
        showError('Failed to load borrowings');
    }
}

function displayBorrowings(borrowings) {
    const borrowingsList = document.getElementById('borrowingsList');
    
    if (borrowings.length === 0) {
        borrowingsList.innerHTML = '<div class="empty-state"><h3>No borrowing records found</h3></div>';
        return;
    }
    
    borrowingsList.innerHTML = borrowings.map(borrowing => {
        const isOverdue = borrowing.status === 'borrowed' && new Date(borrowing.due_date) < new Date();
        const statusClass = borrowing.status === 'returned' ? 'status-returned' : 
                           isOverdue ? 'status-overdue' : 'status-borrowed';
        const statusText = borrowing.status === 'returned' ? 'Returned' :
                          isOverdue ? 'Overdue' : 'Borrowed';
        
        return `
            <div class="card">
                <h3>Borrowing #${borrowing.id}</h3>
                <div class="card-info"><strong>Book ID:</strong> ${borrowing.book_id}</div>
                <div class="card-info"><strong>Borrower:</strong> ${borrowing.borrower_name}</div>
                <div class="card-info"><strong>Email:</strong> ${borrowing.borrower_email || 'N/A'}</div>
                <div class="card-info"><strong>Borrow Date:</strong> ${borrowing.borrow_date}</div>
                <div class="card-info"><strong>Due Date:</strong> ${borrowing.due_date}</div>
                ${borrowing.return_date ? `<div class="card-info"><strong>Return Date:</strong> ${borrowing.return_date}</div>` : ''}
                <span class="status-badge ${statusClass}">${statusText}</span>
                ${borrowing.status === 'borrowed' ? `
                    <div class="card-actions">
                        <button class="btn btn-success" onclick="returnBook(${borrowing.id})">Return Book</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function showBorrowBookModal() {
    loadBooksForBorrowing();
    document.getElementById('borrowBookModal').style.display = 'block';
}

async function loadBooksForBorrowing() {
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        const data = await response.json();
        
        if (data.success) {
            const select = document.getElementById('borrowBookSelect');
            const availableBooks = data.data.filter(book => book.copies_available > 0);
            
            select.innerHTML = '<option value="">Select Book</option>' + 
                availableBooks.map(book => 
                    `<option value="${book.id}">${book.title} (${book.copies_available} available)</option>`
                ).join('');
        }
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

async function handleBorrowBook(e) {
    e.preventDefault();
    
    const borrowData = {
        book_id: parseInt(document.getElementById('borrowBookSelect').value),
        borrower_name: document.getElementById('borrowerName').value,
        borrower_email: document.getElementById('borrowerEmail').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/borrowings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(borrowData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Book borrowed successfully!');
            closeModal('borrowBookModal');
            document.getElementById('borrowBookForm').reset();
            loadBorrowings('all');
            loadBooks(); // Refresh book counts
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Error borrowing book:', error);
        showError('Failed to borrow book');
    }
}

async function returnBook(borrowingId) {
    if (!confirm('Mark this book as returned?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/borrowings/${borrowingId}/return`, {
            method: 'PUT'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Book returned successfully!');
            loadBorrowings('all');
            loadBooks(); // Refresh book counts
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Error returning book:', error);
        showError('Failed to return book');
    }
}

// ==================== UTILITIES ====================

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

function showSuccess(message) {
    alert('✓ ' + message);
}

function showError(message) {
    alert('✗ ' + message);
}
