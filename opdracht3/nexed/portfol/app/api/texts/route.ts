import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TextEntry from "@/models/TextEntry";

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { ok: false, error: "Tekst is verplicht" },
        { status: 400 }
      );
    }

    const textEntry = new TextEntry({ text });
    await textEntry.save();

    return NextResponse.json(
      { ok: true, message: "Tekst succesvol toegevoegd!", data: textEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving text:", error);
    return NextResponse.json(
      { ok: false, error: "Fout bij opslaan van tekst" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    
    const texts = await TextEntry.find().sort({ createdAt: -1 }).limit(50);

    return NextResponse.json({ ok: true, data: texts });
  } catch (error) {
    console.error("Error fetching texts:", error);
    return NextResponse.json(
      { ok: false, error: "Fout bij ophalen van teksten" },
      { status: 500 }
    );
  }
}
