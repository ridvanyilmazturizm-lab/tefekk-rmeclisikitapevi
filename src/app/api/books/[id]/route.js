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
    console.error("Error reading books data", error);
    return [];
  }
}

// Helper to write books data file
async function writeBooksData(books) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(books, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing books data", error);
    return false;
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const books = await readBooksData();

    const bookIndex = books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
      return NextResponse.json({ error: "Kitap bulunamadı" }, { status: 404 });
    }

    const updatedBook = {
      ...books[bookIndex],
      title: body.title !== undefined ? body.title : books[bookIndex].title,
      author: body.author !== undefined ? body.author : books[bookIndex].author,
      price: body.price !== undefined ? parseFloat(body.price) : books[bookIndex].price,
      category: body.category !== undefined ? body.category : books[bookIndex].category,
      coverImage: body.coverImage !== undefined ? body.coverImage : books[bookIndex].coverImage,
      description: body.description !== undefined ? body.description : books[bookIndex].description,
      stock: body.stock !== undefined ? parseInt(body.stock) : books[bookIndex].stock,
      rating: body.rating !== undefined ? parseFloat(body.rating) : books[bookIndex].rating,
      pages: body.pages !== undefined ? parseInt(body.pages) : books[bookIndex].pages,
      publisher: body.publisher !== undefined ? body.publisher : books[bookIndex].publisher,
    };

    books[bookIndex] = updatedBook;
    const success = await writeBooksData(books);

    if (success) {
      return NextResponse.json(updatedBook);
    } else {
      return NextResponse.json({ error: "Veri güncellenemedi" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Geçersiz istek gövdesi" }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const books = await readBooksData();

    const bookIndex = books.findIndex((b) => b.id === id);
    if (bookIndex === -1) {
      return NextResponse.json({ error: "Kitap bulunamadı" }, { status: 404 });
    }

    books.splice(bookIndex, 1);
    const success = await writeBooksData(books);

    if (success) {
      return NextResponse.json({ success: true, message: "Kitap başarıyla silindi" });
    } else {
      return NextResponse.json({ error: "Veri silinemedi" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "İstek işlenirken hata oluştu" }, { status: 500 });
  }
}
