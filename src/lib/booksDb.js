import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "books.json");

// Connection pool configuration
const connectionString = 
  process.env.POSTGRES_URL || 
  process.env.POSTGRES_PRISMA_URL || 
  process.env.DATABASE_URL || 
  process.env.STORAGE_URL;
let pool = null;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

// Helper to map DB row to API JSON schema
function mapRowToBook(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    title: row.title,
    author: row.author,
    price: parseFloat(row.price) || 0,
    category: row.category,
    coverImage: row.cover_image,
    description: row.description || "",
    stock: parseInt(row.stock) || 0,
    rating: parseFloat(row.rating) || 5.0,
    pages: parseInt(row.pages) || 0,
    publisher: row.publisher || "",
  };
}

// ----------------------------------------------------
// Fallback JSON File Actions
// ----------------------------------------------------
async function readBooksJson() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file database", error);
    return [];
  }
}

async function writeBooksJson(books) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(books, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing JSON file database", error);
    return false;
  }
}

// ----------------------------------------------------
// DB Initializer & Auto-Migration
// ----------------------------------------------------
export async function initDb() {
  if (!pool) return false;

  try {
    // 1. Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        cover_image TEXT,
        description TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        rating NUMERIC(3,2) DEFAULT 5.0,
        pages INTEGER DEFAULT 0,
        publisher VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Check if table is empty to auto-seed default products
    const checkRes = await pool.query("SELECT COUNT(*) FROM books");
    const count = parseInt(checkRes.rows[0].count);

    if (count === 0) {
      console.log("Database table is empty. Seeding default books from books.json...");
      const defaultBooks = await readBooksJson();
      for (const book of defaultBooks) {
        await pool.query(
          `INSERT INTO books 
           (id, title, author, price, category, cover_image, description, stock, rating, pages, publisher)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            book.id,
            book.title,
            book.author,
            book.price,
            book.category,
            book.coverImage,
            book.description,
            book.stock,
            book.rating || 5.0,
            book.pages || 0,
            book.publisher || "",
          ]
        );
      }
      console.log("Seeding complete!");
    }
    return true;
  } catch (error) {
    console.error("Error initializing database", error);
    return false;
  }
}

// ----------------------------------------------------
// Public CRUD Exports
// ----------------------------------------------------

export async function getAllBooks() {
  if (pool) {
    try {
      await initDb(); // Lazy load / ensure table exists
      const res = await pool.query("SELECT * FROM books ORDER BY created_at DESC");
      return res.rows.map(mapRowToBook);
    } catch (error) {
      console.error("Postgres error, falling back to JSON read:", error);
      // Fallback on query failure
    }
  }
  return readBooksJson();
}

export async function getBookById(id) {
  if (pool) {
    try {
      await initDb();
      const res = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
      if (res.rows.length > 0) {
        return mapRowToBook(res.rows[0]);
      }
      return null;
    } catch (error) {
      console.error("Postgres error, falling back to JSON read ID:", error);
    }
  }
  const books = await readBooksJson();
  return books.find((b) => b.id === String(id)) || null;
}

export async function addBook(bookData) {
  const id = bookData.id || String(Date.now());
  const rating = parseFloat(bookData.rating) || 5.0;

  if (pool) {
    try {
      await initDb();
      const query = `
        INSERT INTO books 
        (id, title, author, price, category, cover_image, description, stock, rating, pages, publisher)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      const values = [
        id,
        bookData.title || "İsimsiz Kitap",
        bookData.author || "Bilinmeyen Yazar",
        parseFloat(bookData.price) || 0,
        bookData.category || "Genel",
        bookData.coverImage || "",
        bookData.description || "",
        parseInt(bookData.stock) || 0,
        rating,
        parseInt(bookData.pages) || 0,
        bookData.publisher || "",
      ];
      const res = await pool.query(query, values);
      return mapRowToBook(res.rows[0]);
    } catch (error) {
      console.error("Postgres error, writing to JSON fallback:", error);
    }
  }

  // Fallback
  const books = await readBooksJson();
  const newBook = {
    id,
    title: bookData.title || "İsimsiz Kitap",
    author: bookData.author || "Bilinmeyen Yazar",
    price: parseFloat(bookData.price) || 0,
    category: bookData.category || "Genel",
    coverImage: bookData.coverImage || "",
    description: bookData.description || "",
    stock: parseInt(bookData.stock) || 0,
    rating,
    pages: parseInt(bookData.pages) || 0,
    publisher: bookData.publisher || "",
  };
  books.push(newBook);
  await writeBooksJson(books);
  return newBook;
}

export async function updateBook(id, bookData) {
  if (pool) {
    try {
      await initDb();
      // Fetch existing
      const existing = await getBookById(id);
      if (!existing) return null;

      const query = `
        UPDATE books 
        SET title=$1, author=$2, price=$3, category=$4, cover_image=$5, description=$6, stock=$7, rating=$8, pages=$9, publisher=$10
        WHERE id=$11
        RETURNING *
      `;
      const values = [
        bookData.title !== undefined ? bookData.title : existing.title,
        bookData.author !== undefined ? bookData.author : existing.author,
        bookData.price !== undefined ? parseFloat(bookData.price) : existing.price,
        bookData.category !== undefined ? bookData.category : existing.category,
        bookData.coverImage !== undefined ? bookData.coverImage : existing.coverImage,
        bookData.description !== undefined ? bookData.description : existing.description,
        bookData.stock !== undefined ? parseInt(bookData.stock) : existing.stock,
        bookData.rating !== undefined ? parseFloat(bookData.rating) : existing.rating,
        bookData.pages !== undefined ? parseInt(bookData.pages) : existing.pages,
        bookData.publisher !== undefined ? bookData.publisher : existing.publisher,
        id,
      ];
      const res = await pool.query(query, values);
      return mapRowToBook(res.rows[0]);
    } catch (error) {
      console.error("Postgres error, updating JSON fallback:", error);
    }
  }

  // Fallback
  const books = await readBooksJson();
  const bookIndex = books.findIndex((b) => b.id === String(id));
  if (bookIndex === -1) return null;

  const updatedBook = {
    ...books[bookIndex],
    title: bookData.title !== undefined ? bookData.title : books[bookIndex].title,
    author: bookData.author !== undefined ? bookData.author : books[bookIndex].author,
    price: bookData.price !== undefined ? parseFloat(bookData.price) : books[bookIndex].price,
    category: bookData.category !== undefined ? bookData.category : books[bookIndex].category,
    coverImage: bookData.coverImage !== undefined ? bookData.coverImage : books[bookIndex].coverImage,
    description: bookData.description !== undefined ? bookData.description : books[bookIndex].description,
    stock: bookData.stock !== undefined ? parseInt(bookData.stock) : books[bookIndex].stock,
    rating: bookData.rating !== undefined ? parseFloat(bookData.rating) : books[bookIndex].rating,
    pages: bookData.pages !== undefined ? parseInt(bookData.pages) : books[bookIndex].pages,
    publisher: bookData.publisher !== undefined ? bookData.publisher : books[bookIndex].publisher,
  };

  books[bookIndex] = updatedBook;
  await writeBooksJson(books);
  return updatedBook;
}

export async function deleteBook(id) {
  if (pool) {
    try {
      await initDb();
      const res = await pool.query("DELETE FROM books WHERE id = $1 RETURNING *", [id]);
      if (res.rows.length > 0) return true;
    } catch (error) {
      console.error("Postgres error, deleting JSON fallback:", error);
    }
  }

  // Fallback
  const books = await readBooksJson();
  const bookIndex = books.findIndex((b) => b.id === String(id));
  if (bookIndex === -1) return false;

  books.splice(bookIndex, 1);
  await writeBooksJson(books);
  return true;
}
