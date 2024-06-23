import {
  Button,
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Card,
  Modal,
} from "react-bootstrap";

import Header from "./common/header";
import Footer from "./common/footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  GameJoinRequest,
  GetRoomDetails,
  GetGameRoomsAction,
} from "../redux/reducers/gameroomslice";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");
const Games = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { userRoom, room } = useSelector((state) => state.game);
  const navigate = useNavigate();
  const handleJoin = (room) => {
    dispatch(GetRoomDetails(room._id));
    if (room?.dealer._id === localStorage.getItem("userid")) {
      navigate("/dealer/" + localStorage.getItem("currentRoom"));
    }
    if (
      room?.players?.length > 0 &&
      room?.players?.includes(localStorage.getItem("userid"))
    ) {
      navigate("/play/" + room._id);
    }
    localStorage.setItem("currentRoom", room._id);
    socket.emit("joinRoom", {
      roomId: room._id,
      userId: localStorage.getItem("userid"),
    });
    // setOpen(true);
    setTimeout(() => {
      socket.on("updateGameroom", (updatedRoom) => {
        const currentRoom = JSON.parse(localStorage.getItem("currentRoom"));
        dispatch(GetRoomDetails(currentRoom));
        if (
          room?.playersRequested?.length > 0 &&
          room?.playersRequested?.includes(localStorage.getItem("userid"))
        ) {
          setOpen(true);
        } else if (
          room?.players?.length > 0 &&
          room?.players?.includes(localStorage.getItem("userid")) &&
          !room?.playersRequested?.includes(localStorage.getItem("userid"))
        ) {
          setOpen(false);
          navigate("/play/" + currentRoom);
        } else if (
          !room?.players?.includes(localStorage.getItem("userid")) &&
          !room?.playersRequested?.includes(localStorage.getItem("userid"))
        ) {
          navigate("/games");
        }
      });
    }, 2000);
  };
  useEffect(() => {
    if (
      Object.keys(userRoom).length !== 0 &&
      room?.dealer?._id !== localStorage.getItem("userid")
    ) {
      handleJoin(userRoom.message); // Assuming handleJoin is defined elsewhere

      const interval = setInterval(() => {
        const currentRoom = localStorage.getItem("currentRoom");
        dispatch(GetRoomDetails(currentRoom));

        if (
          room?.players?.length > 0 &&
          room?.players?.includes(localStorage.getItem("userid")) &&
          !room?.playersRequested?.includes(localStorage.getItem("userid"))
        ) {
          clearInterval(interval); // Clear interval when condition is met
          setOpen(false); // Update state
          navigate("/play/" + currentRoom); // Navigate to play
        } else if (
          room?.players?.length > 0 &&
          room?.players?.includes(localStorage.getItem("userid")) &&
          !room?.playersRequested?.includes(localStorage.getItem("userid"))
        ) {
          setOpen(false);
          navigate("/play/" + currentRoom);
        } else if (
          !room?.players?.includes(localStorage.getItem("userid")) &&
          !room?.playersRequested?.includes(localStorage.getItem("userid"))
        ) {
          navigate("/games");
        }
      }, 10000); // Adjust the interval time as needed (10 seconds here)

      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [userRoom, dispatch, navigate]); // Dependencies array

  const handleGame = () => {
    console.log(room, "room");
    if (room?.dealer?._id == localStorage.getItem("userid")) {
      navigate("/dealer/" + localStorage.getItem("currentRoom"));
    } else {
      const userid = { playerid: localStorage.getItem("userid") };
      dispatch(GetGameRoomsAction(userid));
    }
  };
  return (
    <>
      <Header />
      <div className="games-section">
        <div className="game-banner"></div>
        <Container>
          <h3 className="text-center mt-4">Games</h3>
          <Tabs
            defaultActiveKey="ksport"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="ksport" title="K-sport">
              <Row>
                <Col sm={3} md={3} lg={3}>
                  <div className="card" onClick={handleGame}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZVV9r1ol_mOnIWM-ySu2khY5csFsWD8C1Oacis-fw-mueyhul" />
                    <Card.Title
                      style={{
                        paddingLeft: "10px",
                        paddingTop: "10px",
                      }}
                    >
                      Xoc Dia
                    </Card.Title>
                  </div>
                </Col>
                <Col sm={3} md={3} lg={3}>
                  <div className="card">
                    <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQyt6knjJL_uCtfXNv-KE_vRnR9u_iJ4wkca-G4sE6unE9cJtuO" />
                  </div>
                </Col>
                <Col sm={3} md={3} lg={3}>
                  <div className="card">
                    <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQBxtNCwTm6aodo2bq6Ict1pQBTYCJniFX9D4I2KRq8JuopAPF8" />
                  </div>
                </Col>
                <Col sm={3} md={3} lg={3}>
                  <div className="card">
                    <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT1WPdPT2e7gT7YW7IGxe3qzMoEoRdCY8fYoR2keY1-BLVGzcSE" />
                  </div>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col sm={3} md={3} lg={3}>
                  <div className="card">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZVV9r1ol_mOnIWM-ySu2khY5csFsWD8C1Oacis-fw-mueyhul" />
                  </div>
                </Col>
                <Col sm={3} md={3} lg={3}>
                  <div className="card">
                    <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQyt6knjJL_uCtfXNv-KE_vRnR9u_iJ4wkca-G4sE6unE9cJtuO" />
                  </div>
                </Col>
                <Col sm={3} md={3} lg={3}>
                  <div className="card">
                    <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQBxtNCwTm6aodo2bq6Ict1pQBTYCJniFX9D4I2KRq8JuopAPF8" />
                  </div>
                </Col>
                <Col sm={3} md={3} lg={3}>
                  <div className="card">
                    <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT1WPdPT2e7gT7YW7IGxe3qzMoEoRdCY8fYoR2keY1-BLVGzcSE" />
                  </div>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="fish" title="Shoot Fish">
              Tab content for Profile
            </Tab>
            <Tab eventKey="hat" title="Explode hat">
              Tab content for Contact
            </Tab>
            <Tab eventKey="keno" title="Keno" disabled>
              Tab content for Contact
            </Tab>
            <Tab eventKey="casino" title="Casino" disabled>
              Tab content for Contact
            </Tab>
            <Tab eventKey="card" title="Card game" disabled>
              Tab content for Contact
            </Tab>
            <Tab eventKey="disc" title="Disc" disabled>
              Tab content for Contact
            </Tab>
            <Tab eventKey="dial" title="Dial" disabled>
              Tab content for Contact
            </Tab>
            <Tab eventKey="plot" title="Plot Thread" disabled>
              Tab content for Contact
            </Tab>
            <Tab eventKey="ludo" title="Ludo" disabled>
              Tab content for Contact
            </Tab>
          </Tabs>
          <Modal show={open} onHide={() => setOpen(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Your Joining Request is in pending for approval from Room Owner
              </p>
            </Modal.Body>
          </Modal>
        </Container>
      </div>

      <Footer />
    </>
  );
};
export default Games;
