import axios from 'axios';
import { setAlert } from "./alert";

import {
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE
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
        });
    }
};

//  add experience
export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/experience', formData, config);

        // dispatch reducer to get profile
        // token has user id
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        // need alert that says profile was update or profile was created
        // if edited, show updated, else show created
        dispatch(setAlert('Experience added', 'success'));

        history.push('/dashboard');

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
        });
    }
};


//  add education
export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/education', formData, config);

        // dispatch reducer to get profile
        // token has user id
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        // need alert that says profile was update or profile was created
        // if edited, show updated, else show created
        dispatch(setAlert('Education added', 'success'));

        history.push('/dashboard');

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
        });
    }
};

// delete experience -- hit ap/profile/experience/:exp_id route
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience removed', 'success'));
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
        });
    }
};

// delete education -- hit ap/profile/education/:edu_id route
export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education removed', 'success'));
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
        });
    }
};

// delete ACCOUNT -- hit ap/profile route
export const deleteAccount = () => async dispatch => {

    if (window.confirm("Are you sure?  This can NOT be undone.")) {
        try {
            const res = await axios.delete('/api/profile');

            dispatch({ type: CLEAR_PROFILE });
            dispatch({ type: ACCOUNT_DELETED });

            dispatch(setAlert('Your account has been permanently deleted.'));
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
            });
        }

    }

};