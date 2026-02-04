# Backend - Brainstorming Agent

FastAPI backend for the Brainstorming Agent platform. Provides AI-powered brainstorming capabilities using Gemini's thinking models.

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Gemini API Key

### Setup

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   Create a `.env` file in this directory:
   ```env
   GEMINI_API_KEY=your_key_here
   ```

4. **Run the server:**
   ```bash
   python -m uvicorn data_library.api:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

## 📁 Project Structure

```
backend/
├── data_library/          # Core application code
│   ├── api.py            # FastAPI routes and endpoints
│   ├── brainstorm.py     # Brainstorming logic
│   ├── models.py         # Database models
│   ├── config.py         # Configuration
│   └── ...
├── scripts/              # Utility scripts
│   ├── check_keys.py     # Verify API keys
│   ├── verify_backend.py # Backend health check
│   └── ...
├── tests/                # Test files
│   ├── test_api.py
│   ├── test_integration.py
│   └── ...
├── requirements.txt      # Python dependencies
└── .env                  # Environment variables (not committed)
```

## 🧪 Testing

Run tests from the backend directory:
```bash
python -m pytest tests/
```

## 📚 API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🔧 Development

### Running Scripts
```bash
# Check API keys
python scripts/check_keys.py

# Verify backend
python scripts/verify_backend.py
```

### Database
The application uses SQLite for local development. Database files are stored in the `data/` directory at the project root.

## 🚢 Deployment

See the main project README for deployment instructions.
