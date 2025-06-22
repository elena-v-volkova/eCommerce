import { Routes, Route } from 'react-router';

import NotFound from './pages/404/NotFound';
import Home from './pages/Home/HomePage';
import Login from './pages/Login/LoginPage';
import Register from './pages/Register/RegisterPage';
import { RedirectIfAuthenticated } from './ProtectedRoute';
import { CatalogPage } from './pages/Catalog/CatalogPage';
import {
  DefaultProfileContent,
  Profile,
  LogoutHandler,
} from './pages/Profile/ProfilePage';
import ProductPage from './pages/ProductPage/ProductPage';
import { CartPage } from './pages/Cart/CartPage';
import AboutPage from './pages/About/AboutPage';

import { AppRoute } from '@/routes/appRoutes';
import { PersonalContent } from '@/pages/Profile/PersonalContent';
import { AddressContent } from '@/pages/Profile/AddressContent';
import { PasswordUpdate } from '@/pages/Profile/PasswordUpdate';

function App() {
  return (
    <Routes>
      <Route path="/">
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

        <Route element={<CatalogPage />} path={AppRoute.catalog} />

        <Route
          element={
            <RedirectIfAuthenticated>
              <Profile />
            </RedirectIfAuthenticated>
          }
          path={AppRoute.profile}
        >
          <Route index element={<DefaultProfileContent />} />
          <Route element={<PersonalContent />} path="personal" />
          <Route element={<AddressContent />} path="addresses" />
          <Route element={<PasswordUpdate />} path="password" />
          <Route element={<LogoutHandler />} path="logout" />
        </Route>

        <Route element={<NotFound />} path={AppRoute.notFound} />

        <Route element={<ProductPage />} path={AppRoute.product} />
        <Route element={<CartPage />} path={AppRoute.cart} />
        <Route element={<AboutPage />} path={AppRoute.about} />
      </Route>
    </Routes>
  );
}
export default App;
