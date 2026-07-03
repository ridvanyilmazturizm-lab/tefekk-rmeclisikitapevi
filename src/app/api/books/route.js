import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "books.json");

// Helper to read books data file
async function readBooksData() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading books data file", error);
    return [];
  }
}

// Helper to write books data file
async function writeBooksData(books) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(books, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing books data file", error);
    return false;
  }
}

export async function GET() {
  const books = await readBooksData();
  return NextResponse.json(books);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const books = await readBooksData();

    const newBook = {
      id: String(Date.now()),
      title: body.title || "İsimsiz Kitap",
      author: body.author || "Bilinmeyen Yazar",
      price: parseFloat(body.price) || 0,
      category: body.category || "Genel",
      coverImage: body.coverImage || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
      description: body.description || "",
      stock: parseInt(body.stock) || 0,
      rating: parseFloat(body.rating) || 5.0,
      pages: parseInt(body.pages) || 0,
      publisher: body.publisher || "Özel Yayınlar",
    };

    books.push(newBook);
    const success = await writeBooksData(books);

    if (success) {
      return NextResponse.json(newBook, { status: 201 });
    } else {
      return NextResponse.json({ error: "Veritabanına yazılamadı" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Geçersiz istek gövdesi" }, { status: 400 });
  }
}
