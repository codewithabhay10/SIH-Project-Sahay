# Auth API — Integration Guide

This document describes the authentication endpoints provided by the backend and gives small, copy/paste-friendly examples for integrating an Expo/React Native frontend.

Base URL

- Default dev base: `http://localhost:1604`
- Production base: use your deployed API URL (set on the client as `BASE_URL`).

Overview

- Endpoints: `POST /api/users/signup`, `POST /api/users/login`, `POST /api/users/logout`.
- The API returns a JSON payload with `user` and `token` (JWT). The server also sets an HttpOnly cookie `token`. For mobile apps we recommend using the returned token and sending it in the `Authorization` header.
- Role strings used by backend include `beneficary` (note spelling) and `enumerator`.

1. POST /api/users/signup

- Description: Create a new user and sign them in.
- URL: `/api/users/signup`
- Method: `POST`
- Request body (application/json):

```json
{
  "phoneNumber": "9123456789",
  "password": "supersecret",
  "role": "beneficary"
}
```

- Success: `201 Created`

```json
{
  "user": {
    "id": "64f...abc",
    "phoneNumber": "9123456789",
    "role": "beneficary",
    "beneficaryInfo": null,
    "enumeratorInfo": null
  },
  "token": "<JWT>"
}
```

2. POST /api/users/login

- Description: Authenticate existing user.
- URL: `/api/users/login`
- Method: `POST`
- Request body (application/json):

```json
{
  "phoneNumber": "9123456789",
  "password": "supersecret"
}
```

- Success: `200 OK` (body same shape as signup with `user` + `token`).

3. POST /api/users/logout

- Description: Clears server cookie (if present). Client should also remove stored token.
- URL: `/api/users/logout`
- Method: `POST`
- Request body: none
- Success: `200 OK` - `{ "message": "Logged out" }`

Cookie vs header token (recommended for mobile)

- The server sets an HttpOnly cookie named `token`. Native apps (Expo) may not reliably preserve or send cookies across requests. Therefore the recommended flow for Expo is:
  1. Use the `token` returned in the JSON response from login/signup.
  2. Store it securely on device (Expo SecureStore or Keychain). Avoid AsyncStorage for production secrets.
  3. Send `Authorization: Bearer <token>` in subsequent requests.
  4. Call `POST /api/users/logout` (optional) and delete local token on logout.

Client Examples (Expo)

Axios + Expo SecureStore (preferred)

```js
// api.js
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const BASE_URL = process.env.BASE_URL || "http://localhost:1604";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Attach token automatically
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("auth_token");
  if (token)
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
});

export default api;
```

Login / Signup helpers

```js
import api from "./api";
import * as SecureStore from "expo-secure-store";

export async function signup({ phoneNumber, password, role }) {
  const res = await api.post("/api/users/signup", {
    phoneNumber,
    password,
    role,
  });
  const { token, user } = res.data;
  await SecureStore.setItemAsync("auth_token", token);
  await SecureStore.setItemAsync("auth_user", JSON.stringify(user));
  return user;
}

export async function login({ phoneNumber, password }) {
  const res = await api.post("/api/users/login", { phoneNumber, password });
  const { token, user } = res.data;
  await SecureStore.setItemAsync("auth_token", token);
  await SecureStore.setItemAsync("auth_user", JSON.stringify(user));
  return user;
}

export async function logout() {
  try {
    await api.post("/api/users/logout");
  } catch (e) {
    /* ignore */
  }
  await SecureStore.deleteItemAsync("auth_token");
  await SecureStore.deleteItemAsync("auth_user");
}
```

Fetch example (if you need plain fetch)

```js
const res = await fetch(`${BASE_URL}/api/users/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phoneNumber, password }),
});
const data = await res.json();
// store data.token in SecureStore
```

Error handling

- 400: missing/invalid input — show helpful message
- 401: invalid credentials — show "Invalid phone number or password"
- 409: user already exists (on signup)
- 500: server error
- The API returns small JSON errors like `{ "error": "..." }`.

Integration checklist for frontend engineer

- [ ] Add shared HTTP client (`api`) and set `baseURL`.
- [ ] Add secure storage: `expo install expo-secure-store` and use `SecureStore`.
- [ ] Implement `login`, `signup`, `logout` helpers as above.
- [ ] Add request interceptor to attach `Authorization: Bearer <token>` header.
- [ ] Protect app screens by checking for stored `auth_token` on app start and routing to login if missing.
- [ ] Clear storage on logout and navigate to the login screen.

Notes & gotchas

- Backend role uses the misspelled `beneficary` string — use the same value when creating users unless backend is changed.
- JWT expiry: controlled by `JWT_EXPIRES_IN` (default `7d`). There is no refresh-token flow implemented; re-login is required after expiry.
- If you prefer cookie-only flow, set your HTTP client to include credentials (`axios: withCredentials: true`, `fetch: credentials: 'include'`) and make sure CORS allows credentials. This is less reliable on Expo.

Quick testing with curl

Signup:

```bash
curl -X POST http://localhost:1604/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9123456789","password":"secret","role":"beneficary"}'
```

Login:

```bash
curl -X POST http://localhost:1604/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9123456789","password":"secret"}'
```

Logout:

```bash
curl -X POST http://localhost:1604/api/users/logout
```

If you want, I can also:

- Produce a ready-to-drop `auth.ts` file to add to the Expo app (using SecureStore + axios).
- Implement a small `AuthContext` / hook that manages user state and navigation on the Expo side.

---

File: `app-backend/docs/auth-doc.md`
