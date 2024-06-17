import React, { useState } from "react";

import {
  Navbar,
  Nav,
  Button,
  Container,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useSelector, useDispatch } from "react-redux";
import { userLogin } from "../../redux/reducers/userslice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loader, status, user } = useSelector((state) => state.user);
  const [data, setData] = useState({
    telegramusername: "",
    password: "",
  });
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await dispatch(userLogin(data));
    if (loader == false && status === "success") {
      console.log(user, "user");
      toast.success("You loggedin SucessFully", { icon: "🚀" });
      localStorage.setItem("token", user?.token);
      localStorage.setItem("userid", user?.user?._id);
      localStorage.setItem("roomowner", user?.user?.roomowner);
      localStorage.setItem("username", user?.user?.telegramusername);
      setTimeout(() => {
        user?.user?.roomowner ? navigate("/ownerview") : navigate("/games");
      }, 1000);
    } else if (status !== "success") {
      toast.error("Invalid Credentials");
    }
  };
  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-dark top-nav">
        <Container>
          <Navbar.Brand href="#home">Logo</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              {!localStorage.getItem("token") ? (
                <>
                  <Nav.Link href="#">
                    <Button
                      variant="primary"
                      className="login-btn"
                      data-toggle="modal"
                      data-target="#exampleModal2"
                    >
                      Login
                    </Button>
                  </Nav.Link>
                  <Nav.Link eventKey={2} href="#memes">
                    <Button
                      variant="primary"
                      className="reg-btn"
                      data-toggle="modal"
                      data-target="#exampleModal"
                    >
                      Register
                    </Button>
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link
                    style={{
                      color: "#fff",
                    }}
                  >
                    @{localStorage.getItem("username")}
                  </Nav.Link>
                  {localStorage.getItem("roomowner") === "true" ? (
                    <Nav.Link
                      href="/ownerview"
                      style={{
                        color: "#fff",
                      }}
                    >
                      Your Rooms
                    </Nav.Link>
                  ) : (
                    ""
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="logout-btn"
                    onClick={() => {
                      localStorage.clear();
                      navigate("/");
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
        <div
          className="modal fade signup-modal"
          id="exampleModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Container className="login">
                  <Row>
                    <Col sm={5} lg={5} md={5}>
                      <h5>Register</h5>
                      <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>User Name</Form.Label>
                          <Form.Control
                            type="name"
                            placeholder="Enter your username"
                            onChange={(e) => {
                              setData({
                                ...data,
                                telegramusername: e.target.value,
                              });
                            }}
                          />
                        </Form.Group>

                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            onChange={(e) => {
                              setData({ ...data, password: e.target.value });
                            }}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control type="number" placeholder="" />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicCheckbox"
                        >
                          <Form.Check
                            type="checkbox"
                            label="I am confirm that i am above 18 years old, agree to FIVE88's Terms&Conditionand privacyPolicy"
                          />
                        </Form.Group>
                        <Button
                          variant="primary"
                          type="submit"
                          className="btn-reg"
                        >
                          Register
                        </Button>
                      </Form>
                    </Col>
                    <Col sm={7} lg={7} md={7} className="right-content">
                      <h5>why choose five88</h5>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <div className="circle">
                          <img src="/images/speaker.png" />
                        </div>
                        <div>
                          <h6>Bonus 15,000,0000 VND</h6>
                          <span>First deposit promotion</span>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <div className="circle">
                          <img src="/images/speaker.png" />
                        </div>
                        <div>
                          <h6>Bonus 15,000,0000 VND</h6>
                          <span>First deposit promotion</span>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <div className="circle">
                          <img src="/images/speaker.png" />
                        </div>
                        <div>
                          <h6>Bonus 15,000,0000 VND</h6>
                          <span>First deposit promotion</span>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center">
                        <div className="circle">
                          <img src="/images/speaker.png" />
                        </div>
                        <div>
                          <h6>Bonus 15,000,0000 VND</h6>
                          <span>First deposit promotion</span>
                        </div>
                      </div>
                      <div className="img-soccer">
                        <img src="https://i.pinimg.com/564x/5d/e9/48/5de948de7c56c05f4ae04d054ff4661b.jpg" />
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
        <div
          className="modal fade login-modal"
          id="exampleModal2"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Container className="login">
                  <h3>LOG IN</h3>
                  <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        type="name"
                        placeholder="Enter your username"
                        onChange={(e) => {
                          setData({
                            ...data,
                            telegramusername: e.target.value,
                          });
                        }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-1" controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => {
                          setData({ ...data, password: e.target.value });
                        }}
                      />
                    </Form.Group>
                    <p>Forgot password? Please sign up</p>

                    <Button
                      variant="primary"
                      type="submit"
                      className="btn-log"
                      onClick={(e) => handleLogin(e)}
                    >
                      Login
                    </Button>
                  </Form>
                </Container>
              </div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>
      </Navbar>
      <div className="mobile-nav">
        <div className="container d-flex justify-content-between">
          <Navbar.Brand href="#home">Logo</Navbar.Brand>
          <div className="mobile-drawr">
            <button className="btn-drwr" onClick={toggleDrawer}>
              <img src="/images/menu2.png" />
            </button>
            <Drawer
              open={isOpen}
              onClose={toggleDrawer}
              direction="left"
              className="bla bla bla"
            >
              <div className="bg-nav">
                <Navbar.Brand href="#home">Logo</Navbar.Brand>
              </div>
              <div className="mobile-bottom-nav">
                <Container>
                  <ul className="">
                    <li>
                      <img src="/images/run.png" />
                      sport
                    </li>
                    <li>
                      <img src="/images/whiecard.png" />
                      card person
                    </li>
                    <li>
                      <img src="/images/whitedice.png" />
                      dial
                    </li>
                    <li>
                      <img src="/images/whitecasino.png" />
                      casino
                    </li>
                    <li>
                      <img src="/images/futurewhite.png" />
                      futures
                    </li>
                    <li>
                      <img src="/images/whitecasino.png" />
                      lottery
                    </li>
                    <li>
                      <img src="/images/whitekino.png" />
                      kinno
                    </li>
                    <li>
                      <img src="/images/whitefish.png" />
                      shoot fish
                    </li>
                    <li>
                      <img src="/images/whitejar.png" />
                      explode the jar
                    </li>
                    <li>
                      <img src="/images/whitegame.png" />
                      game
                    </li>
                  </ul>
                  {localStorage.getItem("token") !== null || undefined ? (
                    <>
                      <Nav.Link
                        style={{
                          color: "#fff",
                        }}
                      >
                        @{localStorage.getItem("username")}
                      </Nav.Link>
                      {localStorage.getItem("roomowner") === "true" ? (
                        <Nav.Link
                          href="/ownerview"
                          style={{
                            color: "#fff",
                          }}
                        >
                          Your Rooms
                        </Nav.Link>
                      ) : (
                        ""
                      )}
                      <Button
                        size="sm"
                        variant="secondary"
                        className="logout-btn"
                        onClick={() => {
                          localStorage.clear();
                          navigate("/");
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Nav className="ms-auto">
                      {" "}
                      <Nav.Link href="#deets">
                        <Button
                          variant="primary"
                          className="login-btn"
                          data-toggle="modal"
                          data-target="#exampleModal2"
                        >
                          Login
                        </Button>
                      </Nav.Link>
                      <Nav.Link eventKey={2} href="#memes">
                        <Button
                          variant="primary"
                          className="reg-btn"
                          data-toggle="modal"
                          data-target="#exampleModal"
                        >
                          Register
                        </Button>
                      </Nav.Link>{" "}
                    </Nav>
                  )}
                </Container>
              </div>
            </Drawer>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
