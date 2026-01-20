# Projects & Proposals API — Frontend Guide

This document describes the backend API endpoints for Projects and Proposals, expected request shapes, authentication, file uploads, and example requests for the frontend engineer.

Base URL (development): `http://localhost:1604/api`

Authentication

- The backend accepts auth via cookie (`token`) or Authorization header `Bearer <token>`.
- All protected endpoints in this doc require authentication.

Common response structure

- Success responses generally follow:
  {
  "message": "...",
  "success": true,
  "project": { ... } // or "proposal" / "projects"
  }
- Errors: `{ message: "...", success: false, error?: "..." }`

File uploads

- Endpoints that accept files use `multipart/form-data`.
- Form field for files: `supporting_documents` (multiple). Up to 10 files, each max 10 MB.
- Allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`, `image/jpg`.
- Files are uploaded to Cloudinary. The saved document objects in DB have: `{ filename, url, mimeType, size }`.

Notes about sending nested proposal data

- Project endpoints can accept a nested `proposal` payload. When using `multipart/form-data` include the proposal as a string field:
  `form.append('proposal', JSON.stringify({ title: '...', estimated_budget: 50000, ... }))`
- The backend will also accept proposal as a parsed object when sending JSON (no files).

Models (key fields)

- Project (important fields)

  - \_id (ObjectId)
  - project_name (string) — required when submitting
  - project_id (string) — optional unique identifier
  - district, state, IA_code, SNA_code (strings)
  - status (enum): `draft`, `submitted`, `in_progress`, `approved`, `rejected`
  - allocated_amount (number)
  - released_amount (number)
  - proposal (ObjectId reference to Proposal)
  - supporting_documents: array of `{ filename, url, mimeType, size }`
  - created_by (User ref)
  - approved_by, approved_at, rejected_by, rejected_at, rejection_reason

- Proposal (important fields)
  - title (string) — required when submitting
  - category (string)
  - district (string)
  - estimated_budget (number)
  - start_date, end_date (Date)
  - expected_beneficiary_count (number)
  - target_groups (array of enums): `Women`, `Youth (<35)`, `SC/ST`, `Minorities`, `Disabled`, `BPL Families`, `Farmers`, `Rural Poor`
  - eligibility_criteria (string)
  - objective (string)
  - activities: array of `{ activity: string }`
  - expected_outcomes (string)
  - implementation_partners (array of enums): `State Government`, `District Administration`, `Educational Institutions`, `NGOs`, `Community Organizations`
  - implementation_timeline: array of `{ name, start_date, end_date }`
  - convergence_needs: array of `MGNREGA`, `State Skill Development`, `Others`
  - budget_breakup: array of `{ category, description, amount }`
  - supporting_documents: array of `{ filename, url }`
  - status (enum): `draft`, `submitted`, `under_review`, `approved`, `rejected`

Endpoints

**Projects**

- POST `/api/projects/draft`

  - Purpose: Create a new project draft or update existing draft.
  - Auth: required (any authenticated user). If updating an existing draft, include `_id` or `projectId` in body.
  - Body (multipart/form-data or JSON):
    - `project_name` (string) — optional for draft
    - `project_id`, `district`, `state`, `IA_code`, `SNA_code`
    - `allocated_amount`, `released_amount` (numbers)
    - `proposal` (object or stringified JSON) — nested proposal payload (see Proposal section)
    - `supporting_documents` (files) — multiple files
  - Notes:
    - If `proposal` is provided it will be created and linked to the project.
    - To update an existing draft include `_id` or `projectId` in the body. Only drafts may be updated by their creator.
  - Example (fetch + FormData):

    ```js
    const fd = new FormData();
    fd.append("project_name", "Skill Training");
    fd.append("district", "Some District");
    fd.append(
      "proposal",
      JSON.stringify({ title: "Training", estimated_budget: 50000 })
    );
    fd.append("supporting_documents", fileInput.files[0]);

    fetch("/api/projects/draft", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: fd,
    });
    ```

- POST `/api/projects/submit`

  - Purpose: Submit a project for approval (creates project with status `submitted`).
  - Auth: required; role `state` only.
  - Body: same fields as draft, but `project_name` is required.
  - Behavior: If nested `proposal` is provided it will be created and linked. Uploaded files attached to project/proposal.
  - Example (curl):
    ```bash
    curl -X POST "http://localhost:1604/api/projects/submit" \
      -H "Authorization: Bearer <token>" \
      -F "project_name=My Project" \
      -F "district=Some District" \
      -F "proposal={\"title\":\"My Proposal\",\"estimated_budget\":100000 }" \
      -F "supporting_documents=@/path/to/doc.pdf"
    ```

- GET `/api/projects`

  - Purpose: List projects
  - Auth: required
  - Query params:
    - `page` (default 1), `limit` (default 20, max 100)
    - `status`, `district`, `state`, `search` (searches `project_name` case-insensitive)
  - Response: `{ success: true, meta: { total, page, limit, pages }, projects: [...] }`

- POST `/api/projects/:id/approve`

  - Purpose: Approve a project
  - Auth: required; role `pacc` only.
  - Behavior: Sets `status = 'approved'`, records `approved_by` and `approved_at`.
    - Also ensures `allocated_amount` is at least the linked proposal's `estimated_budget` (if present).
  - Example:
    ```bash
    curl -X POST "http://localhost:1604/api/projects/PROJECT_ID/approve" -H "Authorization: Bearer <token>"
    ```

- POST `/api/projects/:id/reject`
  - Purpose: Reject a project
  - Auth: required; role `pacc` only.
  - Body (JSON): `{ "reason": "Optional rejection reason" }`
  - Behavior: Sets `status = 'rejected'`, records `rejected_by`, `rejected_at`, and `rejection_reason`.

**Proposals**

- POST `/api/proposals/draft`

  - Purpose: Save a proposal draft.
  - Auth: required
  - Body (multipart/form-data or JSON): proposal fields from the schema above, and `supporting_documents` files.
  - Example: same pattern using FormData + `proposal` fields.

- POST `/api/proposals/submit`
  - Purpose: Submit a proposal.
  - Auth: required; controller enforces `state` role for submission.
  - Body: proposal fields; `title` and `estimated_budget` should be provided when submitting.

Frontend integration tips & examples

- Sending files and fields together (upload + proposal nested):

  ```js
  const fd = new FormData();
  fd.append("project_name", "My Project");
  fd.append("district", "X");
  fd.append(
    "proposal",
    JSON.stringify({ title: "P1", estimated_budget: 12345 })
  );
  fd.append("supporting_documents", fileInput.files[0]);

  const res = await fetch("/api/projects/submit", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: fd,
  });
  const json = await res.json();
  console.log(json);
  ```

- Sending JSON-only (no files):
  ```js
  fetch("/api/projects/draft", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project_name: "x",
      proposal: { title: "p", estimated_budget: 1000 },
    }),
  });
  ```

Error handling & robustness

- Backend expects unpredictable input. The controllers use safe JSON parsing for nested `proposal` fields. If parsing fails, no crash — the proposal is ignored.
- When updating drafts, the backend verifies ownership and draft status before allowing modifications.
- Approval / rejection endpoints enforce role checks and return helpful HTTP codes (401, 403, 404, 400).

Environment variables for file uploads

- To upload files via Cloudinary the backend needs:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

If you need, I can also produce a small frontend example (React + Axios) demonstrating creating/updating drafts, uploading files, and submitting projects. Reach out which example you prefer (Axios or fetch, React or vanilla JS).
