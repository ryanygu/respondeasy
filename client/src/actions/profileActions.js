import axios from "axios";
// import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { setCurrentUser } from "./authActions";

import {
  GET_ERRORS
} from "./types";

// Update user profile
// TODO: verify this
export const updateUser = (updatedData, thisUser) => dispatch => {
    axios
        .patch(`/users/${thisUser.auth.user._id}`, updatedData)
        .then(res => {
            const decoded = res.data;
            dispatch(setCurrentUser(decoded));
            thisUser.history.push(`/dashboard`)
        })
        // .catch(err =>
            // dispatch({
            //     type: GET_ERRORS,
            //     payload: err.response.data
            // })
        // );
};