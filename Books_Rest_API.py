from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# JSON files to store data
BOOKS_FILE = 'books.json'
AUTHORS_FILE = 'authors.json'
BORROWINGS_FILE = 'borrowings.json'

# Initialize JSON files if they don't exist
def init_data_files():
    for file in [BOOKS_FILE, AUTHORS_FILE, BORROWINGS_FILE]:
        if not os.path.exists(file):
            with open(file, 'w') as f:
                json.dump([], f)

# Generic load function
def load_data(filename):
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except:
        return []

# Generic save function
def save_data(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4)

# Initialize data files
init_data_files()

# Route: Serve the main HTML page
@app.route('/')
def index():
    return render_template('index.html')

# ==================== BOOKS ENDPOINTS ====================

# Get all books
@app.route('/api/books', methods=['GET'])
def get_books():
    books = load_data(BOOKS_FILE)
    return jsonify({
        'success': True,
        'data': books,
        'count': len(books)
    })

# Get a single book by ID
@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    books = load_data(BOOKS_FILE)
    book = next((b for b in books if b['id'] == book_id), None)
    
    if book:
        return jsonify({
            'success': True,
            'data': book
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Book not found'
        }), 404

# Create a new book
@app.route('/api/books', methods=['POST'])
def create_book():
    data = request.get_json()
    
    required_fields = ['title', 'author_id', 'isbn']
    if not data or not all(field in data for field in required_fields):
        return jsonify({
            'success': False,
            'message': 'Title, author_id, and ISBN are required'
        }), 400
    
    books = load_data(BOOKS_FILE)
    
    # Check if ISBN already exists
    if any(b['isbn'] == data['isbn'] for b in books):
        return jsonify({
            'success': False,
            'message': 'Book with this ISBN already exists'
        }), 400
    
    new_id = max([b['id'] for b in books], default=0) + 1
    
    new_book = {
        'id': new_id,
        'title': data['title'],
        'author_id': data['author_id'],
        'isbn': data['isbn'],
        'genre': data.get('genre', 'General'),
        'publication_year': data.get('publication_year', None),
        'copies_available': data.get('copies_available', 1),
        'total_copies': data.get('total_copies', 1),
        'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    books.append(new_book)
    save_data(BOOKS_FILE, books)
    
    return jsonify({
        'success': True,
        'message': 'Book created successfully',
        'data': new_book
    }), 201

# Update a book
@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.get_json()
    books = load_data(BOOKS_FILE)
    
    book_index = next((i for i, b in enumerate(books) if b['id'] == book_id), None)
    
    if book_index is None:
        return jsonify({
            'success': False,
            'message': 'Book not found'
        }), 404
    
    # Update book fields
    updatable_fields = ['title', 'author_id', 'isbn', 'genre', 'publication_year', 'copies_available', 'total_copies']
    for field in updatable_fields:
        if field in data:
            books[book_index][field] = data[field]
    
    books[book_index]['updated_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    save_data(BOOKS_FILE, books)
    
    return jsonify({
        'success': True,
        'message': 'Book updated successfully',
        'data': books[book_index]
    })

# Delete a book
@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    books = load_data(BOOKS_FILE)
    
    book_index = next((i for i, b in enumerate(books) if b['id'] == book_id), None)
    
    if book_index is None:
        return jsonify({
            'success': False,
            'message': 'Book not found'
        }), 404
    
    deleted_book = books.pop(book_index)
    save_data(BOOKS_FILE, books)
    
    return jsonify({
        'success': True,
        'message': 'Book deleted successfully',
        'data': deleted_book
    })

# Search books by title or genre
@app.route('/api/books/search', methods=['GET'])
def search_books():
    query = request.args.get('q', '').lower()
    genre = request.args.get('genre', '').lower()
    
    books = load_data(BOOKS_FILE)
    results = books
    
    if query:
        results = [b for b in results if query in b['title'].lower()]
    
    if genre:
        results = [b for b in results if genre in b['genre'].lower()]
    
    return jsonify({
        'success': True,
        'data': results,
        'count': len(results)
    })

# ==================== AUTHORS ENDPOINTS ====================

# Get all authors
@app.route('/api/authors', methods=['GET'])
def get_authors():
    authors = load_data(AUTHORS_FILE)
    return jsonify({
        'success': True,
        'data': authors,
        'count': len(authors)
    })

# Get a single author by ID
@app.route('/api/authors/<int:author_id>', methods=['GET'])
def get_author(author_id):
    authors = load_data(AUTHORS_FILE)
    author = next((a for a in authors if a['id'] == author_id), None)
    
    if author:
        return jsonify({
            'success': True,
            'data': author
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Author not found'
        }), 404

# Create a new author
@app.route('/api/authors', methods=['POST'])
def create_author():
    data = request.get_json()
    
    if not data or 'name' not in data:
        return jsonify({
            'success': False,
            'message': 'Author name is required'
        }), 400
    
    authors = load_data(AUTHORS_FILE)
    
    new_id = max([a['id'] for a in authors], default=0) + 1
    
    new_author = {
        'id': new_id,
        'name': data['name'],
        'bio': data.get('bio', ''),
        'birth_year': data.get('birth_year', None),
        'nationality': data.get('nationality', ''),
        'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    authors.append(new_author)
    save_data(AUTHORS_FILE, authors)
    
    return jsonify({
        'success': True,
        'message': 'Author created successfully',
        'data': new_author
    }), 201

# Get books by a specific author
@app.route('/api/authors/<int:author_id>/books', methods=['GET'])
def get_books_by_author(author_id):
    books = load_data(BOOKS_FILE)
    author_books = [b for b in books if b['author_id'] == author_id]
    
    return jsonify({
        'success': True,
        'data': author_books,
        'count': len(author_books)
    })

# ==================== BORROWING ENDPOINTS ====================

# Get all borrowings
@app.route('/api/borrowings', methods=['GET'])
def get_borrowings():
    borrowings = load_data(BORROWINGS_FILE)
    return jsonify({
        'success': True,
        'data': borrowings,
        'count': len(borrowings)
    })

# Borrow a book
@app.route('/api/borrowings', methods=['POST'])
def borrow_book():
    data = request.get_json()
    
    required_fields = ['book_id', 'borrower_name']
    if not data or not all(field in data for field in required_fields):
        return jsonify({
            'success': False,
            'message': 'book_id and borrower_name are required'
        }), 400
    
    books = load_data(BOOKS_FILE)
    book_index = next((i for i, b in enumerate(books) if b['id'] == data['book_id']), None)
    
    if book_index is None:
        return jsonify({
            'success': False,
            'message': 'Book not found'
        }), 404
    
    if books[book_index]['copies_available'] <= 0:
        return jsonify({
            'success': False,
            'message': 'No copies available for borrowing'
        }), 400
    
    borrowings = load_data(BORROWINGS_FILE)
    
    new_id = max([br['id'] for br in borrowings], default=0) + 1
    borrow_date = datetime.now()
    due_date = borrow_date + timedelta(days=14)  # 2 weeks loan period
    
    new_borrowing = {
        'id': new_id,
        'book_id': data['book_id'],
        'borrower_name': data['borrower_name'],
        'borrower_email': data.get('borrower_email', ''),
        'borrow_date': borrow_date.strftime('%Y-%m-%d'),
        'due_date': due_date.strftime('%Y-%m-%d'),
        'return_date': None,
        'status': 'borrowed'
    }
    
    # Decrease available copies
    books[book_index]['copies_available'] -= 1
    save_data(BOOKS_FILE, books)
    
    borrowings.append(new_borrowing)
    save_data(BORROWINGS_FILE, borrowings)
    
    return jsonify({
        'success': True,
        'message': 'Book borrowed successfully',
        'data': new_borrowing
    }), 201

# Return a book
@app.route('/api/borrowings/<int:borrowing_id>/return', methods=['PUT'])
def return_book(borrowing_id):
    borrowings = load_data(BORROWINGS_FILE)
    books = load_data(BOOKS_FILE)
    
    borrowing_index = next((i for i, br in enumerate(borrowings) if br['id'] == borrowing_id), None)
    
    if borrowing_index is None:
        return jsonify({
            'success': False,
            'message': 'Borrowing record not found'
        }), 404
    
    if borrowings[borrowing_index]['status'] == 'returned':
        return jsonify({
            'success': False,
            'message': 'Book already returned'
        }), 400
    
    # Update borrowing record
    borrowings[borrowing_index]['return_date'] = datetime.now().strftime('%Y-%m-%d')
    borrowings[borrowing_index]['status'] = 'returned'
    
    # Increase available copies
    book_id = borrowings[borrowing_index]['book_id']
    book_index = next((i for i, b in enumerate(books) if b['id'] == book_id), None)
    
    if book_index is not None:
        books[book_index]['copies_available'] += 1
        save_data(BOOKS_FILE, books)
    
    save_data(BORROWINGS_FILE, borrowings)
    
    return jsonify({
        'success': True,
        'message': 'Book returned successfully',
        'data': borrowings[borrowing_index]
    })

# Get overdue books
@app.route('/api/borrowings/overdue', methods=['GET'])
def get_overdue_borrowings():
    borrowings = load_data(BORROWINGS_FILE)
    today = datetime.now().strftime('%Y-%m-%d')
    
    overdue = [
        br for br in borrowings 
        if br['status'] == 'borrowed' and br['due_date'] < today
    ]
    
    return jsonify({
        'success': True,
        'data': overdue,
        'count': len(overdue)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
