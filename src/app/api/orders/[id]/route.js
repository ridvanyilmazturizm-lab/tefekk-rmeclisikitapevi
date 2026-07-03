import { NextResponse } from "next/server";
import { updateOrder } from "@/lib/ordersDb";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedOrder = await updateOrder(id, body);

    if (!updatedOrder) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order in API route", error);
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
}
