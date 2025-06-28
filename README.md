# DTxDS Content Co-Creator Prototype

A web-based AI system that helps early-stage founders create startup artifacts through guided conversations.

## Features Implemented

✅ **Problem Statement Module**: Socratic questioning to define core problems  
✅ **Customer Persona Module**: Create detailed customer profiles with validation warnings  
✅ **Artifact Storage**: SQLite database with Prisma ORM  
✅ **Artifact Management**: View, download, and delete saved artifacts  
✅ **Responsive UI**: Clean, modern interface with progress tracking  

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Initialize the database:**
   ```bash
   npx prisma db push
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Start with Problem Statement** (foundational module - must complete first)
   - Click on the Problem Statement card
   - Answer questions about your target customer and their problems
   - The system will ask follow-up questions based on your answers
   - Save as draft or complete the module

2. **Create Customer Personas** (unlocked after Problem Statement)
   - Define memorable personas for your target customers
   - System warns about the importance of real user interviews
   - Supports both B2C and B2B personas

3. **View Artifacts**
   - Navigate to the Artifacts page to see all saved content
   - Click on any artifact to view details
   - Download artifacts as JSON files
   - Delete artifacts you no longer need

## Project Structure

```
├── app/
│   ├── api/               # API routes for artifact management
│   ├── components/        # React components
│   │   └── modules/       # Module components (Problem Statement, Customer Persona)
│   ├── lib/              # Utilities and database client
│   │   └── questions/    # Question definitions for each module
│   ├── types/            # TypeScript type definitions
│   ├── artifacts/        # Artifacts page
│   └── page.tsx          # Home page with module selection
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Database Schema

- **User**: Stores user profiles
- **Venture**: Multiple ventures per user
- **Artifact**: Content created through modules (problem statements, personas, etc.)

## Next Steps

The following modules are designed but not yet implemented:
- Interview Guide Generator
- Interview Insights Summarizer  
- Market Sizing Calculator (with web search)
- Slide Deck Generation

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Prisma**: Database ORM with SQLite
- **Tailwind CSS**: Styling
- **React Hook Form + Zod**: Form handling and validation
- **Lucide Icons**: Icon library