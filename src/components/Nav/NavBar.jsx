import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import styles from './NavBar.module.css';
import { useAuthContext } from '../../features/Auth/AuthContext';

/* function BrandNavLink({ children, ...props }) {
  return (
    <NavLink
      {...props}
      className={({ isActive }) =>
        clsx(styles.navLink, { [styles.active]: isActive })
      }
    >
      {children}
    </NavLink>
  );
  // React.createElement(NavLink, {...props, className: ({ isActive }) => isActive && styles.active}, children);
} */

function BrandNavLink({ children, ...props }) {
  return (
    <Nav.Link
      {...props}
    >
      {children}
    </Nav.Link>
  );
}

/*
<NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
*/

export function NavBar() {
  const { user, logout } = useAuthContext();
  const location = useLocation();
  const clsRightAbs = "justify-content-end " + styles.navbarAbs;
  return (
    <>
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container className={styles.navbarRel}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav activeKey={location.pathname} className="me-auto">
            <BrandNavLink href="/">Home</BrandNavLink>
            <BrandNavLink href="/deadlines">Deadlines</BrandNavLink>
          </Nav>
        </Navbar.Collapse>
        <Nav className="navbar-expand">
          {user === null && (
            <>
              <BrandNavLink href="login">Login</BrandNavLink>
              <BrandNavLink href="register">Register</BrandNavLink>
            </>
          )}
          {user && (
            <Navbar.Text className={clsRightAbs}>
              <span className={styles.welcomeTxt}>Welcome,</span>{' '} 
              <a href="profile">{user.firstName}!</a>{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              >
                Logout
              </a>
              </Navbar.Text>
          )}
          </Nav>
        </Container>
      </Navbar>
      </>
  );

  /*return (
    <nav className={styles.mainMenu}>
      <menu>
        <li>
          <BrandNavLink to="/">Home</BrandNavLink>
        </li>
        <li>
          <BrandNavLink to="/deadlines">Deadlines</BrandNavLink>
        </li>
        {user === null && (
          <>
            <li className={styles.pushRight}>
              <BrandNavLink to="login">Login</BrandNavLink>
            </li>
            <li>
              <BrandNavLink to="register">Register</BrandNavLink>
            </li>
          </>
        )}
        {user && (
          <li className={styles.pushRight}>
            <span className={styles.welcomeTxt}>Welcome, </span><BrandNavLink to="profile">{user.firstName}!</BrandNavLink>{' '}
            <a
              href="#"
              className={styles.navLink}
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              Logout
            </a>
          </li>
        )}
      </menu>
    </nav>
  );*/
}
