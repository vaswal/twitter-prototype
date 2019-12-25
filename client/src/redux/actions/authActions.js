import {SIGN_IN, SIGN_IN_ERROR, SIGN_UP} from "../../redux/constants/actionTypes";
import {HOSTNAME} from "../../constants/appConstants";

import axios from 'axios';

export function signIn(payload) {
    console.log("signIn payload");
    console.log(payload);

    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:8080/api/v1/user/login`, payload)
            .then((response) => dispatch(signInDispatch(response.data)))
            .catch((err) => dispatch(signInErrorDispatch(err)));
    }
}

export const signInDispatch = (returnData) => {
    console.log("Inside signInDispatch");
    console.log(returnData);

    return {type: SIGN_IN, payload: returnData}
};

export const signInErrorDispatch = (error) => {
    console.log("Inside signInErrorDispatch", error);

    return {type: SIGN_IN_ERROR, payload: error}
};

export function signUp(payload) {
    console.log("signUp payload");
    console.log(payload);

    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:8080/api/v1/user/register`, payload)
            .then((response) => dispatch(signUpDispatch(response.data)));
    }
}

export const signUpDispatch = (returnData) => {
    console.log("Inside signUpDispatch");
    console.log(returnData);

    return {type: SIGN_UP, payload: returnData}
};