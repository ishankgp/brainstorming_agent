# Brainstorming Agent

A powerful, AI-driven brainstorming platform designed for pharma marketing and strategic planning. This application leverages Gemini's thinking models to generate insights, evidence-backed statements, and strategic frameworks.

## 🚀 Features

- **Strategic Brainstorming**: Create sessions with marketing briefs, lifecycle stages, and target audiences.
- **AI-Powered Insights**: Uses Gemini Thinking models to generate high-quality brainstorming outputs.
- **Evidence-Backed**: Automatically gathers and cites evidence from uploaded source documents.
- **Statement Library**: Review, score, and lock final brainstorming statements into a persistent library.
- **Agent Studio**: Manage custom agent personas with specific system prompts and tools.
- **Document Management**: Integrated document library for uploading and searching source materials.
- **Modern UI**: A "Minimalist Modern" design system built for professional and artistic sensibilities.

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy with SQLite
- **LLM Integration**: Gemini (Google AI)
- **Process Orchestration**: Custom agentic flow for multi-step reasoning

### Frontend
- **Framework**: React + TypeScript (Vite)
- **Styling**: Tailwind CSS
- **Design System**: Custom "Minimalist Modern" with Framer Motion animations
- **State Management**: React Hooks

## 📦 Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API Key

### Backend Setup
1. Navigate to the root directory.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file (see `.env.example` if available) and add your API keys:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
5. Run the server:
   ```bash
   python -m uvicorn data_library.api:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🖥 Usage

1. **Upload Documents**: Start by adding source documents to the library via the Documents tab.
2. **Create Session**: Set up a new brainstorming session with your marketing brief and target audience.
3. **Add Inputs**: Provide starting statements or questions to guide the AI.
4. **Run Brainstorm**: Initiate the AI run to generate insights and gather evidence.
5. **Review & Lock**: Evaluate the results and save the best statements to your library.

---

*Built with ❤️ by the Brainstorming Agent Team*
