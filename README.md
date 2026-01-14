# Flora English Learning Platform

Comprehensive architecture documentation and implementation for the Flora English learning platform.

## 📁 Documentation

Complete technical documentation is available in the `.gemini` directory:

- [System Architecture](./01_system_architecture.md)
- [MongoDB Schema](./02_mongodb_schema.md)
- [API Specification](./03_api_specification.md)
- [Role & Permission Matrix](./04_role_permission_matrix.md)
- [UI Sitemap](./05_ui_sitemap.md)
- [Folder Structure](./06_folder_structure.md)
- [Event Tracking](./07_event_tracking.md)
- [Deployment Plan](./08_deployment_plan.md)
- [Test Plan](./09_test_plan.md)

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:

```bash
cd instruction-be
```

2. Create virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

3. Copy environment configuration:

```bash
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY
```

4. Start MongoDB:

```bash
docker run -d -p 27017:27017 --name flora-mongo mongo:6.0
```

5. Seed the database:

```bash
python scripts/seed_data.py
```

6. Run the backend server:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend will be available at http://localhost:8000

- API Docs: http://localhost:8000/docs

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd instruction-fe
```

2. Install dependencies:

```bash
yarn install
# or npm install
```

3. Start development server:

```bash
yarn dev
# or npm run dev
```

Frontend will be available at http://localhost:5173

## 🔑 Demo Accounts

- **Admin**: `admin` / `admin123`
- **Student 1**: `student001` / `password123`
- **Student 2**: `student002` / `password123`

## ✅ Current Implementation Status

### Backend ✅

- [x] FastAPI application setup
- [x] MongoDB connection
- [x] JWT authentication (login/logout/refresh)
- [x] User models and schemas
- [x] Groups endpoint
- [x] Database seed script
- [ ] Pronunciation assessment (Gemini AI)
- [ ] Situation quiz endpoints
- [ ] Dashboard statistics
- [ ] Admin endpoints

### Frontend ✅

- [x] React + Vite + Material UI setup
- [x] Authentication (login/logout)
- [x] Protected routes
- [x] Introduction page
- [x] Login page
- [x] Home page with group selection
- [x] Notification system
- [ ] Pronunciation practice pages
- [ ] Situation quiz pages
- [ ] User dashboard
- [ ] Admin panel

## 🎯 Next Steps

1. **Pronunciation Feature**: Implement Gemini AI integration for pronunciation scoring
2. **Situation Quizzes**: Build quiz player and results pages
3. **Dashboard**: Create user statistics and progress tracking
4. **Admin Panel**: Implement user and content management

## 📚 Tech Stack

- **Frontend**: React 19, Material UI 7, Vite, Axios, React Router
- **Backend**: FastAPI, Motor (async MongoDB), Pydantic
- **Database**: MongoDB 6.0
- **AI**: Google Gemini API
- **Auth**: JWT tokens

## 📖 Learn More

See the individual README files in each directory for detailed setup and development instructions:

- [Backend README](./instruction-be/README.md)
- [Frontend README](./instruction-fe/README.md)
