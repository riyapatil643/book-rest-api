const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory books storage (no DB)
let books = [
  { id: 1, title: "Atomic Habits", author: "James Clear" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho" }
];

// Helper: generate next ID safely
function getNextId() {
  if (books.length === 0) return 1;
  return Math.max(...books.map((b) => b.id)) + 1;
}

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Books REST API 🚀",
    endpoints: {
      getAllBooks: "GET /books",
      addBook: "POST /books",
      updateBook: "PUT /books/:id",
      deleteBook: "DELETE /books/:id"
    }
  });
});

// GET /books - return all books
app.get("/books", (req, res) => {
  res.status(200).json({
    total: books.length,
    books: books
  });
});

// POST /books - add a new book
app.post("/books", (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      error: "Both title and author are required."
    });
  }

  const newBook = {
    id: getNextId(),
    title: title.trim(),
    author: author.trim()
  };

  books.push(newBook);

  res.status(201).json({
    message: "Book added successfully ✅",
    book: newBook
  });
});

// PUT /books/:id - update a book by ID
app.put("/books/:id", (req, res) => {
  const bookId = Number(req.params.id);
  const { title, author } = req.body;

  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      error: "Book not found ❌"
    });
  }

  if (title) books[bookIndex].title = title.trim();
  if (author) books[bookIndex].author = author.trim();

  res.status(200).json({
    message: "Book updated successfully ✏️",
    book: books[bookIndex]
  });
});

// DELETE /books/:id - remove a book
app.delete("/books/:id", (req, res) => {
  const bookId = Number(req.params.id);

  const bookExists = books.some((b) => b.id === bookId);

  if (!bookExists) {
    return res.status(404).json({
      error: "Book not found ❌"
    });
  }

  books = books.filter((b) => b.id !== bookId);

  res.status(200).json({
    message: "Book deleted successfully 🗑️"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
