import { NextResponse } from "next/server";
import { updateBook, deleteBook } from "@/lib/booksDb";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedBook = await updateBook(id, body);

    if (!updatedBook) {
      return NextResponse.json({ error: "Kitap bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(updatedBook);
  } catch (error) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const success = await deleteBook(id);

    if (success) {
      return NextResponse.json({ success: true, message: "Kitap başarıyla silindi" });
    } else {
      return NextResponse.json({ error: "Kitap bulunamadı veya silinemedi" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "İstek işlenirken hata oluştu" }, { status: 500 });
  }
}
