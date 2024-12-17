import React from 'react';
import logo from '../components/ecometricsLogo.png';

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.scrollContainer}>
        <a href="http://localhost:3000/" style={styles.logoContainer}>
          <img src={logo} alt="EcoMetrics Logo" style={styles.logoImg} />
          <span style={styles.logoText}>EcoMetrics</span>
        </a>
        <nav style={styles.nav}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#solutions" style={styles.navLink}>Solutions</a>
          <a href="#resources" style={styles.navLink}>Resources</a>
          <a href="#pricing" style={styles.navLink}>Pricing</a>
        </nav>
        <button style={styles.getStartedButton}>Get started now</button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'block',
    padding: '3px 20px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    height: '65px',
    position: 'fixed',  // Use fixed position to keep the header at the top
    top: 0,             // Ensure it sticks to the top of the viewport
    width: '100%',      // Make sure it spans the full width of the viewport
    zIndex: 1000, 
  },
  scrollContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '40px',
    textDecoration: 'none',
    color: 'black',
  },
  logoImg: {
    width: '45px',
    height: '55px',
    marginRight: '10px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    gap: '25px',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  navLink: {
    textDecoration: 'none',
    color: 'black',
    fontWeight: 500,
    fontSize: '17px',
    cursor: 'pointer',
  },
  getStartedButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginLeft: '20px',
  },
};


export default Header;
