import React, { useEffect } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { GetRooms } from "../redux/reducers/gameroomslice";
import Header from "./common/header";
import Footer from "./common/footer";
import { useNavigate } from "react-router-dom";
export default function RoomOwnerView() {
  const dispatch = useDispatch();
  const userid = localStorage.getItem("userid");
  const { ownerrooms } = useSelector((state) => state.game);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(GetRooms(userid));
  }, []);
  return (
    <div>
      <Header />

      <div className="games-section">
        <div className="game-banner"></div>
        <h3 className="text-center mt-4">Your Rooms</h3>
        <Container>
          <Row>
            {ownerrooms?.map((room) => (
              <Col sm={3} md={3} lg={3}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZVV9r1ol_mOnIWM-ySu2khY5csFsWD8C1Oacis-fw-mueyhul"
                    }
                  />
                  <Card.Body>
                    <Card.Title>{room.name}</Card.Title>
                    <Card.Text>
                      Current Active Players: {room?.players?.length}
                    </Card.Text>
                    <Card.Text>
                      Players in a Queue: {room?.playersRequested?.length}
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => {
                        navigate(`/play/${room._id}`);
                        localStorage.setItem("currentRoom", room._id);
                      }}
                    >
                      View Room
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <Footer />
    </div>
  );
}
