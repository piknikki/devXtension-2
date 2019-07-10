import axios from 'axios';
import { setAlert } from "./alert";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from "./types";

// register user  // same thing as testing the request in register component
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, email, password }); // prepare data to send

    try {
        // response will post body to users with config
        const res = await axios.post('/api/users', body, config);

        // if all goes well, dispatch the REGISTER_SUCCESS
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data // res.data is the response we get back, which is the token
        })
    } catch (err) {
        const errors = err.response.data.errors;

        // if there are errors, for every error, send the message in the danger css style
        // this references the setAlert in the alert.js reducer file
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type: REGISTER_FAIL // REGISTER_FAIL doesn't do anything with a payload in the reducer, so don't need it here
        })
    }

}