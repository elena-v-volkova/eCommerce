import { NavLink } from 'react-router';
import styles from './Header.module.scss';
import { AppRoute } from '../../../routes/appRoutes';

function Header() {
  return (
    <nav className={styles.header}>
      <NavLink to={AppRoute.home}>Home</NavLink>
      <NavLink to={AppRoute.login}>Login</NavLink>
      <NavLink to={AppRoute.register}>Register</NavLink>
    </nav>
  );
}
export default Header;
