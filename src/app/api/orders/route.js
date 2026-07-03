import { NextResponse } from "next/server";
import { getAllOrders, addOrder } from "@/lib/ordersDb";

export async function GET() {
  const orders = await getAllOrders();
  return NextResponse.json(orders);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newOrder = await addOrder(body);

    if (newOrder) {
      return NextResponse.json(newOrder, { status: 201 });
    } else {
      return NextResponse.json({ error: "Sipariş veritabanına kaydedilemedi" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating order in API route", error);
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
}
