# Personal Finance Tracker

A full-stack personal finance application where users can securely track income and expenses, visualize spending patterns through interactive charts, and generate monthly financial summaries.

Built with a React frontend, FastAPI backend, PostgreSQL database, and JWT authentication. Fully deployed on Vercel and Render.

**Live Demo:** [finance-tracker-iota-self.vercel.app](https://finance-tracker-iota-self.vercel.app)
**API Documentation:** [finance-tracker-api-hs9a.onrender.com/docs](https://finance-tracker-api-hs9a.onrender.com/docs)
**GitHub:** [github.com/davidtiger3622/finance-tracker](https://github.com/davidtiger3622/finance-tracker)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL (Neon) |
| Authentication | JWT (JSON Web Tokens) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Features

**Authentication**
- Secure user registration and login
- JWT token-based authentication
- Protected routes — users can only access their own data

**Transactions**
- Add income and expense transactions
- Categorize transactions (food, rent, transport, health, salary, etc.)
- Edit and delete transactions
- View full transaction history

**Dashboard**
- Real-time summary cards — total income, total expenses, current balance
- Savings rate calculation
- Recent transactions table

**Analytics**
- Monthly income vs expenses bar chart
- Spending breakdown by category pie chart
- Month-over-month spending change with trend indicator
- Savings rate tracking

**API**
- RESTful API built with FastAPI
- Auto-generated Swagger documentation
- Input validation with Pydantic schemas
- Organized with APIRouter for clean code structure

---

## Screenshots

### Login
![Login](screenshots/login.png)

### Register
![Register](screenshots/register.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Transactions
![Transactions](screenshots/transactions.png)

### Analytics
![Analytics](screenshots/analytics.png)

### API Documentation (Swagger)
![Swagger](screenshots/swagger.png)

---

## Project Structure

```
finance-tracker/
├── backend/
│   ├── routers/
│   │   ├── auth.py
│   │   ├── transactions.py
│   │   └── analytics.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── auth.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
└── screenshots/
```

---

## Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL database (or a free Neon account)

### Backend Setup

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:

```
DATABASE_URL=your_postgresql_connection_string
SECRET_KEY=your_secret_key
```

Start the backend server:

```
uvicorn main:app --reload
```

API will be running at http://127.0.0.1:8000
Swagger docs at http://127.0.0.1:8000/docs

### Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend will be running at http://localhost:5173

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /auth/register | Register a new user | No |
| POST | /auth/login | Login and receive JWT token | No |
| GET | /transactions/ | Get all user transactions | Yes |
| POST | /transactions/ | Create a new transaction | Yes |
| PUT | /transactions/{id} | Update a transaction | Yes |
| DELETE | /transactions/{id} | Delete a transaction | Yes |
| GET | /analytics/summary | Get income, expenses, balance | Yes |
| GET | /analytics/category-breakdown | Get spending by category | Yes |
| GET | /analytics/monthly-trends | Get monthly income vs expenses | Yes |
| GET | /analytics/spending-insights | Get month-over-month analysis | Yes |

---

## Author

**David Wafula**
- GitHub: [@davidtiger3622](https://github.com/davidtiger3622)
- Email: davidwafula3622@gmail.com
