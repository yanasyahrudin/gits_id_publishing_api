# GITS.ID - Publisher API (Case Study)

> Simple REST API for managing Authors, Publishers and Books.

This project was implemented using Node.js, Express and Sequelize (PostgreSQL). It includes migrations and seeders and supports JWT authentication.

## Contents
- `app.js` - application entry
- `models/` - Sequelize models (Author, Publisher, Book, User)
- `migrations/` - Sequelize migrations
- `seeders/` - initial data seeders
- `routes/` - Express routes for auth, authors, publishers, books
- `config/config.js` - DB configuration for Sequelize
- `My Collection.postman_collection.json` - Postman collection (import to test endpoints)

## Quick setup

Prerequisites:
- Node.js (16+ recommended)
- PostgreSQL (or adjust `config/config.js` for another DB supported by Sequelize)

1. Install dependencies

```bash
npm install
```

2. Create `.env` file in project root (see example below) and set your values

```env
# PostgreSQL / DB
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=publisher_db
DB_HOST=localhost

# App
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=change_this_to_a_secure_secret
```

3. Run migrations and seeders

The project includes `sequelize-cli` as a dev dependency. Use npx to run migrations and seeders:

```bash
# create the database (if you don't have it already)
# for Postgres you can run: createdb -U postgres publisher_db

npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

4. Start the server

There are npm scripts to start the server:

- Start (production / plain Node)
```bash
npm run start
```

- Dev (auto-reload using nodemon)
```bash
npm run dev
```

If you don't have nodemon installed globally, `npm run dev` will use the devDependency `nodemon` via npm scripts. The server listens on the port defined in `.env` (default 3000).

Set a different port via environment variable:

- PowerShell:
```powershell
$env:PORT=4000; npm run start
```

- CMD:
```cmd
set PORT=4000&& npm run start
```

Or edit `.env` and change PORT.

You can also run directly:
```bash
node app.js
# or
npx nodemon app.js
```

The server will listen on the port from `PORT` or default `3000`.

## Environment variables (summary)
- DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST
- PORT (optional)
- NODE_ENV (optional)
- JWT_SECRET (required for authentication)

## Authentication

- Register: POST /api/auth/register
- Login: POST /api/auth/login

Login returns a JWT token. All other API endpoints (authors, publishers, books) require an Authorization header:

```
Authorization: Bearer <token>
```

## Unit tests

This project includes unit tests using Jest and Supertest. Tests are placed under the test/ directory (example: test/auth.jest.js). The test runner and configuration are declared in package.json.

Run all tests:
```bash
npm test
```

Run a single test file:
```
npx jest test/auth.jest.js
```

Notes:
- Some tests mock the database/models and cryptography/token libraries (see test/auth.jest.js), so they do not require a running database.
- Tests that exercise authentication may require the JWT_SECRET environment variable. You can set it inline before running tests:
  - Unix/macOS:
  ```bash
  JWT_SECRET=test-secret npm test
  ```
  - Windows (PowerShell):
  ```
  $env:JWT_SECRET='test-secret'; npm test
  ```
- Tests use the route handlers defined in routes/auth.js and may mock bcryptjs, jsonwebtoken, and the Sequelize models.

You can also run Jest with coverage reporting:
```bash
npx jest --coverage
```

## API Endpoints

Base path: `/api`

Auth
- POST /api/auth/register
  - Body: { "username": "user", "password": "pass" }
  - Response: { message: 'User registered' }

- POST /api/auth/login
  - Body: { "username": "user", "password": "pass" }
  - Response: { token: "<jwt>" }

Authors (protected)
- GET /api/authors - list all authors (with their books)
- GET /api/authors/:id - get single author
- POST /api/authors - create author
  - Body: { "name": "Author Name" }
- PUT /api/authors/:id - update author
  - Body: { "name": "New Name" }
- DELETE /api/authors/:id - delete author

Publishers (protected)
- GET /api/publishers - list all publishers (with their books)
- GET /api/publishers/:id - get single publisher
- POST /api/publishers - create publisher
  - Body: { "name": "Publisher Name" }
- PUT /api/publishers/:id - update publisher
- DELETE /api/publishers/:id - delete publisher

Books (protected)
- GET /api/books - list all books (with author and publisher)
- GET /api/books/:id - get single book
- POST /api/books - create book
  - Body: { "title": "Book Title", "authorId": 1, "publisherId": 1 }
- PUT /api/books/:id - update book
- DELETE /api/books/:id - delete book

## Example (curl)

Register and login flow:

```bash
# register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# you'll receive a JSON with {"token":"..."}
# use that token to access protected endpoints:
curl http://localhost:3000/api/authors -H "Authorization: Bearer <token>"
```

## Postman

There is a Postman collection file `My Collection.postman_collection.json` in project root. Import it into Postman and set an environment variable `token` after logging in. The collection contains requests for all endpoints.


