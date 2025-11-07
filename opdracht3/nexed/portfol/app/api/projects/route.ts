import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Configure route for file uploads
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const githubRepo = formData.get("githubRepo") as string;
    const platformsString = formData.get("platforms") as string;
    const imageFile = formData.get("image") as File | null;

    // Validate required fields
    if (!name || !description || !githubRepo || !platformsString) {
      return NextResponse.json(
        { ok: false, error: "Name, description, GitHub repo, and platforms are required" },
        { status: 400 }
      );
    }

    // Parse platforms (comma-separated string to array)
    const platforms = platformsString.split(",").map((p) => p.trim().toLowerCase());

    // Validate platforms
    const validPlatforms = ["windows", "macos", "web", "linux"];
    const invalidPlatforms = platforms.filter((p) => !validPlatforms.includes(p));
    if (invalidPlatforms.length > 0) {
      return NextResponse.json(
        { ok: false, error: `Invalid platforms: ${invalidPlatforms.join(", ")}` },
        { status: 400 }
      );
    }

    let imagePath = "";

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), "public", "uploads", "projects");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${timestamp}_${originalName}`;
      const filepath = join(uploadsDir, filename);

      // Write file to disk
      await writeFile(filepath, buffer);

      // Store relative path for database
      imagePath = `/uploads/projects/${filename}`;
    }

    // Create project
    const project = new Project({
      name,
      description,
      githubRepo,
      platforms,
      image: imagePath,
    });

    await project.save();

    return NextResponse.json(
      { ok: true, message: "Project created successfully!", data: project },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { ok: false, error: "Error creating project" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find().sort({ createdAt: -1 });

    return NextResponse.json({ ok: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { ok: false, error: "Error fetching projects" },
      { status: 500 }
    );
  }
}

