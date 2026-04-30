import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../pages/register';
import Login from '../pages/login';
import SearchLayout from '../layouts/searchLayout';
import PlaylistDetail from '../pages/playlistDetail';
import { RequireAuth } from '../utils/requireAuth.jsx';
import MyProgressLayout from '../layouts/myProgressLayout';
import TrackedPlaylists from '../pages/trackedPlaylists';
import TrackedVideos from '../pages/trackedVideos';
import { MainLayout } from '../layouts/mainLayout';
import { AuthLayout } from '../layouts/authLayout';
import GuestRoute from '../utils/guestRoutes';


export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout/>}>
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        </Route>
      {/*status completed*/}
        <Route path="/" element={<SearchLayout />} >
          <Route index 
            element={
              <div className=" text-center text-slate-200">
                Got a playlist? Paste it here.
              </div>
            } />
          <Route path=":playlistId" element={<PlaylistDetail />} />
        </Route>

        {/*status on going*/}
        <Route
          path="/myprogress"
          element={
            <RequireAuth>
              <MyProgressLayout />
            </RequireAuth>
          }
        >
          <Route index element={<TrackedPlaylists />} />
          <Route path=":playlistId" element={<TrackedVideos />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

// nested routes were overkill