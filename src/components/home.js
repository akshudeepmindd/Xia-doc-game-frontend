import { Button, Container, Row, Col } from "react-bootstrap";
import Slider from "react-slick";

import Header from "./common/header";
import Footer from "./common/footer";

const Home = () => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoPlay: true,
  };
  var settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoPlay: true,
  };
  return (
    <>
      <Header />
      <div className="home-page">
        <div className="bottom-nav">
          <Container>
            <ul className="d-flex justify-content-between align-items-center">
              <li>
                <img src="/images/sport.png" />
                sport
              </li>
              <li>
                <img src="/images/card.png" />
                card person
              </li>
              <li>
                <img src="/images/dice.png" />
                dial
              </li>
              <li>
                <img src="/images/casino.png" />
                casino
              </li>
              <li>
                <img src="/images/future.png" />
                futures
              </li>
              <li>
                <img src="/images/casino.png" />
                lottery
              </li>
              <li>
                <img src="/images/kino.png" />
                kinno
              </li>
              <li>
                <img src="/images/fish.png" />
                shoot fish
              </li>
              <li>
                <img src="/images/jar.png" />
                explode the jar
              </li>
              <li>
                <img src="/images/game.png" />
                game
              </li>
            </ul>
          </Container>
        </div>
        <Slider settings={settings}>
          <div className="banner">
            <div className="banner-content">
              <h2>Welcome to Casino</h2>
              <p>Lorem ipsum doler sit amit</p>
              <Button variant="primary" className="btn-start">
                Start the game
              </Button>
            </div>
          </div>
          <div className="banner">
            <div className="banner-content">
              <h2>Welcome to Casino</h2>
              <p>Lorem ipsum doler sit amit</p>
              <Button variant="primary" className="btn-start">
                Start the game
              </Button>
            </div>
          </div>
        </Slider>
        {/* <div className="game-winner">
          <Slider settings2={settings2}>
            <div>
            <div className="d-flex flex-row">
              <img src="/images/cas.png" />
              <div>
                <h5>Royal wheel</h5>
                <p>$2345634343</p>
                <p>$2345634343</p>

                <p>$2345634343</p>
              </div>
            </div>
            </div>
            <div className="d-flex flex-row">
              <img src="/images/cas.png" />
              <div>
                <h5>Royal wheel</h5>
                <p>$2345634343</p>
                <p>$2345634343</p>

                <p>$2345634343</p>
              </div>
            </div>
            <div className="d-flex flex-row">
              <img src="/images/cas.png" />
              <div>
                <h5>Royal wheel</h5>
                <p>$2345634343</p>
                <p>$2345634343</p>

                <p>$2345634343</p>
              </div>
            </div>
            <div>
            <div className="d-flex flex-row">
              <img src="/images/cas.png" />
              <div>
                <h5>Royal wheel</h5>
                <p>$2345634343</p>
                <p>$2345634343</p>

                <p>$2345634343</p>
              </div>
            </div>
            </div>
          
          </Slider>
        </div> */}

        <div className="offers">
          <h2 className="mb-3">Special offers</h2>
          <Container>
            <Row>
              <Col sm={3} md={3} lg={3}>
                <div className="offer-box">
                  <div className="d-flex justify-content-center align-items-center">
                    <img src="/images/download.gif" />
                  </div>
                  <h4>Spin & Win!</h4>
                  <p>
                    Get ready to spin the reels with our latest slot game
                    promotions! Enjoy:
                  </p>
                  <ul>
                    <li>100% Match Bonus up to $500 on your first deposit!</li>
                    <li>50 Free Spins on our hottest slots!</li>
                    <li>
                      Daily Cashback on your losses to keep you playing longer!
                    </li>
                  </ul>
                </div>
              </Col>
              <Col sm={3} md={3} lg={3}>
                <div className="offer-box box-2">
                  <div className="d-flex justify-content-center align-items-center">
                    <img src="/images/download.gif" />
                  </div>
                  <h4>Blackjack Bonanza!</h4>
                  <p>
                    Enhance your Blackjack experience with our limited-time
                    offers:
                  </p>
                  <ul>
                    <li>200% Match Bonus up to $300 on your first deposit!</li>
                    <li>
                      20% Cashback on all your Blackjack losses every week!
                    </li>
                    <li>
                      VIP Rewards for high rollers with exclusive bonuses!
                    </li>
                  </ul>
                </div>
              </Col>
              <Col sm={3} md={3} lg={3}>
                <div className="offer-box box-4">
                  <div className="d-flex justify-content-center align-items-center">
                    <img src="/images/download.gif" />
                  </div>
                  <h4>Blackjack Bonanza!</h4>
                  <p>
                    Enhance your Blackjack experience with our limited-time
                    offers:
                  </p>
                  <ul>
                    <li>200% Match Bonus up to $300 on your first deposit!</li>
                    <li>
                      20% Cashback on all your Blackjack losses every week!
                    </li>
                    <li>
                      VIP Rewards for high rollers with exclusive bonuses!
                    </li>
                  </ul>
                </div>
              </Col>
              <Col sm={3} md={3} lg={3}>
                <div className="offer-box box-4">
                  <div className="d-flex justify-content-center align-items-center">
                    <img src="/images/download.gif" />
                  </div>
                  <h4>Blackjack Bonanza!</h4>
                  <p>
                    Enhance your Blackjack experience with our limited-time
                    offers:
                  </p>
                  <ul>
                    <li>200% Match Bonus up to $300 on your first deposit!</li>
                    <li>
                      20% Cashback on all your Blackjack losses every week!
                    </li>
                    <li>
                      VIP Rewards for high rollers with exclusive bonuses!
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <Footer/>
    </>
  );
};
export default Home;
