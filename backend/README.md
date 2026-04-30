# YouTube Playlist Tracker – Backend API

Backend API for managing users, playlists, and per-video progress tracking.
Authentication is token-based (JWT expected in `Authorization` header for protected routes).

Base URL (example):
`http://localhost:5000`

---

## 1. Health Check

### `GET /health`

Used to verify server availability.

**Request Body**
None

**Response**

```json
{
  "status": "ok"
}
```

---

## 2. Authentication Routes

Base Path: `/api/auth`

---

### `POST /api/auth/register`

Register a new user.

**Request Body**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Success Response**

```json
{
  "id": "number",
  "username": "string",
  "email": "string"
}
```

**Error Response**

```json
{
  "error": "message"
}
```

---

### `POST /api/auth/login`

Authenticate user and receive JWT token.

**Request Body**

```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response**

```json
{
  "token": "jwt_token_string"
}
```

**Error Response**

```json
{
  "error": "message"
}
```

---

### `GET /api/auth/verify`

Verify JWT token and get user ID.

**Headers**

```
Authorization: Bearer <token>
```

**Success Response**

```json
{
  "id": "number"
}
```

**Error Response**

```json
{
  "error": "message"
}
```

---

## 3. Playlist Routes (Protected)

Base Path: `/api/playlists`
Requires: `Authorization: Bearer <token>`

---

### `GET /api/playlists`

Get all playlists for a user.

**Request Body / Query**

```json
{
  "userId": "number"
}
```

(or as query parameter)

**Response**

```json
[
  {
    "playlistId": "string",
    "title": "string",
    "thumbnail": "string"
  }
]
```

---

### `POST /api/playlists`

Create a new playlist.

**Request Body**

```json
{
  "userId": "number",
  "playlistId": "string",
  "title": "string"
}
```

**Response**

```json
{
  "playlistId": "string",
  "title": "string"
}
```

**Error**

```json
{
  "error": "message"
}
```

---

### `DELETE /api/playlists/:playlistId`

Delete a playlist.

**Request Body**

```json
{
  "userId": "number"
}
```

**Success Response**

```json
{
  "message": "Playlist deleted",
  "deleted": {
    "playlistId": "string",
    "title": "string"
  }
}
```

**Error**

```json
{
  "error": "message"
}
```

---

## 4. Video Status Routes (Protected)

Used to track progress of videos inside a playlist.

Requires: `Authorization: Bearer <token>`

---

### `GET /api/playlists/:playlistId/videos`

Get video progress for a playlist.

**Request Body**

```json
{
  "user_id": "number"
}
```

**Response**

```json
[
  {
    "videoId": "string",
    "duration": "number",
    "completed": "boolean"
  }
]
```

---

### `POST /api/playlists/:playlistId/videos/:videoId/mark`

Mark a video as completed or update duration.

**Request Body**

```json
{
  "user_id": "number",
  "duration": "number"
}
```

**Response**

```json
{
  "videoId": "string",
  "duration": "number",
  "completed": true
}
```

---

### `POST /api/playlists/:playlistId/videos/:videoId/unmark`

Unmark a video (mark as incomplete).

**Request Body**

```json
{
  "user_id": "number",
  "duration": "number"
}
```

**Response**

```json
{
  "videoId": "string",
  "duration": "number",
  "completed": false
}
```

---

## 5. External YouTube Routes

Base Path: `/api/external`

---

### `GET /api/external/playlist?playlistId=XYZ`

Fetch playlist details from YouTube API.

**Request Body**
None (uses query parameter `playlistId`)

**Response**

```json
{
  "playlist": {
    "title": "string",
    "thumbnail": "string"
  },
  "videos": [
    {
      "title": "string",
      "videoId": "string",
      "thumbnail": "string",
      "videoUrl": "string",
      "duration": "string"
    }
  ]
}
```

---

## Authentication Notes

* Protected routes require:

  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
* Token is received from `/api/auth/login`.
* Server validates token before allowing access.

---

## Error Handling Convention

All errors follow:

```json
{
  "error": "descriptive message"
}
```

---

## Project Structure Expectation (High-Level)

* Auth → User management
* Playlists → User-saved playlists
* Video Status → Per-video progress tracking
* External → YouTube data fetch layer

---

If this backend is meant to support your React frontend:

* Pages call services.
* Services call these routes.
* Token stored (httpOnly cookie or memory) must be attached on protected requests.

Now stop reading and integrate one route properly in frontend without guessing.
