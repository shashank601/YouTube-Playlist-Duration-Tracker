# YouTube Playlist Duration Tracker

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-F7DF1E?style=for-the-badge&logo=node.js&logoColor=black)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

Track your progress through YouTube playlists with duration-based progress tracking. Mark videos as watched, see total vs watched duration, and manage multiple playlists in one place.

## Screenshots

<!-- Add screenshots here -->
![App Screenshot](./docs/screenshots/dashboard.png)
![Playlist Detail](./docs/screenshots/playlist-detail.png)

## Tech Stack

### Backend
- Node.js
- Express
- PostgreSQL
- JWT Authentication
- bcrypt

### Frontend
- React
- Vite
- Tailwind CSS
- Axios

### Deployment
- Railway (Backend)
- Vercel (Frontend)

## Features

- User authentication (register/login)
- Add/remove YouTube playlists
- Track individual video progress
- Visual progress bars
- Responsive design
- REST API with JWT auth

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- YouTube Data API v3 key

### Backend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd yt-progress-tracker
```

2. Navigate to backend
```bash
cd backend
```

3. Install dependencies
```bash
npm install
```

4. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your values (see .env.example)
```

5. Run database migrations
```bash
npm run migrate
```

6. Start the development server
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your values (see .env.example)
```

4. Start the development server
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## Environment Variables

### Backend (.env)
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
CLIENT_URL=http://localhost:5173
JWT_EXPIRES_IN=8d
YT_API_KEY=your-youtube-api-key-here
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Playlists
- `GET /api/playlists` - Get user's playlists
- `POST /api/playlists` - Add new playlist
- `DELETE /api/playlists/:id` - Delete playlist

### Videos
- `GET /api/playlists/:id/videos` - Get playlist videos with progress
- `POST /api/playlists/:id/videos/:videoId/mark` - Mark video as watched
- `POST /api/playlists/:id/videos/:videoId/unmark` - Mark video as unwatched

### External
- `GET /api/external/playlist?playlistId=ID` - Fetch playlist metadata from YouTube

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
