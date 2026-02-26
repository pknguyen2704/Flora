# Flora Backend

FastAPI backend for the Flora English Learning Platform.

## Setup

### 1. Create virtual environment

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

**Important**: Set your `GEMINI_API_KEY` in `.env` for pronunciation features.

### 4. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name flora-mongo mongo:6.0

# Or start your local MongoDB instance
```

### 5. Seed the database

```bash
python scripts/seed_data.py
```

This creates:

- Admin user: `admin` / `admin123`
- Test users: `student001`, `student002` / `password123`
- 5 content groups
- 100 instructions (20 per group)
- 100 situations (20 per group)

### 6. Run the server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, visit:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

## Project Structure

```
app/
├── api/v1/endpoints/    # API endpoints
├── core/                # Configuration, security
├── db/                  # Database connection
├── models/              # Pydantic models
├── schemas/             # Request/response schemas
├── services/            # Business logic
└── main.py              # FastAPI app
```

## Testing

```bash
# Run tests (when implemented)
pytest app/tests/ -v
```

## Development

The server uses auto-reload, so code changes will automatically restart the server.

View logs in the console for debugging.
