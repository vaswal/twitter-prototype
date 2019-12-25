import {combineReducers} from "redux";
import userReducer from "./userReducer";
import tweetsReducer from "./tweetsReducer";
import authReducer from "./authReducer";
import analyticsReducer from "./analyticsReducer";
import listReducer from './listReducer';
const rootReducer = combineReducers({
    users: userReducer,
    auth: authReducer,
    tweets: tweetsReducer,
    analytics: analyticsReducer,
    list: listReducer,
    // feeds: feedsReducer
});
export default rootReducer;
