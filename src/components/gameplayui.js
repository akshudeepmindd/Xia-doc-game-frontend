/* eslint-disable eqeqeq */
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
import {
  GetRoomDetails,
  GameJoinRequest,
  AcceptJoinRequest,
} from "../redux/reducers/gameroomslice";
import toast from "react-hot-toast";
import ViewerScreenContainer from "./LiveCam/ViewScreenView";
import { AuthToken } from "../config.js";
// import { acceptrequestservice } from "../services/gameservice";

const Gameplayui = () => {
  const [players, setPlayers] = useState([]);
  console.log(players, "players");
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [requestPlayers, setRequestlayers] = useState([]);
  const [currentBet, setCurrentBet] = useState(0);
  const [playersRequested, setplayersRequested] = useState([]);
  const [roomowner, setroomowner] = useState(false);
  const [bets, setBets] = useState([]);
  const [dealer, setDealer] = useState({});
  const [coinResult, setCoinResult] = useState("");
  const [timerDuration, setTimerDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [remainingTime, setRemainingTime] = useState(7);
  const [balance, setBalance] = useState(10000);
  const [depositAmount, setDepositAmount] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [active, setActive] = useState("");
  const [specialbetactive, setspecialbetActive] = useState("");
  const [sepecialBetsRequest, setSepcialBetsRequest] = useState([]);
  const dispatch = useDispatch();
  const { room } = useSelector((state) => state.game);
  useEffect(() => {
    const fetchRoomDetails = async () => {
      const currentRoom = localStorage
        .getItem("currentRoom")
        .replaceAll('^"|"$', "");
      await dispatch(GetRoomDetails(currentRoom));
    };

    fetchRoomDetails();
  }, [dispatch]);

  useEffect(() => {
    if (room) {
      const updatedPlayers = Array.isArray(room.players)
        ? room.players
        : [room.players];
      const updatedPlayersRequested = Array.isArray(room.playersRequested)
        ? room.playersRequested
        : [room.playersRequested];

      setPlayers(updatedPlayers);
      setplayersRequested(updatedPlayersRequested);
      setDealer(localStorage.getItem("roomowner"));
    }
  }, [room]);
  const UpdateRoom = () => {
    let currentRoomId = localStorage.getItem("currentRoom");
    console.log(currentRoomId, "currentRoomId");
    dispatch(GetRoomDetails(currentRoomId));
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
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchRoomDetails = async () => {
        const currentRoom = localStorage.getItem("currentRoom");
        await dispatch(GetRoomDetails(currentRoom));
      };
      fetchRoomDetails();
    }, 10000); // Adjust the interval time as needed (10 seconds here)

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [dispatch]);
  const handleAcceptPlayer = async (player) => {
    console.log(player, "player");
    // Logic to accept player into the game room
    const updatedRequestedPlayers = playersRequested.filter(
      (p) => p._id !== player._id
    );
    console.log(updatedRequestedPlayers);
    const updatedPlayers = [];
    updatedPlayers.push(player);
    setplayersRequested(updatedRequestedPlayers);
    setPlayers([...players, ...updatedPlayers]);
    dispatch(
      AcceptJoinRequest({
        id: localStorage.getItem("currentRoom"),
        user: player._id,
      })
    );
    const currentRoom = localStorage.getItem("currentRoom");
        await dispatch(GetRoomDetails(currentRoom));
    UpdateRoom();
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

  const handleBet = (playerName, betAmount, betType) => {
    const newBet = {
      round: currentRound,
      amount: betAmount,
      type: betType,
      player: playerName,
    };
    setRounds((prevRounds) => {
      const updatedRounds = { ...prevRounds };
      if (!updatedRounds[currentRound]) {
        updatedRounds[currentRound] = [];
      }
      updatedRounds[currentRound].push(newBet);
      return updatedRounds;
    });
    setBalance(balance - betAmount);
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
  const handleSpecialBets = (playerName, betAmount, selected) => {
    const newSBet = {
      round: currentRound,
      amount: betAmount,
      type: "Sepcial",
      player: playerName,
      selection: selected,
    };
    setRounds((prevRounds) => {
      const updatedRounds = { ...prevRounds };
      updatedRounds[currentRound].push(newSBet);
      return updatedRounds;
    });
    setBalance(balance - betAmount);
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
                          <img
                            src="/images/info.png"
                            alt="Info"
                            className="gameplayimg"
                          />
                        </li>
                        <li>
                          <img
                            src="/images/signall.png"
                            alt="Signal"
                            className="gameplayimg"
                          />
                        </li>
                        <li>
                          <img
                            src="/images/msg.png"
                            alt="Message"
                            className="gameplayimg"
                          />
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
                      <h6 style={{ color: "#fff" }}>{currentBet}</h6>
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
                {room?.dealerLiveStreamId ? (
                  <ViewerScreenContainer
                    meetingId={room?.dealerLiveStreamId}
                    authToken={AuthToken}
                    name={room?.dealer?.telegramusername}
                  />
                ) : (
                  "Live is going to start please wait..."
                )}
                
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
                {localStorage.getItem("roomowner") == "true" && (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Player In Room</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.length > 0 ? (
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
                  <div
                    className={`blue-box ${
                      active === "Odd" && "blue-box-blinking"
                    }`}
                    style={{
                      cursor: active === "Even" ? "not-allowed" : "pointer",
                    }}
                  >
                    <div
                      className={`d-flex justify-content-center align-items-center flex-column `}
                      onClick={() => {
                        if (currentBet === 0) {
                          toast.error("Please select a amount for bet");
                        } else if (balance < currentBet) {
                          toast.error(
                            "Please Deposit more amount to bet with this amount"
                          );
                        } else {
                          handleBet(
                            localStorage.getItem("username"),
                            currentBet,
                            "Even"
                          );
                          setActive("Even");
                        }
                      }}
                    >
                      <h5>CHÃN</h5>
                      {active === "Even" && currentBet !== 0 && (
                        <div
                          className={`bet-container ${
                            active === "Even" && currentBet !== 0 && "visible"
                          }`}
                        >
                          <img
                            src="/images/chipset.png"
                            alt="chipset"
                            style={{
                              marginBottom: "11px",
                              height: "30px",
                              width: "30px",
                            }}
                          />
                          <p>{currentBet}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <img
                      src="/images/casi.png"
                      className="camera2"
                      alt="Casino"
                    />
                    <div className="d-flex justify-content-around pt-2  column-gap-1">
                      <div className="d-flex flex-column row-gap-1">
                        <div
                          className={`d-flex green-box flex-column ${
                            specialbetactive == "4 Black" &&
                            "green-box-blinking"
                          }`}
                          onClick={() => {
                            if (currentBet === 0) {
                              toast.error("Please select a amount for bet");
                            } else if (balance < currentBet) {
                              toast.error(
                                "Please Deposit more amount to bet with this amount"
                              );
                            } else if (
                              rounds[currentRound]?.filter(
                                (round) =>
                                  round.type == "Sepcial" &&
                                  round.selection == "4 Black"
                              ).length > 0
                            ) {
                              toast.error("You have already placed this bet");
                            } else if (rounds.length === 0) {
                              toast.error(
                                "Please bet on either even or odd first"
                              );
                            } else {
                              handleSpecialBets(
                                localStorage.getItem("username"),
                                100,
                                "4 Black"
                              );
                              setspecialbetActive("4 Black");
                            }
                          }}
                        >
                          <div>
                            <p className="text-center white-text">White</p>
                          </div>
                          <div className="d-flex  column-gap-3">
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                          </div>
                        </div>
                        <div className="d-flex green-box flex-column">
                          <div>
                            <p className="text-center white-text">4 Red</p>
                          </div>
                          <div className="d-flex column-gap-3">
                            {" "}
                            <div className="red-circle text-center p-1 font-bold"></div>
                            <div className="red-circle text-center p-1 font-bold"></div>
                            <div className="red-circle text-center p-1 font-bold"></div>
                            <div className="red-circle text-center p-1 font-bold">
                              4
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-column row-gap-1">
                        <div className="d-flex green-box flex-column">
                          <div>
                            <p className="text-center white-text">
                              3 White 1 Red
                            </p>
                          </div>
                          <div className="d-flex  column-gap-3">
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="circle"></div>
                            <div className="red-circle text-center p-1 font-bold">
                              1
                            </div>
                          </div>
                        </div>
                        <div className="d-flex green-box flex-column">
                          <div>
                            <p className="text-center white-text">
                              1 White 3 Red
                            </p>
                          </div>
                          <div className="d-flex  column-gap-3">
                            <div className="circle"></div>
                            <div className="red-circle"></div>
                            <div className="red-circle"></div>
                            <div className="red-circle text-center p-1 font-bold">
                              3
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`red-box ${
                      active === "Odd" && "blue-box-blinking"
                    }`}
                    style={{
                      cursor: active === "Even" ? "not-allowed" : "pointer",
                    }}
                  >
                    <div
                      className="d-flex justify-content-center align-items-center flex-column"
                      onClick={() => {
                        if (currentBet === 0) {
                          toast.error("Please select a amount for bet");
                        } else if (balance < currentBet) {
                          toast.error(
                            "Please Deposit more amount to bet with this amount"
                          );
                        } else {
                          handleBet(
                            localStorage.getItem("username"),
                            currentBet,
                            "Odd"
                          );
                          setActive("Odd");
                        }
                      }}
                    >
                      <h5>Lě</h5>
                      {active === "Odd" && currentBet !== 0 && (
                        <div
                          className={`bet-container ${
                            active === "Odd" && currentBet !== 0 && "visible"
                          }`}
                        >
                          <img
                            src="/images/chipset.png"
                            alt="chipset"
                            style={{
                              marginBottom: "11px",
                            }}
                          />
                          <p>{currentBet}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
              <Col sm={3} lg={3} md={3} className="player-list">
                {localStorage.getItem("roomowner") == "true" && (
                  <div>
                    <h6
                      style={{
                        color: "#fff",
                        marginBottom: "10px",
                      }}
                    >
                      Player Requested Sepcial bets
                    </h6>
                    {rounds[currentRound]
                      ?.filter((round) => round.type == "Sepcial")
                      .map((specialbet) => (
                        <div>
                          <p className="p-container">
                            <img
                              src="/images/avatar.jpg"
                              alt="Avatar"
                              className="image"
                            />
                          </p>
                        </div>
                      ))}
                  </div>
                )}
                {localStorage.getItem("roomowner") == "true" && (
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
                )}
              </Col>
            </Row>
          </Container>
        </div>
        <div className="footer-gameplay">
          <div className="d-flex justify-content-between">
            <div className="d-flex justify-content-center align-items-center">
              <h6>Balance</h6>
              <Button className="btn-balance">${balance}</Button>
            </div>
            <div className="slider-btn ms-2">
              <ul>
                <li onClick={() => setCurrentBet(50000)}>
                  <img src="/images/css.png" alt="CSS" />
                  <p>50k</p>
                </li>
                <li onClick={() => setCurrentBet(100000)}>
                  <img src="/images/chip.png" alt="CSS" />
                  <p>100k</p>
                </li>
                <li onClick={() => setCurrentBet(150000)}>
                  <img src="/images/css.png" alt="CSS" />
                  <p>150k</p>
                </li>
                <li onClick={() => setCurrentBet(200000)}>
                  <img src="/images/chip.png" alt="CSS" />
                  <p>200k</p>
                </li>
                <li onClick={() => setCurrentBet(250000)}>
                  <img src="/images/css.png" alt="CSS" />
                  <p>250k</p>
                </li>
                <li onClick={() => setCurrentBet(500000)}>
                  <img src="/images/chip.png" alt="CSS" />
                  <p>500k</p>
                </li>
              </ul>
            </div>
            <div className="d-flex justify-content-center align-items-center">
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
