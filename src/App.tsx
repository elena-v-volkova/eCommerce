import { Routes, Route } from 'react-router';
import './App.css';
import Layout from './components/layout/RootLayout';
import NotFound from './pages/404/NotFound';
import Home from './pages/Home/home';
import Login from './pages/Login/Login';
import Register from './pages/Register/register';
import { AppRoute } from './routes/appRoutes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path={AppRoute.home} element={<Home />} />
        <Route path={AppRoute.login} element={<Login />} />
        <Route path={AppRoute.register} element={<Register />} />
        <Route path={AppRoute.notFound} element={<NotFound />} />
      </Route>
    </Routes>
  );
}
export default App;
