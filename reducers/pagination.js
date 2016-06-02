import * as types from '../constants/ActionsTypes.js';

export default function pagination (state = {
    page: 1,
    offset: 20
}, action = {}) {
    switch (action.type) {
        case types.CHANGE_PAGE:
            let {page} = action;
            return Object.assign({}, state, {
                page
            });
        case types.FILTER_CHANGE:
            return Object.assign({}, state, {
                page: 1
            });
        default:
            return state;
    }
};