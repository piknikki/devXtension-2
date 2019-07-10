import {
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'), // get the token from local storage
    isAuthenticated: null, // change once logged in, use this to show certain things to logged in users
    loading: true, // make sure everything necessary is finished loading, use this to show state of loaded data
    user: null
}

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token); // same as action.payload.token
            return {
                ...state, // get all the state
                ...payload, // get all the payload
                isAuthenticated: true, // success
                loading: false // done loading once registration is successful
            }
        case REGISTER_FAIL:
            localStorage.removeItem('token', payload.token);
            return {
                ...state, // get all the state, but don't need payload because registration failed
                token: null, // token is null bc reg failed
                isAuthenticated: false, // not authenticated bc reg failed
                loading: false // done loading even though reg failed
            }
        default:
            return state;
    }
}












