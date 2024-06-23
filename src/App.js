import "././styles/css/main.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Games from "./components/games";
import Zocgame from "./components/zocgame";
import Gameplayui from "./components/gameplayui";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Toaster } from "react-hot-toast";
import RoomOwnerView from "./components/roomownerview";
import Dealer from "./components/dealer";
function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={Home} />
            <Route path="/games" Component={Games} />
            <Route path="/ownerview" Component={RoomOwnerView} />
            <Route path="/play/:id" Component={Gameplayui} />
            <Route path="/dealer/:id" Component={Dealer} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
