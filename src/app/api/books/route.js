import { NextResponse } from "next/server";
import { getAllBooks, addBook } from "@/lib/booksDb";

export async function GET() {
  const books = await getAllBooks();
  return NextResponse.json(books);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newBook = await addBook(body);

    if (newBook) {
      return NextResponse.json(newBook, { status: 201 });
    } else {
      return NextResponse.json({ error: "Veritabanına kaydedilemedi" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
}
