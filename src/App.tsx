import { Routes, Route } from 'react-router';
import { Provider } from 'react-redux';

import Layout from './components/layout/RootLayout';
import NotFound from './pages/404/NotFound';
import Home from './pages/Home/HomePage';
import Login from './pages/Login/LoginPage';
import Register from './pages/Register/RegisterPage';
import { store } from './shared/store/store';

import { AppRoute } from '@/routes/appRoutes';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route element={<Layout />} path="/">
          <Route element={<Home />} path={AppRoute.home} />
          <Route element={<Login />} path={AppRoute.login} />
          <Route element={<Register />} path={AppRoute.register} />
          <Route element={<NotFound />} path={AppRoute.notFound} />
        </Route>
      </Routes>
    </Provider>
  );
}
export default App;
