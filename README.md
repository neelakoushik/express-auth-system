# Express Authentication API

A beginner-friendly user authentication API built with Node.js and Express. It includes registration, login, bcrypt password hashing, request validation, JWT bearer authentication, rate limiting, and a Postman collection.

> This starter stores users in `data/users.json` so you can run it without installing a database. Use a real database and a managed secret store before deploying a public production service. The JSON file store is intended for local learning and single-process use.

## Requirements

- Node.js 18 or newer
- VS Code
- Postman (desktop or web)

## Run in VS Code

1. Download and extract `express-auth-system.zip`.
2. In VS Code, choose **File → Open Folder…** and select the extracted `express-auth-system` folder.
3. Open **Terminal → New Terminal**.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Create your local environment file by copying `.env.example` to `.env`.
   - Windows PowerShell: `Copy-Item .env.example .env`
   - macOS/Linux: `cp .env.example .env`
6. Open `.env` and replace `JWT_SECRET` with a random secret of at least 32 characters. Keep `.env` private; it is ignored by Git.
7. Start the server:

   ```bash
   npm run dev
   ```

   Or use `npm start` for the non-reloading server.
8. In a browser, open `http://localhost:3000/api/health`. You should see `{"status":"ok"}`.

## API endpoints

Base URL: `http://localhost:3000`

| Method | Path | Purpose | Success |
| --- | --- | --- | --- |
| GET | `/api/health` | Check that the server is running | 200 |
| POST | `/api/auth/register` | Create an account | 201 |
| POST | `/api/auth/login` | Verify credentials and get a JWT | 200 |
| GET | `/api/auth/me` | Get the signed-in user's public profile | 200 |

### Register

`POST /api/auth/register` with JSON:

```json
{
  "name": "Alex Example",
  "email": "alex@example.com",
  "password": "StrongPass123"
}
```

Name must be 2–80 characters. Email must be valid. Password must be 8–128 characters and include a lowercase letter, uppercase letter, and number. A repeated email returns `409`; invalid fields return `400`. The API never returns the password hash.

### Login

`POST /api/auth/login` with JSON:

```json
{
  "email": "alex@example.com",
  "password": "StrongPass123"
}
```

The response includes a signed JWT. Invalid credentials return `401` with a generic message.

### Get current user

`GET /api/auth/me` with header:

```text
Authorization: Bearer <token-from-login>
```

Missing, invalid, and expired tokens return `401`.

## Test with Postman

1. Import `postman/Express-Auth-API.postman_collection.json` in Postman (**Import → Files**).
2. Start the API in VS Code as described above.
3. Run the **Express Auth API** collection using the collection runner.
4. The collection checks health, rejects invalid registration, registers a unique user, rejects a duplicate registration, rejects a wrong password, logs in, saves the JWT automatically, verifies `/me`, and rejects `/me` without a token.

The register request creates a new email each run using a timestamp, so you can rerun the collection. The collection also checks response status and important response fields.

## Project files

```text
src/server.js          Express app and middleware
src/authRoutes.js      Registration, login, and profile routes
src/authMiddleware.js  JWT verification middleware
src/validation.js      Input validation rules
src/userStore.js       Local JSON file persistence
data/users.json        Local user records (ignored by Git)
postman/               Importable API collection
.env.example           Environment variable template
```

## Notes

- Passwords are hashed with bcryptjs using 12 rounds; plaintext passwords are never saved.
- JWTs use HS256 and expire after one hour by default. Adjust `JWT_EXPIRES_IN` in `.env` if needed.
- Login and registration routes are rate limited, and Helmet sets common security headers.
- `data/users.json` contains password hashes. Do not publish it or commit it.
