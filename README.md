PeerLift 📚
SDG 4: Quality Education

PeerLift is a peer-to-peer micro-tutoring marketplace where students post specific academic doubts (Tasks) and earn credits by solving problems for others. We replace generic "study groups" with a transactional, reputation-based economy that incentivizes quick, accurate help.

🚀 Tech Stack
Frontend: React, TypeScript, Tailwind CSS, Vite, Axios

Backend: Java Spring Boot, Spring Security, JPA/Hibernate

Database: MySQL

Authentication: JWT (JSON Web Tokens) with Email OTP Verification

⚡️ Key Features
Credit Economy: Users earn credits by solving doubts and spend credits to ask questions.

Task Marketplace: View open doubts filtered by subject; Accept tasks to lock them.

Proof of Work: Solvers upload image proofs (handwritten solutions/screenshots).

Quality Assurance: Posters rate solutions (1-5 stars) to release credits.

Leaderboard: Gamified ranking of top contributors.

🛠️ How to Run Locally
Prerequisites
Node.js & npm

Java 17+ (JDK)

Maven

1. Backend Setup (Spring Boot)
   ⚠️ CRITICAL STEP: You must create an uploads folder for images to work.

Navigate to the backend directory:

Bash

cd backend
Create the uploads' directory:

Bash

mkdir -p uploads/solutions
(If you skip this, image uploads will fail with Error 500)

Install dependencies and run:

Bash

mvn spring-boot:run
The server will start on http://localhost:8080

2. Frontend Setup (React)
   Open a new terminal and navigate to the frontend directory:

Bash

cd frontend
Install dependencies:

Bash

npm install
Start the development server:

Bash

npm run dev
The app will be available at http://localhost:5173

🤖 AI Declaration
In the spirit of honesty and transparency (as per submission guidelines):

ChatGPT/Claude: Used to generate boilerplate code for Spring Boot Controllers and to debug CORS issues between React and Java.

GitHub Copilot: Used for frontend component autocompletion (Tailwind classes and interface definitions).

Core Logic: The credit transaction logic, state management, and business rules were architected and verified manually by the team.

👥 Team
Somil Jain - Full Stack Developer