import logo from "./logo.svg";
// import "./App.css";
import "././styles/css/main.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Games from "./components/games";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/games" Component={Games} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
