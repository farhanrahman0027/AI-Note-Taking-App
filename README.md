# 🧠 AI Note-Taking App  
**Smart Note Management with AI-Powered Features**  

A full-stack AI-powered note-taking application built using **Next.js**, **TypeScript**, **Hono.js**, **PostgreSQL**, and **shadcn/ui**.  
It enables users to create, edit, and manage their notes while leveraging AI to summarize, improve, and tag their content automatically.  

---

## 🚀 Tech Stack  

| Category | Technology |
|-----------|-------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, React Hook Form |
| **Backend** | Hono.js, Node.js, TypeScript |
| **Database** | PostgreSQL (via Prisma or Drizzle ORM) |
| **Authentication** | NextAuth.js |
| **AI Integration** | OpenAI API (for summary, improvement, and tags) |
| **Validation** | Zod |
| **Deployment** | Vercel |

---

## ✨ Core Features  

### 🔐 Authentication  
- User registration and login  
- Protected routes  
- User session handling  

### 📝 Notes Management  
- Create, view, edit, and delete notes  
- Search notes by title  
- Rich text editor for writing notes  

### 🤖 AI Features  
- **AI Summary:** Generate short summaries of notes  
- **AI Improve:** Enhance content clarity and grammar  
- **AI Tags:** Generate relevant tags automatically  

### 🎨 UI & UX  
- Responsive design using Tailwind CSS  
- Dark/Light mode toggle  
- Clean, modern interface built with shadcn/ui  

---

## 🧩 Folder Structure  

ai-note-taking-app/
├── app/
│   ├── api/              # Hono.js routes (Auth, Notes, AI)
│   ├── auth/             # Auth pages (Sign In, Sign Up)
│   ├── dashboard/        # User dashboard and note listing
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── NoteCard.tsx
│   ├── NoteEditor.tsx
│   ├── AIButton.tsx
│   ├── SearchBar.tsx
│   └── ThemeToggle.tsx
├── lib/
│   ├── db.ts             # PostgreSQL connection
│   ├── auth.ts           # NextAuth configuration
│   └── ai.ts             # OpenAI integration logic
├── prisma/               # Prisma schema (if using Prisma)
├── public/               # Static assets
├── styles/               # Tailwind & global styles
├── .env.local            # Environment variables
└── README.md

---

## ⚙️ Environment Variables  

Create a `.env.local` file in the root:  

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

DATABASE_URL=postgresql://username:password@localhost:5432/ai_notes
OPENAI_API_KEY=your_openai_api_key_here


🧑‍💻 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/ai-note-taking-app.git
cd ai-note-taking-app

2️⃣ Install Dependencies
npm install

3️⃣ Run the Development Server
npm run dev

4️⃣ Build for Production
npm run build
npm start


🧠 AI API Integration
The app integrates with OpenAI’s GPT API for:


Summarizing long notes


Improving content clarity and grammar


Generating relevant tags


All AI calls include proper error handling and loading states.

🌐 Deployment
Deploy easily on Vercel.
Add all environment variables to your Vercel dashboard.

🧾 License
This project is licensed under the MIT License.

👨‍💻 Author
Farhan Rahman
MERN / PERN Stack Developer
📍 Hyderabad, India

---

Would you like me to now give you the **20 commit commands + commit messages** (step-by-step, in the right order) to push this project part by part to GitHub — so your GitHub shows a clean development history?
