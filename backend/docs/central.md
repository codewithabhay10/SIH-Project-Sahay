**Central Model & API**

- **Location**: `backend/src/models/central.model.js`
- **Controller**: `backend/src/controllers/central.controller.js`
- **Route**: `backend/src/routes/central.route.js` (mounted at `GET /api/central`)

**Overview**:

- **Purpose**: Stores global/central fund information used by the backend: a short `info` string, the `total_balance` available centrally, and the `total_released` amount that has been released from the central pool.
- The current implementation exposes a read endpoint `GET /api/central` that returns the single Central document. If no document exists, the controller will create a default one and return it.

**Schema (conceptual)**:

- `info` : String — optional descriptive text
- `total_balance` : Number — total available central balance (default `0`, min `0`)
- `total_released` : Number — total funds released from central pool (default `0`, min `0`)
- `createdAt` / `updatedAt` — timestamps (managed by Mongoose)

**API: GET /api/central**

- **Description**: Returns the Central record. Creates a default Central document when none exists.
- **Method**: `GET`
- **URL**: `/api/central`
- **Auth**: None by default (open). Consider adding authentication/role checks if this data should be restricted.

Request example:

```
GET /api/central HTTP/1.1
Host: localhost:1604
```

Successful response (200):

```
{
  "success": true,
  "central": {
    "id": "64e...",
    "info": null,
    "total_balance": 100000,
    "total_released": 25000,
    "createdAt": "2025-12-08T12:00:00.000Z",
    "updatedAt": "2025-12-08T12:00:00.000Z"
  }
}
```

Error responses:

- `500` — server/database error. Response includes `success: false` and an `error` message.

Example curl (quick test):

```bash
curl http://localhost:1604/api/central
```

**Behavior notes & implementation details**:

- The controller uses `Central.findOne()` to fetch any central record. If none exists it creates a new `Central()` with defaults and saves it. This simplifies clients by guaranteeing a returned document.
- The code returns numeric values coerced to `Number` so JSON clients always receive numbers, not `null` or string types.
- The project currently has no write endpoints for the central record. All modifications must be made directly in code or the database until write endpoints are added.

**Suggested next steps / improvements**:

- Add authenticated write endpoints:
  - `POST /api/central` — create/initialize (admin only)
  - `PATCH /api/central` — update `info`, adjust `total_balance` or `total_released` with validation and audit fields
- Add server-side validation and transactional updates when releasing funds. For example, a single operation that decreases `total_balance` and increases `total_released` atomically (using MongoDB transactions or careful findOneAndUpdate checks).
- Add audit fields: `last_modified_by`, `last_modified_at`, and an activity log collection to record releases and deposits.
- Add unit/integration tests for the controller and route.
- Consider restricting `GET /api/central` to authenticated users, or at least to internal services, depending on business rules.

**Files changed when this feature was added**:

- `backend/src/models/central.model.js` — Mongoose model for Central
- `backend/src/controllers/central.controller.js` — `getCentralInfo` controller
- `backend/src/routes/central.route.js` — route file that is mounted at `/api/central`
- `backend/src/index.js` — route was mounted: `app.use('/api/central', centralRoutes)`

If you'd like, I can:

- Add write endpoints with role-based checks (mosje/admin) to adjust balances atomically.
- Add a short Postman collection or automated tests demonstrating the API.
