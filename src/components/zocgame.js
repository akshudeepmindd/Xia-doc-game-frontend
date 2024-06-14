import { Container, Row, Col, Button } from "react-bootstrap";
import NavImage from "../styles/css/scss/images/black.svg";
import NavImage2 from "../styles/css/scss/images/black22.svg";

const Zocgame = () => {
  return (
    <div className="zoc-game">
      <div className="top-nav"></div>
      <div className="bg-image">
      <div className="top-content">
                <ul>
                  <li>
                    <img src="/images/undo.png" />
                  </li>
                  <li>
                    <img src="/images/undo.png" />
                  </li>
                  <li>
                    <img src="/images/undo.png" />
                  </li>
                  <li>
                    <div className="">
                      HOTLINE<span className="d-block">0.3456777</span>
                    </div>
                  </li>
                  <li>
                    <div className="add">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 ms-3">
                          <img src="/images/dollar.png" className="dollar" />{" "}
                          3,0000
                        </h6>
                        <div className="me-3">
                          <img src="/images/plus.png " className="plus" />
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
        <Container fluid>
          <Row>
            <Col sm={5} md={5} lg={5} className="pr-0">
            
              <div className="camera-img">
                <img src="https://fuzzyllamareviews.com/wp-content/uploads/2019/08/x1.jpg" />
              </div>
              <div className="score-board mt-5">
                <div className="top-slide"></div>
                <div className="d-flex justify-content-between">
                  <div className="box1">
                    <div className="d-flex justify-content-center align-items-center top-content flex-column center-content">
                      <h5>Chian</h5>
                      <Button variant="primary" className="btn-rank">
                        1
                      </Button>
                    </div>
                  </div>
                  <div className="trap"></div>
                  <div className="box2">
                    <div className="d-flex justify-content-center align-items-center top-content flex-column center-content">
                      <h5>Chian</h5>
                      <Button variant="primary" className="btn-rank">
                        1
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="bottom-slide d-flex justify-content-between">
                  <div className="score1">
                    <div className="d-flex justify-content-center flex-column mt-2 ms-3">
                      <ul>
                        <li>
                          <div className="circle"></div>
                        </li>
                        <li>
                          <div className="circle"></div>
                        </li>

                        <li>
                          <div className="circle"></div>
                        </li>
                        <li>
                          <div className="circle"></div>
                        </li>
                      </ul>
                      <h4 className="mb-0">1:12</h4>
                      <Button variant="primary" className="btn-rank">
                        1
                      </Button>
                    </div>
                  </div>
                  <div className="score2">
                    <div className="d-flex justify-content-center flex-column mt-1 ms-2">
                      <ul>
                        <li>
                          <div className="circle"></div>
                        </li>
                        <li>
                          <div className="circle"></div>
                        </li>

                        <li>
                          <div className="circle"></div>
                        </li>
                        <li>
                          <div className="circle"></div>
                        </li>
                      </ul>
                      <h4 className="mb-0">1:12</h4>
                      <Button variant="primary" className="btn-rank">
                        1
                      </Button>
                    </div>
                  </div>
                  <div className="score3">
                    <div className="d-flex justify-content-center flex-column mt-1 ms-2">
                      <ul>
                        <li>
                          <div className="circle"></div>
                        </li>
                        <li>
                          <div className="circle"></div>
                        </li>

                        <li>
                          <div className="circle"></div>
                        </li>
                        <li>
                          <div className="circle"></div>
                        </li>
                      </ul>
                      <h4 className="mb-0">1:12</h4>
                      <Button variant="primary" className="btn-rank">
                        1
                      </Button>
                    </div>
                  </div>
                  <div className="score4">
                    <div className="d-flex justify-content-center flex-column mt-2 ms-3">
                      <ul>
                        <li>
                          <div className="circle"></div>
                        </li>
                        <li>
                          <div className="circle"></div>
                        </li>

                        <li>
                          <div className="circle"></div>
                        </li>
                        <li>
                          <div className="circle"></div>
                        </li>
                      </ul>
                      <h4 className="mb-0">1:12</h4>
                      <Button variant="primary" className="btn-rank">
                        1
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col sm={2} lg={2} md={2} className="pl-0 pr-0">
            <div className="game-activity">
              <div className="user-imagebg"></div>
              </div></Col>
            <Col sm={5} md={5} lg={5} className="pl-0">
              <div className="top-content">
                <ul>
                  <li>
                    <div className="right-img">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 ms-3">
                          <img src={NavImage} className="img1" />
                        </h6>
                        <div className="me-3">
                          <img src={NavImage2} className="img2" />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <img src="/images/undo.png" />
                  </li>
                  <li>
                    <img src="/images/undo.png" />
                  </li>
                  <li>
                    <img src="/images/undo.png" />
                  </li>
                </ul>
              </div>
              <div className="camera-img">
                <img src="https://fuzzyllamareviews.com/wp-content/uploads/2019/08/x1.jpg" />
              </div>
              <div className="game-pannel">
                <div class="grid-container">
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>
                  <div class="item1">1</div>

                 
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default Zocgame;
