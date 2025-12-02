import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { verifyToken } from "@/lib/jwt";

export const runtime = "nodejs";
export const maxDuration = 30;

// Helper function to get current user ID from request headers
function getCurrentUserId(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}

export async function POST(request: Request) {
  console.log("=== POST /api/projects - REQUEST RECEIVED ===");
  try {
    // Get current user ID from token
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    console.log("Parsing JSON body...");
    const body = await request.json();
    console.log("JSON body parsed successfully");
    
    const { name, description, githubRepo, platforms: platformsString, mainImageUrl, additionalImageUrls = [], githubDisplaySettings = {} } = body;

    // Validate required fields (logo is now optional)
    if (!name || !description || !githubRepo || !platformsString) {
      return NextResponse.json(
        { ok: false, error: "Name, description, GitHub repo, and platforms are required" },
        { status: 400 }
      );
    }

    // Validate main image URL format (if provided)
    if (mainImageUrl) {
      try {
        new URL(mainImageUrl);
      } catch {
        return NextResponse.json(
          { ok: false, error: "Main image URL is not a valid URL" },
          { status: 400 }
        );
      }
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
    // Logo is stored separately in image field, subimages go in images array
    const logoUrl = mainImageUrl || undefined;
    const subImagePaths: string[] = additionalImageUrls.filter((url: string) => url.trim());

    console.log(`Saving project with logo URL and ${subImagePaths.length} subimage URLs`);
    console.log(`Logo URL: ${logoUrl || 'none'}`);
    console.log(`Subimage URLs:`, JSON.stringify(subImagePaths));

    // Create project with image URLs and GitHub display settings
    const project = new Project({
      name,
      description,
      githubRepo,
      platforms,
      image: logoUrl, // Logo (optional)
      images: subImagePaths, // Only subimages (not including logo)
      userId: userId, // Associate project with the logged-in user
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
      { $set: { images: subImagePaths } }
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
    // Get current user ID from token
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    console.log("Parsing JSON body...");
    const body = await request.json();
    console.log("JSON body parsed successfully");
    
    const { id, name, description, githubRepo, platforms: platformsString, mainImageUrl, additionalImageUrls = [], githubDisplaySettings = {} } = body;

    // Validate required fields (logo is now optional)
    if (!id || !name || !description || !githubRepo || !platformsString) {
      return NextResponse.json(
        { ok: false, error: "ID, name, description, GitHub repo, and platforms are required" },
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

    // Check if the project belongs to the current user
    if (project.userId?.toString() !== userId) {
      return NextResponse.json(
        { ok: false, error: "You can only edit your own projects" },
        { status: 403 }
      );
    }

    // Validate main image URL format (if provided)
    if (mainImageUrl) {
      try {
        new URL(mainImageUrl);
      } catch {
        return NextResponse.json(
          { ok: false, error: "Main image URL is not a valid URL" },
          { status: 400 }
        );
      }
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
    // Logo is stored separately in image field, subimages go in images array
    const logoUrl = mainImageUrl || undefined;
    const subImagePaths: string[] = additionalImageUrls.filter((url: string) => url.trim());

    console.log(`Updating project with logo URL and ${subImagePaths.length} subimage URLs`);
    console.log(`Logo URL: ${logoUrl || 'none'}`);
    console.log(`Subimage URLs:`, JSON.stringify(subImagePaths));

    // Update the project
    project.name = name;
    project.description = description;
    project.githubRepo = githubRepo;
    project.platforms = platforms;
    project.image = logoUrl; // Logo (optional)
    project.images = subImagePaths; // Only subimages (not including logo)
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
    // Get current user ID from token
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Authentication required" },
        { status: 401 }
      );
    }

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

    // Check if the project belongs to the current user
    if (project.userId?.toString() !== userId) {
      return NextResponse.json(
        { ok: false, error: "You can only delete your own projects" },
        { status: 403 }
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
    const all = searchParams.get("all") === "true"; // Query param to fetch all projects

    // Get current user ID from token (optional for GET requests)
    const userId = getCurrentUserId(request);

    // If ID is provided, fetch single project
    if (id) {
      const project = await Project.findById(id).populate("userId", "username email profileImage");
      if (!project) {
        return NextResponse.json(
          { ok: false, error: "Project not found" },
          { status: 404 }
        );
      }
      // If user is authenticated and project doesn't belong to them, still allow viewing (for explore page)
      // Only restrict if they're trying to edit/delete (handled in PUT/DELETE)
      return NextResponse.json({ ok: true, data: project });
    }

    // If "all=true" query param is provided, fetch all projects (for explore page)
    if (all) {
      const projects = await Project.find({})
        .populate("userId", "username email profileImage")
        .sort({ createdAt: -1 });
      return NextResponse.json({ ok: true, data: projects });
    }

    // If user is authenticated, fetch only their projects (for profile page)
    if (userId) {
      const projects = await Project.find({ userId: userId }).sort({ createdAt: -1 });
      return NextResponse.json({ ok: true, data: projects });
    }

    // If no auth and no "all" param, return all projects (default behavior for explore page)
    const projects = await Project.find({})
      .populate("userId", "username email profileImage")
      .sort({ createdAt: -1 });
    return NextResponse.json({ ok: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { ok: false, error: "Error fetching projects" },
      { status: 500 }
    );
  }
}


