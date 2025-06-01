import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar as RBNavbar, Nav, Container, Dropdown } from 'react-bootstrap';

function Navbar() {
  const { user, role, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <RBNavbar bg="primary" variant="dark" expand="lg">
      <Container fluid>
        <div className="d-flex align-items-center">
          <RBNavbar.Brand as={Link} to="/" className="me-3">Domanda & Software</RBNavbar.Brand>
          <div className="d-flex align-items-center">
            <img 
              src="/images/LOGO_TECNOBRIDGE.png" 
              alt="TechnoBridge" 
              style={{ 
                height: '32px', 
                width: 'auto',
                backgroundColor: 'white',
                padding: '4px',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'inline';
              }}
            />
            <span 
              className="text-primary bg-white px-2 py-1 rounded fw-bold ms-2" 
              style={{ fontSize: '0.7rem', display: 'none' }}
            >
              TechnoBridge
            </span>
          </div>
        </div>
        <RBNavbar.Toggle aria-controls="navbarNav" />
        <RBNavbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/chi-siamo">Chi Siamo</Nav.Link>
            <Nav.Link as={Link} to="/scopo-del-sito">Scopo del Sito</Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/le-tue-idee">Le Tue Idee</Nav.Link>
            )}
            <Nav.Link as={Link} to="/faq">FAQ & Supporto</Nav.Link>
            <Nav.Link as={Link} to="/privacy-policy">Privacy Policy</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrati</Nav.Link>
              </>
            )}
            {user && (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" id="dropdown-user">
                    {user.username} <span className="badge bg-light text-dark ms-1">{role}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
}

export default Navbar; 