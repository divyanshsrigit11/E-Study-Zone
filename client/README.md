## 🎓 E-Study Zone
# A professional MERN-stack Learning Management System (LMS) designed to bridge the gap between Expert Trainers and Learners. This platform features role-based access control, secure content delivery through a "handshake" request system, and comprehensive administrative oversight.

# 🛠️ Tech Stack
# Frontend: React.js, Bootstrap 5, Vite, Axios

# Backend: Node.js, Express.js

# Database: MongoDB Atlas (Mongoose ODM)

# Authentication: JWT (JSON Web Tokens), Bcrypt.js

# Deployment: Vercel (Client), Render (API)

===================================================================================================================================

# 🛡️ Advanced Engineering Techniques
# ⚡ Performance & Scalability
Database Indexing: Implemented unique: true and index: true on critical fields like Email in MongoDB to ensure lightning-fast lookups and prevent data duplication at the database layer.

Dynamic Polling: The Dashboard uses a smart interval system (polling every 10 seconds) to fetch live System Settings and Notifications without overwhelming the server.

Hybrid Password Logic: A custom authentication flow that detects legacy plain-text passwords versus modern Bcrypt hashes, allowing for seamless data migration and administrative manual entries.

# 🛑 Security & Traffic Control
Rate Limiting (Brute-Force Protection): * Admin Auth Limiter: Strict limit of 5 login attempts per 15 minutes to prevent automated password guessing on the Super Admin portal.

Standard Auth Limiter: Balanced limits on User registration and login to mitigate DDoS attacks and API spam.

Role-Based Access Control (RBAC): Middleware-level security that validates the JWT payload to ensure Learners cannot trigger Admin routes (e.g., blocking content) even if they have the API endpoint URL.

Maintenance Mode "Kill-Switch": A global state controlled by the Admin that instantly disables data mutation (POST/PUT/DELETE) across all frontend components during system updates.

# 📂 Resource Management
Multer Integration: Configured disk storage engines to handle multi-part form data for profile pictures and study materials, including filename sanitization.

Stateless Authentication: Used JWT to eliminate the need for server-side sessions, allowing the backend to remain lightweight and easily scalable on Render’s infrastructure.

Cross-Origin Resource Sharing (CORS): Strict whitelist policy to ensure the Render API only communicates with the authorized Vercel frontend.

# 🌟 Key Features
👨‍💼 Super Admin Portal
Verification Engine: Manually review and approve Trainer and Learner registrations.

Content Moderation: Block or unblock study materials to maintain platform standards.

System Controls: Toggle "Maintenance Mode" to globally halt data operations.

Global Broadcasts: Send real-time alerts and notifications to all users.

Stats Dashboard: Track total users, active trainers, and content volume.

👨‍🏫 Trainer Dashboard
Skill Creation: Manage a personalized list of skills you offer.

Content Vault: Upload PDF or Image-based materials with status controls (Draft/Publish).

Connection Management: Accept or reject "Handshake Requests" from learners.

Profile Control: Fully customizable profile with academic details and photo uploads.

👨‍🎓 Learner Dashboard
Discovery: Search for trainers by specific skills or by name.

Handshake System: Request access to a trainer's premium study materials.

Learning Vault: View and download materials from all accepted connections.

Security: Manage account details and secure password updates.

📂 Project Structure
Plaintext
E-STUDY-ZONE/
├── client/                # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/         # Admin, Trainer, and User directories
│   │   ├── components/    # Common UI Components
│   │   ├── constants/     # Roles and Qualification lists
│   └── .env               # VITE_API_URL logic
├── server/                # Node.js Backend
│   ├── models/            # Admin, User, Content, Setting schemas
│   ├── routes/            # API Endpoints
│   ├── middleware/        # JWT Auth and Multer uploads
│   └── .env               # MONGO_URI, JWT_SECRET
# ⚙️ Setup & Installation
1. Backend Configuration
Navigate to server and run npm install.

Create a .env file(see below "Environment Configuration" section) and add your MONGO_URI and JWT_SECRET.

Start development server: npm run dev.

