'use strict';
import * as types from '../constants/ActionsTypes';
import {emails} from '../mock/emails';

function requestEmails () {
    return {
        type: types.REQUEST_EMAILS
    }
}

function receiveEmails (emails) {
    return {
        type: types.RECEIVE_EMAILS,
        emails
    }
}

export function actionsService ($q) {
    return {
        fetchEmails,
        showEmails,
        changePage
    };

    function fetchEmails () {
        return dispatch => {
            dispatch(requestEmails());
            return getEmails().then(emails => {
                dispatch(receiveEmails(emails));
            });
        }
    }

    function showEmails ({emails, page, offset}) {
        return {
            type: types.SHOW_EMAILS,
            emails,
            page,
            offset
        }
    }

    function changePage (page) {
        return {
            type: types.CHANGE_PAGE,
            page
        }
    }

    function getEmails () {
        let promise = $q((resolve, reject) => {
            window.setTimeout(function () {
                resolve(emails);
            }, 1500);
        });
        return promise;
    }
}