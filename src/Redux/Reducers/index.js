import { combineReducers } from "redux";

import MainActionReducer from "../Reducers/MainAction";
import SelectReducer from "../Reducers/SelectReducer";
const rootReducer = combineReducers({
  
    MainAction : MainActionReducer,
    Select : SelectReducer
});

export default rootReducer;
