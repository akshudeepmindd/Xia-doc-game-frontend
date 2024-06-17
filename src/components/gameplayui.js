import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  DropdownButton,
  Dropdown,
  Form,
  Row,
  Col,
  Button,
  Table,
  Modal,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useDispatch, useSelector } from "react-redux";
import { GetRoomDetails } from "../redux/reducers/gameroomslice";

const Gameplayui = () => {
  const [players, setPlayers] = useState([]);
  const [requestPlayers, setRequestlayers] = useState([]);
  const [playersRequested, setplayersRequested] = useState([]);
  const [roomowner, setroomowner] = useState(false);
  const [bets, setBets] = useState([]);
  const [dealer, setDealer] = useState({});
  const [coinResult, setCoinResult] = useState("");
  const [timerDuration, setTimerDuration] = useState(7);
  const [isPlaying, setIsPlaying] = useState(true);
  const [remainingTime, setRemainingTime] = useState(7);
  const [balance, setBalance] = useState(10000);
  const [depositAmount, setDepositAmount] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const dispatch = useDispatch();
  const { room } = useSelector((state) => state.game);
  useEffect(() => {
    dispatch(GetRoomDetails(localStorage.getItem("currentRoom")));
    if (room !== null) {
      room?.players !== undefined &&
        setPlayers(
          Array.isArray(room?.players) ? room?.players : [room?.players]
        );
      setplayersRequested(
        Array.isArray(room?.playersRequested)
          ? room?.playersRequested
          : [room?.playersRequested]
      );
      setDealer(room?.owner);
      setroomowner(localStorage.getItem("roomowner"));
    }
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      const currentRoom = localStorage.getItem("currentRoom");
      dispatch(GetRoomDetails(currentRoom));
      if (room?.players?.length > 0) {
        setPlayers(room?.players);
        clearInterval(interval);
      }
    }, 100000);
  }, []);
  const handleAcceptPlayer = (player) => {
    // Logic to accept player into the game room
    const updatedPlayers = players.map((p) =>
      p.name === player.name ? { ...p, status: "Accepted" } : p
    );
    setPlayers(updatedPlayers);
  };

  const handleRejectPlayer = (player) => {
    // Logic to reject player from the game room
    const updatedPlayers = players.filter((p) => p.name !== player.name);
    setPlayers(updatedPlayers);
  };

  const handleTimerComplete = () => {
    setIsPlaying(false);
    console.log("Timer completed");
  };

  const handleBet = (betAmount, betType) => {
    setBets([...bets, { amount: betAmount, type: betType }]);
    console.log(`Placed bet of ${betAmount} on ${betType}`);
  };

  const handleRegisterDealer = (player) => {
    setDealer(player);
    console.log(`${player.name} is now the dealer`);
  };

  const shakeCoins = () => {
    const results = [
      "4 Black",
      "4 White",
      "3 Black, 1 White",
      "3 White, 1 Black",
      "2 Black, 2 White",
    ];
    const randomResult = results[Math.floor(Math.random() * results.length)];
    setCoinResult(randomResult);
  };

  const handleRevealCoins = () => {
    console.log(`Game result: ${coinResult}`);
    // Additional logic to handle the result and distribute winnings
  };

  const handleDeposit = () => {
    // Logic to handle deposit
    console.log(`Deposited amount: ${depositAmount}`);
    setBalance(balance + parseInt(depositAmount));
    setShowDepositModal(false);
    setDepositAmount("");
  };

  return (
    <>
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
                  <img src="/images/battery.png" alt="Battery" />
                </Nav.Link>
                <Nav.Link eventKey={2} href="#memes">
                  <img src="/images/music.png" alt="Music" />
                </Nav.Link>
                <Nav.Link eventKey={2} href="#memes">
                  <img src="/images/sound.png" alt="Sound" />
                </Nav.Link>
                <Nav.Link eventKey={2} href="#memes">
                  <img src="/images/men.png" alt="Men" />
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
                          <img src="/images/info.png" alt="Info" />
                        </li>
                        <li>
                          <img src="/images/signall.png" alt="Signal" />
                        </li>
                        <li>
                          <img src="/images/msg.png" alt="Message" />
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
                        isPlaying={isPlaying}
                        duration={timerDuration}
                        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                        colorsTime={[7, 5, 2, 0]}
                        onComplete={handleTimerComplete}
                      >
                        {({ remainingTime }) => setRemainingTime(remainingTime)}
                      </CountdownCircleTimer>
                      <h5>Start Betting</h5>
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
                <img src="/images/casi.png" alt="Casino" />
              </Col>
              <Col sm={3} lg={3} md={3} className="history">
                <div className="d-flex justify-content-between">
                  <div className="his-text">
                    <img
                      src="/images/arrowup.png"
                      className="me-2"
                      alt="Arrow Up"
                    />
                    History
                  </div>
                  <div className="d-flex">
                    <img src="/images/lft.png" alt="Left" />
                    <img src="/images/ra.png" alt="Right" />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={3} lg={3} md={3} className="player-list">
                {roomowner == "true" && (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Player In Room</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players == undefined || players.length > 0 ? (
                        players?.map((player, index) => (
                          <tr key={index}>
                            <td>{player?.telegramusername}</td>

                            <td>
                              {/* <Button
                                  variant="success"
                                  onClick={() => handleAcceptPlayer(player)}
                                >
                                  Accept
                                </Button> */}
                              {players.length > 0 && (
                                <Button
                                  variant="danger"
                                  onClick={() => handleRejectPlayer(player)}
                                  size="sm"
                                >
                                  Kick Out
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <td>No players in the room</td>
                      )}
                    </tbody>
                  </Table>
                )}
              </Col>
              <Col sm={6} lg={6} md={6} className="scored">
                <div className="score d-flex justify-content-between">
                  <div className="blue-box">
                    <div className="d-flex justify-content-center align-items-center flex-column">
                      <h5>Chian</h5>
                      <InputGroup className="mb-3">
                        <FormControl
                          placeholder="Enter bet amount"
                          aria-label="Bet amount"
                          aria-describedby="basic-addon2"
                          type="number"
                          min="0"
                          onChange={(e) => setDepositAmount(e.target.value)}
                          value={depositAmount}
                        />
                        <Button
                          variant="primary"
                          className="btn-rank"
                          onClick={() => handleBet(100, "Even")}
                        >
                          Even
                        </Button>
                      </InputGroup>
                    </div>
                  </div>
                  <div>
                    <img
                      src="/images/casi.png"
                      className="camera2"
                      alt="Casino"
                    />
                  </div>
                  <div className="red-box">
                    <div className="d-flex justify-content-center align-items-center flex-column">
                      <h5>Chian</h5>
                      <InputGroup className="mb-3">
                        <FormControl
                          placeholder="Enter bet amount"
                          aria-label="Bet amount"
                          aria-describedby="basic-addon2"
                          type="number"
                          min="0"
                          onChange={(e) => setDepositAmount(e.target.value)}
                          value={depositAmount}
                        />
                        <Button
                          variant="primary"
                          className="btn-rank"
                          onClick={() => handleBet(100, "Odd")}
                        >
                          Odd
                        </Button>
                      </InputGroup>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4">
                  <Button variant="info" onClick={shakeCoins}>
                    Shake Coins
                  </Button>
                  <Button variant="success" onClick={handleRevealCoins}>
                    Reveal Coins
                  </Button>
                </div>
              </Col>
              <Col sm={3} lg={3} md={3} className="player-list">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Player Requested </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playersRequested?.length > 0 &&
                      playersRequested?.map((player, index) => (
                        <tr key={index}>
                          <td>{player?.telegramusername}</td>

                          <td>
                            <Button
                              variant="success"
                              onClick={() => handleAcceptPlayer(player)}
                              style={{ marginRight: "10px" }}
                              size="sm"
                            >
                              Accept
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleRejectPlayer(player)}
                              size="sm"
                            >
                              Decline
                            </Button>
                          </td>
                        </tr>
                      ))}
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
              <Button className="btn-balance">${balance}</Button>
            </div>
            <div className="slider-btn ms-2">
              <ul>
                <li>
                  <img src="/images/css.png" alt="CSS" />
                </li>
                <li>
                  <img src="/images/css.png" alt="CSS" />
                </li>
                <li>
                  <img src="/images/css.png" alt="CSS" />
                </li>
                <li>
                  <img src="/images/css.png" alt="CSS" />
                </li>
                <li>
                  <img src="/images/css.png" alt="CSS" />
                </li>
                <li>
                  <img src="/images/css.png" alt="CSS" />
                </li>
              </ul>
            </div>
            <div className="d-flex">
              <Button
                className="clear-btn me-2"
                onClick={() => setShowDepositModal(true)}
              >
                Deposit
              </Button>
              <Button className="confirm-btn me-2">Confirm</Button>
              <Button className="rebet-btn me-2">Rebet</Button>
              <Button className="clear-btn">Clear</Button>
            </div>
          </div>
        </div>
        <Modal
          show={showDepositModal}
          onHide={() => setShowDepositModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Deposit Balance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Text>$</InputGroup.Text>
              <FormControl
                placeholder="Enter deposit amount"
                aria-label="Deposit amount"
                aria-describedby="basic-addon2"
                type="number"
                min="0"
                onChange={(e) => setDepositAmount(e.target.value)}
                value={depositAmount}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDepositModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeposit}>
              Deposit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Gameplayui;
