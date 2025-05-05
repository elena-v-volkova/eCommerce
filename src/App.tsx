import { BrowserRouter, Routes, Route } from 'react-router';
import './App.css';
import NotFound from './pages/404/NotFound';
import Layout from './components/layout/RootLayout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import { AppRoute } from './routes/appRoutes';

function App() {
  return (
    <div id="root">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path={AppRoute.home} element={<Home />} />
            <Route path={AppRoute.login} element={<Login />} />
            <Route path={AppRoute.register} element={<Register />} />
            <Route path={AppRoute.notFound} element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
