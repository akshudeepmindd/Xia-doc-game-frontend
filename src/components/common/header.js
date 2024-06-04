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
            <Button variant="primary" className="reg-btn" data-toggle="modal" data-target="#exampleModal">Register</Button>

            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <div
          className="modal fade"
          id="exampleModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Modal title
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">...</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
    
    </Navbar>
    
  );
};
export default Header;
