# MOSJE Fund Release — API Documentation (Frontend)

Endpoint: POST /api/projects/:id/release

Purpose

- Release funds for a project. When MOSJE releases funds, the project's `released_amount` is incremented.
- The endpoint is responsible for safely incrementing `released_amount` and ensuring it does not exceed `allocated_amount` (if `allocated_amount` is set > 0).

Authentication & Role

- Requires authentication. The backend accepts either a cookie (`token`) or `Authorization: Bearer <token>` header.
- Only users with role `mosje` are allowed to call this endpoint. The controller will return HTTP 403 for other roles.

Request

- URL parameter:

  - `:id` — Project ObjectId (or project id string stored in DB) — required

- Method: `POST`
- Body (JSON preferred):
  - `amount` (number | string): required. Positive number representing funds to release.
  - Optional: `projectId` (if not supplied in URL) — the project id.

Validation rules enforced by server

- `amount` must be numeric and > 0.
- Project must exist, otherwise 404 returned.
- If `allocated_amount` on the project is > 0, the endpoint will cap the release so that `released_amount` never exceeds `allocated_amount`.
  - Example: allocated 100000, already released 70000, requested 40000 -> only 30000 actually released (returned as `actual_released`).
- If nothing can be released (allocated reached), server returns 400 with a helpful message.

Response

- Success (HTTP 200):
  {
  "message": "Funds released",
  "success": true,
  "project": {
  "id": "<project id>",
  "prev_released_amount": 70000,
  "released_amount": 100000,
  "actual_released": 30000,
  "allocated_amount": 100000
  }
  }

- Error codes and responses:
  - 400: missing/invalid amount or no funds available to release
  - 401: not authenticated
  - 403: authenticated but not `mosje` role
  - 404: project not found
  - 500: server error

Examples

- Curl (simple):

```bash
curl -X POST "http://localhost:1604/api/projects/PROJECT_ID/release" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 50000}'
```

- Fetch (browser / frontend):

```js
async function releaseFunds(projectId, amount, token) {
  const res = await fetch(`/api/projects/${projectId}/release`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ amount }),
  });
  return res.json();
}

// usage
releaseFunds("64a1b2c3d4e5f6...", 50000, userToken)
  .then((json) => console.log(json))
  .catch((err) => console.error(err));
```

Edge cases & notes

- If `allocated_amount` is `0` (unset) the system treats the project as allowing free releases — the `released_amount` will be incremented by the requested amount.
- The controller returns `actual_released` in the response so the frontend can show exactly how much was applied.
- The controller attempts to set `last_released_by` / `last_released_at` on the project (useful for UI), but if these fields are not in the schema this is a safe no-op.

Frontend suggestions

- Show a confirmation dialog before releasing funds stating: requested amount and current allocated vs released amounts.
- After successful release, refresh the project's display and transaction history.
- Handle partial releases gracefully: inform the user how much was actually released vs requested.

Audit & future improvements

- We recommend adding an audit log of each release as a subdocument array (or a separate `Release` model) with: `{ project_id, released_by, amount, prev_released, new_released, timestamp, note }`.
- If you want, I can add a minimal `ReleaseRecord` schema and endpoints to record/list release history per project.

Contact

- If anything about the expected UI flow or payload shape changes, tell backend which fields you'll send and whether releases must be atomic with other operations (e.g., approvals). I'll adapt the controller accordingly.
