import { Routes, Route } from 'react-router';

import Layout from './components/layout/RootLayout';
import NotFound from './pages/404/NotFound';
import Home from './pages/Home/HomePage';
import Login from './pages/Login/LoginPage';
import Register from './pages/Register/RegisterPage';
import { AppRoute } from '@/routes/appRoutes';

function App() {
  return (
    <Routes>
      <Route element={<Layout />} path="/">
        <Route element={<Home />} path={AppRoute.home} />
        <Route element={<Login />} path={AppRoute.login} />
        <Route element={<Register />} path={AppRoute.register} />
        <Route element={<NotFound />} path={AppRoute.notFound} />
      </Route>
    </Routes>
  );
}
export default App;
