# PropTech Nexus

**PropTech Nexus** is a full-stack real estate analytics platform designed to provide comprehensive geospatial data, portfolio analytics, and property auditing capabilities.

## 🚀 Features

- **Interactive Map Dashboard**: Visualize properties with geospatial filtering and bounding box queries.
- **Real-Time Property Audits**: View deep analytics including net cashflow, annualized ROI, security scoring, and hazard evaluation.
- **Advanced Filtering**: Filter properties by price, ROI, security score, and environmental hazards (e.g., flood zones).
- **Security Terminal**: Command-line style interface for monitoring global sentinel statuses.

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Maps**: React-Leaflet / Custom Map Integration
- **State Management**: React Hooks (useState, useMemo, useCallback)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (with PostGIS for geospatial queries)
- **Deployment**: Railway / Vercel

```mermaid
graph TD
    A[Next.js Frontend] -->|REST API Calls| B[FastAPI Backend]
    B -->|SQL Queries| C[(PostgreSQL + PostGIS)]
    A -->|Renders| D[Interactive Map Dashboard]
    A -->|Displays| E[Property Audit Metrics]
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- Python 3.9+
- PostgreSQL with PostGIS extension

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your `.env` file with your database credentials:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/proptech_nexus
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload
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
3. Set up your `.env.local` file:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```
4. Run the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:3000`.

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.
