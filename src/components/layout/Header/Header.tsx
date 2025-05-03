import { NavLink } from 'react-router';
import styles from './Header.module.scss';

function Header() {
  return (
    <nav className={styles.header}>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/register">Register</NavLink>
    </nav>
  );
}

export default Header;
