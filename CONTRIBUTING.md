# Contributing

## Project structure

- `backend/` — FastAPI + SQLAlchemy + Alembic + PostgreSQL (Neon)
- `frontend/` — React + Vite + Tailwind + Recharts

## Local setup

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in real values
alembic upgrade head
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # then fill in real values
npm run dev
```

## Running tests

### Backend
```bash
cd backend
pytest -v
```

### Frontend
```bash
cd frontend
npm run test
```

## Code style

- Backend: linted with [ruff](https://docs.astral.sh/ruff/). Run `ruff check .` from `backend/`.
- Frontend: linted with [oxlint](https://oxc.rs/docs/guide/usage/linter.html). Run `npm run lint` from `frontend/`.
- Pre-commit hooks run these automatically — install with `pre-commit install` after cloning.

## Commit messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` new feature
- `fix:` bug fix
- `chore:` tooling/maintenance
- `docs:` documentation only
- `test:` adding or updating tests
- `refactor:` code change that neither fixes a bug nor adds a feature
- `ci:` CI/CD configuration changes

## Database migrations

Schema changes go through Alembic:
```bash
cd backend
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
```

## Pull requests

- Ensure all tests pass and lint is clean before opening a PR
- CI must pass (backend lint+test, frontend lint+test+build) before merging
