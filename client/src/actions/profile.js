import axios from 'axios';
import { setAlert } from "./alert";

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
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
};

// create or update profile
// use history.push to redirect to client side route after getting the profile
// making post request to api/profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile', formData, config);

        // dispatch reducer to get profile
        // token has user id
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        // need alert that says profile was update or profile was created
        // if edited, show updated, else show created
        dispatch(setAlert(edit ? 'profile updated' : 'profile created', 'success'));

        if (!edit) {
            history.push('/dashboard');
        }

    } catch (err) {
        const errors = err.response.data.errors;

        // if there are errors, for every error, send the message in the danger css style
        // this references the setAlert in the alert.js reducer file
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}
