import {
  Container,
  Form,
  Nav,
  Navbar,
  Button,
  NavDropdown,
  Dropdown,
  DropdownButton,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
const Gameplayui = () => {
  return (
    <div className="gameplay">
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link href="#action1">HD</Nav.Link>
              <Nav.Link href="#action2">
                <DropdownButton
                  id="dropdown-basic-button"
                  title="XOC DIA 89B4  #2-8"
                  className="drop-btn"
                >
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                    Another action
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Something else
                  </Dropdown.Item>
                </DropdownButton>
              </Nav.Link>
            </Nav>

            <Nav>
              <Nav.Link href="#deets">
                <Form className="d-flex me-auto">
                  <Form.Control
                    type="search"
                    placeholder=""
                    className="me-2"
                    aria-label="Search"
                  />
                </Form>
              </Nav.Link>
              <Nav.Link href="#deets">
                <img src="/images/battery.png" />
              </Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                <img src="/images/music.png" />
              </Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                <img src="/images/sound.png" />
              </Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                <img src="/images/men.png" />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="gameplay-body">
        <Container fluid>
          <Row>
            <Col sm={3} lg={3} md={3}>
              <div className="timer-div">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="round">
                    <ul>
                      <li>
                        <img src="/images/info.png" />
                      </li>
                      <li>
                        <img src="/images/signall.png" />
                      </li>
                      <li>
                        <img src="/images/msg.png" />
                      </li>
                      <li>
                        <div className="circle d-flex justify-content-center align-items-center">
                          Tip
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="timer d-flex justify-content-center align-items-center flex-column">
                    <CountdownCircleTimer
                      isPlaying
                      duration={7}
                      colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                      colorsTime={[7, 5, 2, 0]}
                    >
                      {({ remainingTime }) => remainingTime}
                    </CountdownCircleTimer>
                    <h5>start Betting</h5>
                  </div>
                </div>
              </div>
              <div className="winner d-flex justify-content-between align-items-center ">
                <div className="box1 ">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4>Bet </h4>
                    <h6>100</h6>
                  </div>
                </div>
                <div className="box1 ">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4>Win </h4>
                    <h6>100</h6>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={6} lg={6} md={6} className="camera-img">
              <img src="/images/casi.png" />
            </Col>
            <Col sm={3} lg={3} md={3} className="history">
              <div className="d-flex justify-content-between">
                <div className="his-text">
                  <img src="/images/arrowup.png" className="me-2" />
                  History
                </div>
                <div className="d-flex">
                  <img src="/images/lft.png" />
                  <img src="/images/ra.png" />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={3} lg={3} md={3} className="player-list">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Player join</th>
                    <th>Accept or Decline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col sm={6} lg={6} md={6} className="scored">
              <div className="score d-flex justify-content-between">
                <div className="blue-box">
                  <div className="d-flex justify-content-center align-items-center flex-column">
                    <h5>Chian</h5>
                    <Button variant="primary" className="btn-rank">
                      even
                    </Button>
                  </div>
                </div>
                <div>
                  <img src="/images/casi.png" className="camera2" />
                </div>
                <div className="red-box">
                  <div className="d-flex justify-content-center align-items-center flex-column">
                    <h5>Chian</h5>
                    <Button variant="primary" className="btn-rank">
                      even
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={3} lg={3} md={3} className="player-list">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Player join</th>
                    <th>Accept or Decline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Otto</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                  <tr>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="footer-gameplay">
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <h6>Balance</h6>
            <Button className="btn-balance">$10000</Button>
           
          </div>
          <div className="slider-btn ms-2">
              <ul>
                <li>
                  <img src="/images/css.png" />
                </li>
                <li>
                  <img src="/images/css.png" />
                </li>
                <li>
                  <img src="/images/css.png" />
                </li>
                <li>
                  <img src="/images/css.png" />
                </li>
                <li>
                  <img src="/images/css.png" />
                </li>
                <li>
                  <img src="/images/css.png" />
                </li>
              </ul>
            </div>
          <div className="d-flex">
          <Button className="clear-btn me-2">Deposit</Button>

            <Button className="confirm-btn me-2">Confirm</Button>
            <Button className="rebet-btn me-2">Rebet</Button>

            <Button className="clear-btn">Clear</Button>

          </div>
        </div>
      </div>
    </div>
  );
};
export default Gameplayui;
