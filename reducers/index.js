import {combineReducers} from 'redux';

import * as types from '../constants/ActionsTypes.js';

export default combineReducers({
    emails,
    emailsToShow,
    filter,
    pagination
})

function emails (state = {
    isFetching: false,
    items: null
}, action = {}) {
    switch (action.type) {
        case types.REQUEST_EMAILS:
            return Object.assign({}, state, {
                isFetching: true
            });
        case types.RECEIVE_EMAILS:
            let {emails: items} = action;
            return Object.assign({}, state, {
                items
            })
        default:
            return state;
    }
}

function emailsToShow (state = [], action = {}) {
    switch (action.type) {
        case types.SHOW_EMAILS:
            let {emails, page, offset} = action;
            let leftOffset = offset * (page - 1);
            return emails.slice(leftOffset, leftOffset + offset);
        default:
            return state;
    }
}

function filter (state = '', action = {}) {
    switch (action.type) {
        default:
            return state;
    }
}

function pagination (state = {
    current: 0,
    offset: 20,
    pages: 0
}, action = {}) {
    switch (action.type) {
        case types.RECEIVE_EMAILS:
            let {items} = emails(action.emails, action);
            let pages = Math.ceil(items.length / state.offset);
            return Object.assign({}, state, {
                pages
            });
        case types.CHANGE_PAGE:
            let {page: current} = action;
            return Object.assign({}, state, {
                current
            });
        default:
            return state;
    }
};

