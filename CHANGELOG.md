# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- `.env.example` files for backend and frontend documenting required environment variables
- Alembic migrations for database schema management, replacing `create_all()`
- Backend test suite (pytest) covering auth, transactions, and analytics endpoints
- Frontend test suite (Vitest + Testing Library) covering all pages, auth context, and navigation
- CI/CD pipeline (GitHub Actions) running lint, tests, and build on every push
- Rate limiting on `/auth/login` and `/auth/register` to prevent brute-force attempts
- Refresh token support with rotation and revocation (`/auth/refresh`, `/auth/logout`)
- `/health` endpoint with database connectivity check
- Pre-commit hooks running ruff (backend) and oxlint (frontend) before each commit
- `CONTRIBUTING.md` with local setup, testing, and commit convention guidelines

### Fixed
- Hardcoded frontend API URL replaced with configurable `VITE_API_URL` environment variable
- Application now fails fast at startup if `SECRET_KEY` or `DATABASE_URL` are missing
- Docker containers now run Alembic migrations automatically on startup
- Frontend Docker build now correctly receives `VITE_API_URL` as a build argument

### Changed
- Replaced deprecated `datetime.utcnow()` with timezone-aware `datetime.now(UTC)`
- Replaced deprecated Pydantic `.dict()` calls with `.model_dump()`
- Replaced deprecated Pydantic class-based `Config` with `ConfigDict`
- Replaced deprecated SQLAlchemy `declarative_base` import path
