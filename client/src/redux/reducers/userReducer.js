import { GET_PROFILE, GET_FOLLOWEES, GET_FOLLOWERS } from "../constants/actionTypes";

const initialState = {
    userDetails: null,
    follower: null,
    followee: null
};

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PROFILE:
            // console.log("GET_PROFILE reducer data: " + JSON.stringify(action.payload.data));
            return Object.assign({}, state, {
                userDetails: action.payload.data.data.user
            });
        case GET_FOLLOWEES:
            // console.log("GET_FOLLOWEES reducer data: " + JSON.stringify(action.payload.data));
            return Object.assign({}, state, {
                followee: action.payload.data.data
            });
        case GET_FOLLOWERS:
            // console.log("GET_FOLLOWERS reducer data: " + JSON.stringify(action.payload.data));
            return Object.assign({}, state, {
                follower: action.payload.data.data
            });
        default:
            return state;
    }
}
