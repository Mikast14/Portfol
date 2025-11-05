import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    const connection = await connectDB();
    
    // Get database name from connection
    const dbName = connection.db?.databaseName || "Unknown";
    
    // Get collection name from model
    const collectionName = mongoose.models.TextEntry?.collection?.collectionName || "textentries";
    
    // Count documents in collection
    const count = await mongoose.models.TextEntry?.countDocuments() || 0;

    return NextResponse.json({
      ok: true,
      info: {
        database: dbName,
        collection: collectionName,
        fullPath: `${dbName}.${collectionName}`,
        documentCount: count,
        connectionString: process.env.MONGODB_URI?.replace(/\/\/[^@]+@/, "//***@") || "Not set"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

