// Script to create a test user in the database
// Run with: node scripts/create-test-user.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env.local") });

// Import User model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createTestUser() {
  try {
    // Connect to database
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("Please define MONGODB_URI in .env.local");
    }

    await mongoose.connect(uri);
    console.log("✅ Connected to database");

    // Test user credentials
    const testEmail = "test@example.com";
    const testPassword = "test123";

    // Check if user already exists
    const existingUser = await User.findOne({ email: testEmail });
    if (existingUser) {
      console.log("ℹ️  Test user already exists!");
      console.log(`   Email: ${testEmail}`);
      console.log(`   Password: ${testPassword}`);
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Create user
    const user = new User({
      email: testEmail,
      password: hashedPassword,
    });

    await user.save();
    console.log("✅ Test user created successfully!");
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    console.log("\n💡 You can now use these credentials to log in.");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error creating test user:", error);
    process.exit(1);
  }
}

createTestUser();

