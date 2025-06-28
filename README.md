# DTxDS Content Co-Creator Prototype

An AI-powered interactive system that guides early-stage founders through creating and refining startup artifacts using Claude AI.

## Features Implemented

✅ **AI-Powered Problem Statement Creation**: Interactive conversation with Claude AI mentor  
✅ **Dual Mode Options**: Choose between AI conversation or guided form  
✅ **Problem Statement Module**: Socratic questioning to define core problems  
✅ **Customer Persona Module**: Create detailed customer profiles with validation warnings  
✅ **AI Analysis & Refinement**: Get intelligent feedback and suggestions  
✅ **Artifact Storage**: SQLite database with Prisma ORM  
✅ **Artifact Management**: View, download, and delete saved artifacts  
✅ **Responsive UI**: Clean, modern interface with progress tracking  

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up your Anthropic API key:**
   - Get an API key from [Anthropic Console](https://console.anthropic.com/)
   - Add it to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

3. **Initialize the database:**
   ```bash
   npx prisma db push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

### AI-Powered Problem Statement Creation

1. **Choose Your Approach**
   - Click on the Problem Statement card
   - Select between:
     - **AI Conversation**: Interactive chat with an AI mentor who guides you through iterations
     - **Guided Form**: Traditional step-by-step questionnaire

2. **AI Conversation Mode**
   - Chat naturally with the AI mentor
   - Receive personalized questions based on your responses
   - Get real-time feedback and suggestions
   - Iterate and refine your problem statement
   - Save when you're satisfied with the result

3. **Traditional Form Mode**
   - Answer structured questions at your own pace
   - Navigate back and forth between questions
   - See dynamic follow-up questions based on your answers
   - Save as draft or complete

### Other Features

1. **Create Customer Personas** (unlocked after Problem Statement)
   - Define memorable personas for your target customers
   - System warns about the importance of real user interviews
   - Supports both B2C and B2B personas

2. **View Artifacts**
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