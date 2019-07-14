import axios from 'axios';
// import { setAlert } from "./alert";

import {
    GET_PROFILE,
    PROFILE_ERROR
} from "./types";

//  Get current users profile
// make request to back end api/profile/me to get profile of the user that is logged in
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');

        // token has user id
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusTest, status: err.response.status }
        })
        
    }
}