2. Frontend Configuration
Navigate to client and run npm install.

Create a .env file and add VITE_API_URL=http://localhost:5000.

Start development server: npm run dev.

# 🔑 Environment Configuration
To run this project in production or locally, you must set up two separate .env files.

1. Backend Service (server/.env)
These keys stay on the server and are never exposed to the browser.

PORT: The port number (usually 5000).

MONGO_URI: Your MongoDB Atlas connection string.

JWT_SECRET: A long, random string used to sign security tokens.

NODE_ENV: Set to production on Render and development locally.

2. Frontend Client (client/.env)
Note the VITE_ prefix required by Vite to expose variables to your React code.

VITE_API_URL:

Local: http://localhost:5000

Production: https://your-backend-service.onrender.com

# 🏛️ System Architecture & Role Boundaries
The application is built on a strict Role-Based Access Control (RBAC) model. Users cannot access components outside their designated boundary.

👨‍💼 1. Admin Dashboard (The "Orchestrator")
The Admin is the highest authority. Their primary job is trust and safety.

Boundary: Can view all users and content but cannot create study materials or request handshakes.

Core Components:

Dashboard Overview: Aggregates data across the entire platform (e.g., "How many files are live?").

Manage Trainers/Learners: The "Gatekeeper." Trainers default to inactive. The Admin must manually approve them after verification to prevent spam.

Content Moderation: A global list of every file uploaded. Admin can "Block" files that violate terms, instantly hiding them from all Learners.

Global Broadcasts: A one-to-many communication tool. Sends a message that appears in every user's notification bell.

System Settings: The "Kill Switch." Can put the site into Maintenance Mode, which the frontend uses to disable buttons and show an alert banner.

👨‍🏫 2. Trainer Dashboard (The "Content Creator")
Trainers are the knowledge providers. They operate within a closed-loop approval system.

Boundary: Can manage their own content and skills but cannot see other Trainers' files or Admin settings.

Core Components:

Add Skills: Trainers define their expertise (e.g., "Java", "MERN Stack"). This makes them searchable.

Add Content: A file-management system. Trainers can upload materials as Draft (hidden) or Publish (visible to connected learners only).

Handshake Request: The core security feature. Trainers see a list of Learners who want access. Content is only shared once the Trainer clicks "Accept."

Profile Management: Academic details that build trust with Learners.

👨‍🎓 3. Learner Dashboard (The "Knowledge Seeker")
Learners are the consumers. They are restricted by Handshake Permissions.

Boundary: Cannot see any study materials until a specific Trainer approves their handshake request.

Core Components:

Discover Trainers: A search engine that queries the database for active Trainers and their specific skills.

Handshake System: The "Request Access" button. It creates a pending link between the Learner and the Trainer.

My Content (Learning Vault): A personalized library. This component only fetches files where the handshake_status is accepted.

Security & Profile: Standard academic tracking and password management.

# 🔄 The Data Flow (The "Handshake" Logic)
Understanding how these components interact is key:

Trainer uploads a file linked to the "React" skill.

Learner searches for "React" and finds the Trainer.

Learner sends a "Handshake Request."

Trainer receives the request in their dashboard and clicks "Accept."

Backend creates a secure link in the database.

Learner's "My Content" component now dynamically displays the Trainer's file.

Admin can at any time "Block" that file, making it disappear from the Learner's vault instantly.

# 🔒🛠️ Security Measures & Boundaries
JWT Protection: Every request to the Trainer or Admin API requires a valid token. If a Learner tries to call an /api/admin route, the backend returns a 403 Forbidden error.

Status Check: Users with a status: inactive are blocked at the Login level, preventing access until the Admin approves them.

Database Isolation: Content is never "Global." It is filtered by userId (Trainer) or accepted_connections (Learner).

Hybrid Auth: Supports both hashed passwords and secure plain-text admin entry logic.

Rate Limiting: Login routes are protected against brute-force attacks.

CORS: Configured to allow secure cross-origin requests between Vercel and Render.

Protected Assets: Content is only visible to learners after trainer approval.

📄 License
This project is for educational purposes under the MIT License.