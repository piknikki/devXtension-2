import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from "./types";


// thunk middleware allows us to use dispatch to dispatch more than one action at a time
// set default of timeout
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    // this creates a random id
    const id = uuid.v4();
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    // dispatch remove_alert when timeout runs out
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};