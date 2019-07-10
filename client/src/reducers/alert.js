// REDUCER
// takes in piece of state and an action, which is dispatched from an action file
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

// take in state and action
// action takes type and payload (the data)
export default function(state = initialState, action) {
    const { type, payload } = action;
    // use a switch to evaluate the action
    switch (type) {
        case SET_ALERT:
            // includes any other state that already exists, so we add our action.payload to what exists
            return [...state, payload];
        case REMOVE_ALERT:
            // return all alerts except the one specified by id (the one that matches the payload)
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
};

