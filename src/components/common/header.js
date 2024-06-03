import { Navbar, Nav, Button, Container } from "react-bootstrap";
const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-dark top-nav">
      <Container>
        <Navbar.Brand href="#home">Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#deets">
              <Button variant="primary" className="login-btn">Login</Button>
            </Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
            <Button variant="primary" className="reg-btn">Register</Button>

            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;
