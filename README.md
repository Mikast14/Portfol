# Portfol - Developer Portfolio & Project Showcase Platform

A modern, full-stack web application built with Next.js that enables developers to showcase their projects, connect with other developers, and explore interesting projects from the community.

## 🚀 Features

### Core Functionality
- **User Authentication**
  - Email/password registration and login
  - GitHub OAuth integration
  - JWT-based session management
  - Secure password hashing with bcrypt

- **Project Management**
  - Create, edit, and delete projects
  - Project details with GitHub repository integration
  - Multi-image support for project showcases
  - Platform tags (Web, Desktop, Game, App, etc.)
  - GitHub repository statistics (stars, forks, contributors, language)
  - Customizable display settings for GitHub data

- **Social Features**
  - Like/unlike projects
  - Comment on projects
  - Bookmark favorite projects
  - User profiles with project stats (general)

- **Discovery & Exploration**
  - Browse projects on the explore page
  - Filter by platform (Windows, macOS, Linux, iOS, Android, PlayStation, Xbox, Nintendo)
  - Search functionality for projects and users
  - User profile viewing

- **Profile Management**
  - Customizable user profiles
  - Skill tree visualization showing programming language expertise
  - Profile image support

### Technical Features
- **Responsive Design** - Almost full mobile and full desktop support with Tailwind CSS
- **Real-time Data** - Dynamic content updates
- **Database Integration** - MongoDB with Mongoose ODM
- **Type Safety** - Full TypeScript implementation

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **ESLint** - Code quality and consistency

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt.js** - Password hashing

### External Integrations
- **GitHub OAuth** - Third-party authentication
- **GitHub API** - Repository data fetching

## 📁 Project Structure

```
nexed/portfol/
├── app/                            # Next.js app directory
│   ├── api/                        # API routes
│   │   ├── auth/                   # Authentication endpoints
│   │   │   ├── login/              # Email/password login
│   │   │   ├── register/           # User registration
│   │   │   ├── github/             # GitHub OAuth
│   │   │   └── me/                 # Current user info
│   │   ├── projects/               # Project CRUD operations
│   │   ├── bookmarks/              # Bookmark management
│   │   ├── users/                  # User profiles and search
│   │   └── github/                 # GitHub API integration
│   ├── components/                 # Reusable React components
│   │   ├── Navbar.tsx              # Navigation bar
│   │   ├── ProjectCard.tsx         # Project display card
│   │   ├── ProjectDetail.tsx       # Project details view
│   │   ├── CommentsSection.tsx     # Comments UI
│   │   └── SkillTree.tsx           # Language skill visualization
│   ├── explore/                    # Project discovery pages
│   ├── profile/                    # User profile management
│   ├── login/                      # Authentication pages
│   ├── bookmarks/                  # Saved projects
│   ├── yourprojects/               # User's own projects
│   └── lib/                        # Utility functions
├── models/                         # Mongoose schemas
│   ├── User.js                     # User model
│   ├── Project.js                  # Project model
│   ├── Comment.js                  # Comment model
│   ├── Bookmark.js                 # Bookmark model
│   └── TextEntry.js                # Text content model
├── hooks/                          # Custom React hooks
│   └── useAuth.ts                  # Authentication hook
├── lib/                            # Server utilities
│   ├── mongodb.js                  # Database connection
│   └── jwt.ts                      # JWT utilities
├── types/                          # TypeScript definitions
└── public/                         # Static assets
```

## 🚀 Getting Started

### Requirements
- Node.js 20.x or higher
- MongoDB database (local or cloud instance)
- GitHub OAuth App (optional, for GitHub login)

### Installation

1. **Clone the repository**
   ```bash
   cd opdracht3/nexed/portfol
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/portfol
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfol
   
   # JWT Secret (generate a secure random string)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # GitHub OAuth (optional)
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback
   
   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID | No |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app secret | No |
| `GITHUB_CALLBACK_URL` | OAuth callback URL | No |
| `NEXT_PUBLIC_APP_URL` | Application base URL | Yes |

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user with email and password.

**Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "securepassword"
}
```

#### POST `/api/auth/login`
Login with email and password.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### GET `/api/auth/me`
Get current authenticated user info.

**Headers:** `Authorization: Bearer <token>`

#### GET `/api/auth/github`
Initiate GitHub OAuth flow.

#### GET `/api/auth/github/callback`
GitHub OAuth callback handler.

### Project Endpoints

#### GET `/api/projects`
Get all projects or user-specific projects.

**Query params:**
- `all=true` - Get all public projects
- `user=<userId>` - Get projects by user ID

#### POST `/api/projects`
Create a new project.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Project Name",
  "description": "Project description",
  "githubRepo": "owner/repo",
  "platforms": ["web", "desktop"],
  "images": ["image-url-1", "image-url-2"]
}
```

#### GET `/api/projects/[id]`
Get project details by ID.

#### PUT `/api/projects/[id]`
Update a project.

#### DELETE `/api/projects/[id]`
Delete a project.

#### POST `/api/projects/[id]/like`
Like or unlike a project.

#### GET `/api/projects/[id]/comments`
Get project comments.

#### POST `/api/projects/[id]/comments`
Add a comment to a project.

### User Endpoints

#### GET `/api/users/[username]`
Get user profile by username.

#### GET `/api/users/[username]/languages`
Get user's programming language statistics.

#### GET `/api/users/search`
Search for users.

**Query params:**
- `q=<search-term>` - Search query

#### PUT `/api/users/profile`
Update current user's profile.

### Bookmark Endpoints

#### GET `/api/bookmarks`
Get user's bookmarked projects.

#### POST `/api/bookmarks`
Bookmark a project.

**Body:**
```json
{
  "projectId": "project-id"
}
```

#### DELETE `/api/bookmarks/[projectId]`
Remove a bookmark.

## 🎨 Key Components

### Navbar
Main navigation component with authentication state, search functionality, and user menu.

### ProjectCard
Displays project information in a card format with image, title, description, and metadata.

### SkillTree
Interactive donut chart visualization showing programming language distribution and expertise.

### CommentsSection
Manages project comments with real-time updates and user interactions.

### ProjectDetail
Comprehensive project view with GitHub integration, images, comments, and social features.

## 🗄️ Database Models

### User
- Email, username, password (hashed)
- GitHub ID for OAuth users
- Profile image
- Timestamps

### Project
- Name, description
- GitHub repository link
- Platforms (array)
- Images (array)
- User reference
- Like count
- GitHub display settings
- Timestamps

### Comment
- Content
- Project reference
- User reference
- Timestamps

### Bookmark
- Project reference
- User reference
- Timestamps

### TextEntry
- Content storage for various text data
- User reference
- Timestamps

## 🔒 Security Features

- **Password Hashing** - Bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Middleware for authenticated endpoints
- **Input Validation** - Request body validation
- **OAuth Security** - Secure GitHub integration
- **Environment Variables** - Sensitive data protection