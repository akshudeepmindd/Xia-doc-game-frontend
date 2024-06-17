import { combineReducers } from "redux";
import gameReducer from "./gameroomslice";
import userReducer from "./userslice";
const rootReducer = combineReducers({
  game: gameReducer,
  user: userReducer,
  // Add more reducers here if needed
});

export default rootReducer;
