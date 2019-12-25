import {CREATE_LIST,ADD_MEMBER,REMOVE_MEMBER,GET_LIST_ID,GET_MEMBERS_IN_LIST,GET_SUBSCRIBERS_IN_LIST,GET_OWNEDLISTS,GET_SUBSCRIBEDLIST,GET_MEMBERLISTS,GET_TWEETS_LIST} from "../../redux/constants/actionTypes";

const initialState = {
    status: "",
    data: "",
    ownedlists:[],
    subscribedList:[],
    membersList:[],
    successMessage:"",
    errorMessage:"",
    currentList:"",
    subscribers:[],
    members:[],
    feed:[]
};

export default function listReducer(state = initialState, action) {
    console.log("action.list.payload");
    console.log(action.payload);

    if (action.type === CREATE_LIST) {
        return Object.assign({}, state, {
            ...initialState,
            status: action.payload.status === "ok" ? true : false,
            data: action.payload.data,
            currentList: action.payload.data.list
        });
    } else if (action.type === ADD_MEMBER) {
        return Object.assign({}, state, {
           status: action.payload.status === "ok" ? true : false,
            data: action.payload.data,
        });
    }
    else if (action.type === REMOVE_MEMBER) {
        return Object.assign({}, state, {
           status: action.payload.status === "ok" ? true : false,
            data: action.payload.data,
        });
    }
    else if (action.type === GET_LIST_ID) {
        return Object.assign({}, state, {
           status: action.payload.status === "ok" ? true : false,
            data: action.payload.data,
        });
    }
    else if (action.type === GET_MEMBERS_IN_LIST) {
        return Object.assign({}, state, {
           status: action.payload.status === "ok" ? true : false,
            data: action.payload.data,
            
        });
    }
    else if (action.type === GET_SUBSCRIBERS_IN_LIST) {
        return Object.assign({}, state, {
           status: action.payload.status === "ok" ? true : false,
            data: action.payload.data,
            
        });
    }
    else if (action.type === GET_OWNEDLISTS) {
        return Object.assign({}, state, {
           status: action.payload.status === "ok" ? true : false,
            data: action.payload.data,
            ownedlists: action.payload.data.listsAsOwner
        });
    }
    else if (action.type === GET_SUBSCRIBEDLIST) {
        return Object.assign({}, state, {
           status: action.payload.status === "ok" ? true : false,
            data: action.payload.data,
            subscribedList:action.payload.data.listsAsSubscriber
        });
    }
    else if (action.type === GET_MEMBERLISTS) {
        return Object.assign({}, state, {
           status: action.payload.status === "ok" ? true : false,
            data: action.payload.data,
            membersList:action.payload.data.listsAsMember
        });
    }
    else if (action.type === GET_TWEETS_LIST) {
        return Object.assign({}, state, {
           status: action.payload.status === "ok" ? true : false,
            data: action.payload.data,
        });
    }
    return state;
}