import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "orders.json");

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
function mapRowToOrder(row) {
  if (!row) return null;
  let parsedItems = [];
  try {
    parsedItems = typeof row.items === "string" ? JSON.parse(row.items) : row.items;
  } catch (e) {
    console.error("Error parsing order items JSON", e);
  }

  return {
    id: String(row.id),
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    addressStreet: row.address_street,
    addressCity: row.address_city,
    addressZip: row.address_zip || "",
    shippingMethod: row.shipping_method,
    paymentMethod: row.payment_method,
    items: parsedItems,
    totalPrice: parseFloat(row.total_price) || 0,
    orderStatus: row.order_status,
    paymentStatus: row.payment_status,
    trackingNumber: row.tracking_number || "",
    createdAt: row.created_at,
  };
}

// ----------------------------------------------------
// Fallback JSON File Actions
// ----------------------------------------------------
async function readOrdersJson() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

async function writeOrdersJson(orders) {
  try {
    // Ensure directory exists
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(orders, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing JSON file database for orders", error);
    return false;
  }
}

// ----------------------------------------------------
// DB Initializer & Auto-Migration
// ----------------------------------------------------
export async function initOrdersDb() {
  if (!pool) return false;

  try {
    // Create table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(255) NOT NULL,
        address_street TEXT NOT NULL,
        address_city VARCHAR(255) NOT NULL,
        address_zip VARCHAR(50),
        shipping_method VARCHAR(100) NOT NULL,
        payment_method VARCHAR(100) NOT NULL,
        items TEXT NOT NULL, -- Stored as stringified JSON
        total_price NUMERIC(10,2) NOT NULL,
        order_status VARCHAR(100) NOT NULL DEFAULT 'Hazırlanıyor',
        payment_status VARCHAR(100) NOT NULL DEFAULT 'Ödeme Bekleniyor',
        tracking_number VARCHAR(255) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return true;
  } catch (error) {
    console.error("Error initializing orders database", error);
    return false;
  }
}

// ----------------------------------------------------
// Public CRUD Exports
// ----------------------------------------------------

export async function getAllOrders() {
  if (pool) {
    try {
      await initOrdersDb();
      const res = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
      return res.rows.map(mapRowToOrder);
    } catch (error) {
      console.error("Postgres error on getAllOrders, falling back to JSON:", error);
    }
  }
  return readOrdersJson();
}

export async function addOrder(orderData) {
  const id = orderData.id || "TM-" + Date.now();
  const paymentStatus = orderData.paymentMethod === "cod" ? "Kapıda Ödeme" : "Havale Bekleniyor";
  const stringifiedItems = JSON.stringify(orderData.items);

  if (pool) {
    try {
      await initOrdersDb();
      const query = `
        INSERT INTO orders 
        (id, customer_name, customer_email, customer_phone, address_street, address_city, address_zip, shipping_method, payment_method, items, total_price, order_status, payment_status, tracking_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;
      const values = [
        id,
        orderData.customerName || "",
        orderData.customerEmail || "",
        orderData.customerPhone || "",
        orderData.addressStreet || "",
        orderData.addressCity || "",
        orderData.addressZip || "",
        orderData.shippingMethod || "",
        orderData.paymentMethod || "",
        stringifiedItems,
        parseFloat(orderData.totalPrice) || 0,
        orderData.orderStatus || "Hazırlanıyor",
        paymentStatus,
        orderData.trackingNumber || "",
      ];
      const res = await pool.query(query, values);
      return mapRowToOrder(res.rows[0]);
    } catch (error) {
      console.error("Postgres error on addOrder, falling back to JSON:", error);
    }
  }

  // Fallback
  const orders = await readOrdersJson();
  const newOrder = {
    id,
    customerName: orderData.customerName || "",
    customerEmail: orderData.customerEmail || "",
    customerPhone: orderData.customerPhone || "",
    addressStreet: orderData.addressStreet || "",
    addressCity: orderData.addressCity || "",
    addressZip: orderData.addressZip || "",
    shippingMethod: orderData.shippingMethod || "",
    paymentMethod: orderData.paymentMethod || "",
    items: orderData.items || [],
    totalPrice: parseFloat(orderData.totalPrice) || 0,
    orderStatus: orderData.orderStatus || "Hazırlanıyor",
    paymentStatus,
    trackingNumber: orderData.trackingNumber || "",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder); // Add to beginning
  await writeOrdersJson(orders);
  return newOrder;
}

export async function updateOrder(id, updateData) {
  if (pool) {
    try {
      await initOrdersDb();
      // Fetch existing
      const resExist = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
      if (resExist.rows.length === 0) return null;
      const existing = resExist.rows[0];

      const query = `
        UPDATE orders 
        SET order_status=$1, payment_status=$2, tracking_number=$3
        WHERE id=$4
        RETURNING *
      `;
      const values = [
        updateData.orderStatus !== undefined ? updateData.orderStatus : existing.order_status,
        updateData.paymentStatus !== undefined ? updateData.paymentStatus : existing.payment_status,
        updateData.trackingNumber !== undefined ? updateData.trackingNumber : existing.tracking_number,
        id,
      ];
      const res = await pool.query(query, values);
      return mapRowToOrder(res.rows[0]);
    } catch (error) {
      console.error("Postgres error on updateOrder, falling back to JSON:", error);
    }
  }

  // Fallback
  const orders = await readOrdersJson();
  const orderIndex = orders.findIndex((o) => o.id === String(id));
  if (orderIndex === -1) return null;

  const updatedOrder = {
    ...orders[orderIndex],
    orderStatus: updateData.orderStatus !== undefined ? updateData.orderStatus : orders[orderIndex].orderStatus,
    paymentStatus: updateData.paymentStatus !== undefined ? updateData.paymentStatus : orders[orderIndex].paymentStatus,
    trackingNumber: updateData.trackingNumber !== undefined ? updateData.trackingNumber : orders[orderIndex].trackingNumber,
  };

  orders[orderIndex] = updatedOrder;
  await writeOrdersJson(orders);
  return updatedOrder;
}
