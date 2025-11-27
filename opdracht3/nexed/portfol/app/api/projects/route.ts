import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  console.log("=== POST /api/projects - REQUEST RECEIVED ===");
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    console.log("Parsing JSON body...");
    const body = await request.json();
    console.log("JSON body parsed successfully");
    
    const { name, description, githubRepo, platforms: platformsString, mainImageUrl, additionalImageUrls = [], githubDisplaySettings = {} } = body;

    // Validate required fields
    if (!name || !description || !githubRepo || !platformsString || !mainImageUrl) {
      return NextResponse.json(
        { ok: false, error: "Name, description, GitHub repo, platforms, and main image URL are required" },
        { status: 400 }
      );
    }

    // Validate main image URL format
    try {
      new URL(mainImageUrl);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Main image URL is not a valid URL" },
        { status: 400 }
      );
    }

    // Validate additional image URLs
    for (const url of additionalImageUrls) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json(
          { ok: false, error: `Invalid additional image URL: ${url}` },
          { status: 400 }
        );
      }
    }

    // Parse platforms (comma-separated string to array)
    const platforms = platformsString.split(",").map((p: string) => p.trim().toLowerCase());

    // Validate platforms
    const validPlatforms = ["windows", "macos", "web", "linux"];
    const invalidPlatforms = platforms.filter((p: string) => !validPlatforms.includes(p));
    if (invalidPlatforms.length > 0) {
      return NextResponse.json(
        { ok: false, error: `Invalid platforms: ${invalidPlatforms.join(", ")}` },
        { status: 400 }
      );
    }

    // Use URLs directly - no file processing needed
    const primaryImagePath = mainImageUrl;
    const allImagePaths: string[] = [primaryImagePath, ...additionalImageUrls];

    console.log(`Saving project with main image URL and ${additionalImageUrls.length} additional image URLs`);
    console.log(`Main image URL: ${primaryImagePath}`);
    console.log(`All image URLs:`, JSON.stringify(allImagePaths));

    // Create project with image URLs and GitHub display settings
    const project = new Project({
      name,
      description,
      githubRepo,
      platforms,
      image: primaryImagePath, // Main image for backward compatibility
      images: allImagePaths, // All images: main first, then additional
      githubDisplaySettings: {
        activeStatus: githubDisplaySettings.activeStatus || "auto",
        contributors: githubDisplaySettings.contributors || "auto",
        stars: githubDisplaySettings.stars || "auto",
        forks: githubDisplaySettings.forks || "auto",
        language: githubDisplaySettings.language || "auto",
      },
    });

    // Save the project
    await project.save();
    
    // Explicitly update the images field using updateOne to ensure it's saved
    await Project.updateOne(
      { _id: project._id },
      { $set: { images: allImagePaths } }
    );
    
    // Fetch the project again to verify what was actually saved
    const savedProjectDoc = await Project.findById(project._id);
    console.log(`Project saved successfully!`);

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

export async function PUT(request: Request) {
  console.log("=== PUT /api/projects - REQUEST RECEIVED ===");
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    console.log("Parsing JSON body...");
    const body = await request.json();
    console.log("JSON body parsed successfully");
    
    const { id, name, description, githubRepo, platforms: platformsString, mainImageUrl, additionalImageUrls = [], githubDisplaySettings = {} } = body;

    // Validate required fields
    if (!id || !name || !description || !githubRepo || !platformsString || !mainImageUrl) {
      return NextResponse.json(
        { ok: false, error: "ID, name, description, GitHub repo, platforms, and main image URL are required" },
        { status: 400 }
      );
    }

    // Find the project
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { ok: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Validate main image URL format
    try {
      new URL(mainImageUrl);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Main image URL is not a valid URL" },
        { status: 400 }
      );
    }

    // Validate additional image URLs
    for (const url of additionalImageUrls) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json(
          { ok: false, error: `Invalid additional image URL: ${url}` },
          { status: 400 }
        );
      }
    }

    // Parse platforms
    const platforms = platformsString.split(",").map((p: string) => p.trim().toLowerCase());

    // Validate platforms
    const validPlatforms = ["windows", "macos", "web", "linux"];
    const invalidPlatforms = platforms.filter((p: string) => !validPlatforms.includes(p));
    if (invalidPlatforms.length > 0) {
      return NextResponse.json(
        { ok: false, error: `Invalid platforms: ${invalidPlatforms.join(", ")}` },
        { status: 400 }
      );
    }

    // Use URLs directly - no file processing needed
    const primaryImagePath = mainImageUrl;
    const allImagePaths: string[] = [primaryImagePath, ...additionalImageUrls];

    console.log(`Updating project with main image URL and ${additionalImageUrls.length} additional image URLs`);
    console.log(`Main image URL: ${primaryImagePath}`);
    console.log(`All image URLs:`, JSON.stringify(allImagePaths));

    // Update the project
    project.name = name;
    project.description = description;
    project.githubRepo = githubRepo;
    project.platforms = platforms;
    project.image = primaryImagePath; // Main image for backward compatibility
    project.images = allImagePaths; // All images: main first, then additional
    project.githubDisplaySettings = {
      activeStatus: githubDisplaySettings.activeStatus || project.githubDisplaySettings?.activeStatus || "auto",
      contributors: githubDisplaySettings.contributors || project.githubDisplaySettings?.contributors || "auto",
      stars: githubDisplaySettings.stars || project.githubDisplaySettings?.stars || "auto",
      forks: githubDisplaySettings.forks || project.githubDisplaySettings?.forks || "auto",
      language: githubDisplaySettings.language || project.githubDisplaySettings?.language || "auto",
    };
    project.updatedAt = new Date();

    await project.save();

    console.log(`Project updated successfully!`);

    return NextResponse.json(
      { ok: true, message: "Project updated successfully!", data: project },
      { status: 200 }
    );
  } catch (error) {
    console.error("=== ERROR UPDATING PROJECT ===");
    console.error("Error details:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { ok: false, error: "Error updating project", details: error instanceof Error ? error.message : String(error) },
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

    // Note: Since we're now using external URLs, we don't need to delete local files
    // Images are hosted externally, so no cleanup needed

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

