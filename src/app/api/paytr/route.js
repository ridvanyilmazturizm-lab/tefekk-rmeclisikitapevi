import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const { cart, customer, address, paymentMethod } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Sepet boş olamaz" }, { status: 400 });
    }

    // PayTR Credentials (fallbacks for development simulation)
    const merchant_id = process.env.PAYTR_MERCHANT_ID || "MOCK_MERCHANT_ID";
    const merchant_key = process.env.PAYTR_MERCHANT_KEY || "MOCK_MERCHANT_KEY";
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT || "MOCK_MERCHANT_SALT";

    // Convert total price to Kuruş (cents) - e.g. 100.50 TL -> 10050
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const payment_amount = Math.round(totalAmount * 100);

    // Dynamic order ID
    const merchant_oid = "RY-" + Date.now();

    // Prepare User Basket as format: [ [name, price, quantity], ... ]
    const basketItems = cart.map((item) => [item.title, String(item.price), item.quantity]);
    const user_basket = Buffer.from(JSON.stringify(basketItems)).toString("base64");

    const user_ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const email = customer.email || "test@customer.com";
    const user_name = customer.name || "Test Müşteri";
    const user_address = `${address.street}, ${address.city}, ${address.country}`;
    const user_phone = customer.phone || "05555555555";

    const merchant_ok_url = `${request.nextUrl.origin}/checkout/success?oid=${merchant_oid}`;
    const merchant_fail_url = `${request.nextUrl.origin}/checkout/fail?oid=${merchant_oid}`;

    // Other PayTR Configuration Parameters
    const no_installment = "0"; // Enable installment payments
    const max_installment = "12";
    const currency = "TL";
    const test_mode = process.env.NODE_ENV === "development" ? "1" : "0";
    const debug_on = "1";
    const timeout_limit = "30";

    // Check if real keys are available
    const isMock =
      merchant_id === "MOCK_MERCHANT_ID" ||
      merchant_key === "MOCK_MERCHANT_KEY" ||
      merchant_salt === "MOCK_MERCHANT_SALT";

    if (isMock) {
      console.warn("PayTR credentials not found in env. Running in simulation mode.");
      // Return simulation token
      return NextResponse.json({
        success: true,
        token: "simulated_paytr_token_" + Date.now(),
        isSimulation: true,
        merchant_oid,
        totalAmount,
      });
    }

    // Generate PayTR Token Signature
    // Signature Formula: hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode + merchant_salt
    const hash_str =
      merchant_id +
      user_ip +
      merchant_oid +
      email +
      payment_amount +
      user_basket +
      no_installment +
      max_installment +
      currency +
      test_mode +
      merchant_salt;

    const paytr_token = crypto
      .createHmac("sha256", merchant_key)
      .update(hash_str)
      .digest("base64");

    // Send payload to PayTR endpoint to acquire actual secure iframe token
    const formData = new URLSearchParams();
    formData.append("merchant_id", merchant_id);
    formData.append("user_ip", user_ip);
    formData.append("merchant_oid", merchant_oid);
    formData.append("email", email);
    formData.append("payment_amount", String(payment_amount));
    formData.append("paytr_token", paytr_token);
    formData.append("user_basket", user_basket);
    formData.append("debug_on", debug_on);
    formData.append("no_installment", no_installment);
    formData.append("max_installment", max_installment);
    formData.append("user_name", user_name);
    formData.append("user_address", user_address);
    formData.append("user_phone", user_phone);
    formData.append("merchant_ok_url", merchant_ok_url);
    formData.append("merchant_fail_url", merchant_fail_url);
    formData.append("timeout_limit", timeout_limit);
    formData.append("currency", currency);
    formData.append("test_mode", test_mode);

    const response = await fetch("https://www.paytr.com/odeme/guvenli", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const result = await response.json();

    if (result.status === "success") {
      return NextResponse.json({
        success: true,
        token: result.token,
        isSimulation: false,
        merchant_oid,
        totalAmount,
      });
    } else {
      return NextResponse.json(
        { error: result.reason || "PayTR token alınamadı" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("PayTR API Route Error:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu" }, { status: 500 });
  }
}
