# 📚 Library Management REST API

A comprehensive Library Management System built with Flask that provides REST APIs for managing books, authors, and borrowing records. Features a modern, responsive web interface with real-time updates.

![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- 📖 **Books Management**: Add, update, delete, and search books
- ✍️ **Authors Management**: Manage author profiles and view their books
- 📋 **Borrowing System**: Track book borrowings with automatic due dates
- 🔍 **Advanced Search**: Filter books by title, genre, and availability
- ⏰ **Overdue Tracking**: Automatically identify overdue borrowings
- 🎨 **Modern UI**: Responsive design with gradient themes
- 🔄 **Real-time Updates**: Dynamic interface with AJAX requests
- 📊 **Copy Tracking**: Monitor available vs total copies

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/library-management-api.git
cd library-management-api
```

2. **Install dependencies**
```bash
pip install flask flask-cors
```

3. **Run the application**
```bash
python Books_Rest_API.py
```

4. **Access the application**
Open your browser and navigate to:
```
http://localhost:5000
```

## 📁 Project Structure

```
library-management-api/
│
├── Books_Rest_API.py          # Main Flask application with REST API endpoints
├── README.md                  # Project documentation
├── requirements.txt           # Python dependencies
├── .gitignore                # Git ignore rules
│
├── templates/
│   └── index.html            # Main HTML template
│
├── static/
│   ├── style.css             # Styling and themes
│   └── script.js             # Frontend JavaScript logic
│
├── authors.json              # Authors database (auto-generated)
├── books.json                # Books database (auto-generated)
└── borrowings.json           # Borrowings records (auto-generated)
```

## 🔌 API Endpoints

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/<id>` | Get a specific book |
| POST | `/api/books` | Create a new book |
| PUT | `/api/books/<id>` | Update a book |
| DELETE | `/api/books/<id>` | Delete a book |
| GET | `/api/books/search?q=<query>&genre=<genre>` | Search books |

### Authors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/authors` | Get all authors |
| GET | `/api/authors/<id>` | Get a specific author |
| POST | `/api/authors` | Create a new author |
| GET | `/api/authors/<id>/books` | Get books by author |

### Borrowings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/borrowings` | Get all borrowings |
| POST | `/api/borrowings` | Borrow a book |
| PUT | `/api/borrowings/<id>/return` | Return a book |
| GET | `/api/borrowings/overdue` | Get overdue borrowings |

## 📝 API Usage Examples

### Create a Book
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author_id": 1,
    "isbn": "978-0743273565",
    "genre": "Fiction",
    "publication_year": 1925,
    "total_copies": 3,
    "copies_available": 3
  }'
```

### Search Books
```bash
curl http://localhost:5000/api/books/search?q=gatsby&genre=Fiction
```

### Borrow a Book
```bash
curl -X POST http://localhost:5000/api/borrowings \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": 1,
    "borrower_name": "John Doe",
    "borrower_email": "john@example.com"
  }'
```

### Return a Book
```bash
curl -X PUT http://localhost:5000/api/borrowings/1/return
```

## 🎨 Features Walkthrough

### Books Management
- Add new books with ISBN validation
- Track available copies vs total copies
- Search and filter by genre
- View book availability status

### Authors Management
- Create author profiles with biographical info
- View all books by a specific author
- Track nationality and birth year

### Borrowing System
- Automatic 14-day loan period
- Email tracking for borrowers
- Overdue detection
- Return book functionality
- Available copies automatically updated

## 🛠️ Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data Storage**: JSON files
- **API**: RESTful architecture
- **CORS**: Flask-CORS for cross-origin requests

## 📦 Data Models

### Book
```json
{
  "id": 1,
  "title": "Book Title",
  "author_id": 1,
  "isbn": "978-1234567890",
  "genre": "Fiction",
  "publication_year": 2024,
  "copies_available": 3,
  "total_copies": 5,
  "created_at": "2024-01-15 11:00:00"
}
```

### Author
```json
{
  "id": 1,
  "name": "Author Name",
  "bio": "Author biography",
  "birth_year": 1970,
  "nationality": "American",
  "created_at": "2024-01-15 10:30:00"
}
```

### Borrowing
```json
{
  "id": 1,
  "book_id": 1,
  "borrower_name": "John Doe",
  "borrower_email": "john@example.com",
  "borrow_date": "2024-01-20",
  "due_date": "2024-02-03",
  "return_date": null,
  "status": "borrowed"
}
```

## 🔧 Configuration

The application runs on `localhost:5000` by default. To change the host or port, modify the last line in `Books_Rest_API.py`:

```python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Savan Thakar**
- GitHub: [@yourusername](https://github.com/Traja9)

## 🙏 Acknowledgments

- Flask documentation
- REST API best practices
- Material Design inspiration

## 📸 Screenshots

### Books Management
![Books Page](screenshots/books.png)

### Borrowing Records
![Borrowings Page](screenshots/borrowings.png)

---

⭐ Star this repo if you find it helpful!
