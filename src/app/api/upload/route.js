import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || "upload.jpg";

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      // Stream the body directly to Vercel Blob
      const blob = await put(filename, request.body, {
        access: "public",
      });
      return NextResponse.json({ url: blob.url });
    } catch (error) {
      console.error("Vercel Blob upload failed:", error);
      return NextResponse.json({ error: "Cloud storage upload failed" }, { status: 500 });
    }
  } else {
    // Fallback to local storage (public/uploads/)
    try {
      const arrayBuffer = await request.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      // Ensure directory exists
      await fs.mkdir(uploadsDir, { recursive: true });

      // Clean the filename to be safe
      const safeFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(uploadsDir, safeFilename);

      await fs.writeFile(filePath, buffer);

      // Return the public web URL path
      return NextResponse.json({ url: `/uploads/${safeFilename}` });
    } catch (error) {
      console.error("Local file upload failed:", error);
      return NextResponse.json({ error: "Local storage upload failed" }, { status: 500 });
    }
  }
}
