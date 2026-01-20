**Auth API — Frontend Integration Guide**

This document explains how a frontend should integrate with the backend authentication endpoints implemented in this repository. It covers available endpoints, expected request/response shapes, cookie handling, examples using `axios` and `fetch`, CORS configuration, and security notes.

**Assumptions**

- **Route mount:** The user routes are mounted at `/api/users` (e.g. `app.use('/api/users', usersRouter)` in `src/index.js`).
- **Cookie name:** Authentication cookie is set as `token` (httpOnly).
- **Token handling:** The server sets an httpOnly cookie and returns the user object in the response body (no token in response body by default).

**Endpoints**

- `POST /api/users/signup` — Create a new user

  - Request JSON body: `{ name, email, phone, password, role }`
  - Required fields: all five. `role` must be one of: `mosje`, `state`, `pacc`, `sna`, `ia`, `beneficary`.
  - Response: `201` + `{ user: { id, name, email, phone, role } }` and sets httpOnly cookie `token`.
  - Errors: `400` missing fields, `409` email/phone already used, `500` server error.

- `POST /api/users/login` — Login an existing user

  - Request JSON body: `{ email, password }`
  - Response: `200` + `{ user: { id, name, email, phone, role } }` and sets httpOnly cookie `token`.
  - Errors: `400` missing fields, `401` invalid credentials, `500` server error.

# Auth API — Simple Spec

Base path: `/api/users`

## 1) POST `/api/users/signup`

- Input (JSON): `{ name, email, phone, password, role }`
- Role must be one of: `mosje`, `state`, `pacc`, `sna`, `ia`, `beneficary`
- Success (201): `{ user: { id, name, email, phone, role } }`
- Side effect: sets httpOnly cookie `token`
- Errors: `400` (bad input), `409` (email/phone exists), `500`

## 2) POST `/api/users/login`

- Input (JSON): `{ email, password }`
- Success (200): `{ user: { id, name, email, phone, role } }`
- Side effect: sets httpOnly cookie `token`
- Errors: `400` (bad input), `401` (invalid credentials), `500`

## 3) POST `/api/users/logout`

- Input: none
- Success (200): `{ message: "Logged out" }`
- Side effect: clears cookie `token`

Frontend note: send requests with credentials so cookies are included (axios: `withCredentials: true`, fetch: `credentials: 'include'`).

That's it — the frontend receives the `user` object on signup/login and the server manages the auth cookie.
