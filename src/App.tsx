import { Routes, Route, Outlet } from 'react-router';

import NotFound from './pages/404/NotFound';
import Home from './pages/Home/HomePage';
import Login from './pages/Login/LoginPage';
import Register from './pages/Register/RegisterPage';
import { RedirectIfAuthenticated } from './ProtectedRoute';

import { AppRoute } from '@/routes/appRoutes';
import { AuthProvider } from './shared/model/AuthContext';
import { Header } from './components/layout/Header/Header';

function App() {
  return (
    // <Provider store={store}>
    <AuthProvider>
      <div className="relative flex h-screen flex-col">
        <Header />
      </div>
      <Routes>
        <Route element={<Outlet />} path="/">
          <Route element={<Home />} path={AppRoute.home} />
          <Route
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
            path={AppRoute.login}
          />
          <Route element={<Register />} path={AppRoute.register} />
          <Route element={<NotFound />} path={AppRoute.notFound} />
        </Route>
      </Routes>
    </AuthProvider>
    // </Provider>
  );
}
export default App;
