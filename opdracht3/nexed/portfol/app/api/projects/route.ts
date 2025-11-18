import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Configure route for file uploads
export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  console.log("=== POST /api/projects - REQUEST RECEIVED ===");
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    console.log("Parsing FormData...");
    const formData = await request.formData();
    console.log("FormData parsed successfully");
    
    // IMPORTANT: Collect ALL FormData entries first before reading individual fields
    // This prevents issues with FormData stream consumption
    const formDataEntries: { key: string; value: FormDataEntryValue }[] = [];
    for (const [key, value] of formData.entries()) {
      formDataEntries.push({ key, value });
    }
    
    console.log(`FormData entries found: ${formDataEntries.length}`);
    console.log(`FormData keys:`, formDataEntries.map(e => e.key));
    
    // Extract text fields from collected entries
    const nameEntry = formDataEntries.find(e => e.key === "name");
    const descriptionEntry = formDataEntries.find(e => e.key === "description");
    const githubRepoEntry = formDataEntries.find(e => e.key === "githubRepo");
    const platformsEntry = formDataEntries.find(e => e.key === "platforms");
    const additionalImageCountEntry = formDataEntries.find(e => e.key === "additionalImageCount");
    
    const name = nameEntry?.value as string || "";
    const description = descriptionEntry?.value as string || "";
    const githubRepo = githubRepoEntry?.value as string || "";
    const platformsString = platformsEntry?.value as string || "";
    const additionalImageCount = additionalImageCountEntry ? parseInt(additionalImageCountEntry.value as string) || 0 : 0;

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

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "projects");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Handle image uploads - separate main image from additional images
    const baseTimestamp = Date.now();
    let mainImagePath: string | null = null;
    const additionalImagePaths: string[] = [];

    // Extract main image
    const mainImageEntry = formDataEntries.find(e => e.key === "mainImage");
    if (!mainImageEntry || !(mainImageEntry.value instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Main image is required" },
        { status: 400 }
      );
    }

    const mainImageFile = mainImageEntry.value as File;
    if (mainImageFile.size === 0) {
      return NextResponse.json(
        { ok: false, error: "Main image is required" },
        { status: 400 }
      );
    }

    // Process main image
    try {
      const bytes = await mainImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const originalName = mainImageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${baseTimestamp}_main_${originalName}`;
      const filepath = join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      mainImagePath = `/uploads/projects/${filename}`;
      console.log(`Saved main image: ${filename}`);
    } catch (error) {
      console.error(`Error saving main image:`, error);
      return NextResponse.json(
        { ok: false, error: "Error saving main image" },
        { status: 500 }
      );
    }

    // Collect and process additional images
    const additionalImageFiles: { index: number; file: File }[] = [];
    
    for (const entry of formDataEntries) {
      if (entry.key.startsWith("additionalImage_") && entry.value instanceof File) {
        const file = entry.value as File;
        if (file.size > 0) {
          const index = parseInt(entry.key.replace("additionalImage_", ""));
          if (!isNaN(index)) {
            additionalImageFiles.push({ index, file });
            console.log(`Found additionalImage_${index}: ${file.name}, size: ${file.size} bytes`);
          }
        }
      }
    }

    // Sort by index to maintain order
    additionalImageFiles.sort((a, b) => a.index - b.index);
    
    console.log(`Found ${additionalImageFiles.length} additional image files to process (expected: ${additionalImageCount})`);

    // Process each additional image file
    for (let i = 0; i < additionalImageFiles.length; i++) {
      const { file: imageFile } = additionalImageFiles[i];
      
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const originalName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${baseTimestamp}_additional_${i}_${originalName}`;
        const filepath = join(uploadsDir, filename);

        // Write file to disk
        await writeFile(filepath, buffer);

        // Store relative path for database
        additionalImagePaths.push(`/uploads/projects/${filename}`);
        
        console.log(`Saved additional image ${i + 1}/${additionalImageFiles.length}: ${filename}`);
      } catch (error) {
        console.error(`Error saving additional image ${i}:`, error);
        // Continue with other images even if one fails
      }
    }

    // Combine all images: main image first, then additional images
    // Ensure mainImagePath is not null (it's validated above)
    const primaryImagePath = mainImagePath!;
    const allImagePaths: string[] = [primaryImagePath, ...additionalImagePaths];

    console.log(`Saving project with main image and ${additionalImagePaths.length} additional images`);
    console.log(`Main image: ${primaryImagePath}`);
    console.log(`All images:`, JSON.stringify(allImagePaths));
    console.log(`All images is array:`, Array.isArray(allImagePaths));
    console.log(`All images length:`, allImagePaths.length);

    // Create project with images array included in constructor
    const project = new Project({
      name,
      description,
      githubRepo,
      platforms,
      image: primaryImagePath, // Main image for backward compatibility
      images: allImagePaths, // All images: main first, then additional
    });

    // Log before save
    console.log(`Project object before save - images array:`, project.images);
    console.log(`Project object before save - images length:`, project.images?.length);
    console.log(`Project object before save - images type:`, typeof project.images);
    console.log(`Project object before save - images is array:`, Array.isArray(project.images));
    console.log(`Project object before save - images content:`, JSON.stringify(project.images));
    
    // Also log the raw document data
    const docData = project.toObject();
    console.log(`Project document data before save - images:`, docData.images);
    console.log(`Project document data before save - images length:`, docData.images?.length);
    console.log(`Project isModified('images'):`, project.isModified('images'));
    console.log(`Project isNew:`, project.isNew);

    // Save the project
    await project.save();
    
    // Explicitly update the images field using updateOne to ensure it's saved
    // This is a workaround for Mongoose sometimes not saving array fields
    await Project.updateOne(
      { _id: project._id },
      { $set: { images: allImagePaths } }
    );
    
    // Fetch the project again to verify what was actually saved
    const savedProjectDoc = await Project.findById(project._id);
    console.log(`Project saved successfully!`);
    console.log(`Images in saved project (document):`, savedProjectDoc?.images);
    console.log(`Number of images in saved project (document):`, savedProjectDoc?.images?.length || 0);
    console.log(`Primary image:`, savedProjectDoc?.image);
    
    // Also check the raw document data
    if (savedProjectDoc) {
      const rawData = savedProjectDoc.toObject();
      console.log(`Images in raw document data:`, rawData.images);
      console.log(`Number of images in raw document data:`, rawData.images?.length || 0);
    }
    
    // Also fetch using lean() to see the raw MongoDB document
    const rawDoc = await Project.findById(project._id).lean();
    console.log(`Raw MongoDB document (lean):`, JSON.stringify(rawDoc, null, 2));
    console.log(`Images field exists in raw doc:`, 'images' in (rawDoc || {}));
    console.log(`Images value in raw doc:`, rawDoc?.images);

    return NextResponse.json(
      { ok: true, message: "Project created successfully!", data: savedProjectDoc || project },
      { status: 201 }
    );
  } catch (error) {
    console.error("=== ERROR CREATING PROJECT ===");
    console.error("Error details:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { ok: false, error: "Error creating project", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Project id is required" },
        { status: 400 }
      );
    }

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Delete all images associated with the project
    const imagesToDelete = project.images && project.images.length > 0 
      ? project.images 
      : (project.image ? [project.image] : []);

    for (const imagePath of imagesToDelete) {
      if (imagePath) {
        const pathToDelete = imagePath.startsWith("/")
          ? imagePath.slice(1)
          : imagePath;
        const fullImagePath = join(process.cwd(), "public", pathToDelete);

        if (existsSync(fullImagePath)) {
          try {
            await unlink(fullImagePath);
          } catch (err) {
            console.warn(`Failed to remove image file ${fullImagePath}:`, err);
          }
        }
      }
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json(
      { ok: true, message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { ok: false, error: "Error deleting project" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // If ID is provided, fetch single project
    if (id) {
      const project = await Project.findById(id);
      if (!project) {
        return NextResponse.json(
          { ok: false, error: "Project not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ ok: true, data: project });
    }

    // Otherwise, fetch all projects
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

