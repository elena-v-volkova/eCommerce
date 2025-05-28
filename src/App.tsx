import { Routes, Route } from 'react-router';

import NotFound from './pages/404/NotFound';
import Home from './pages/Home/HomePage';
import Login from './pages/Login/LoginPage';
import Register from './pages/Register/RegisterPage';
import { RedirectIfAuthenticated } from './ProtectedRoute';
import { RoootLayout } from './components/RootLayout/RoootLayout';
import { Profile } from './pages/Profile/ProfilePage';

import { AppRoute } from '@/routes/appRoutes';

function App() {
  return (
    // <Provider store={store}>
    <Routes>
      <Route element={<RoootLayout />} path="/">
        <Route element={<Home />} path={AppRoute.home} />
        <Route
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
          path={AppRoute.login}
        />
        <Route
          element={
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          }
          path={AppRoute.register}
        />
        <Route
          element={
            <RedirectIfAuthenticated>
              <Profile />
            </RedirectIfAuthenticated>
          }
          path={AppRoute.profile}
        />
        <Route element={<NotFound />} path={AppRoute.notFound} />
      </Route>
    </Routes>
    // </Provider>
  );
}
export default App;
