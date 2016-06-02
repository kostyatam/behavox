'use strict';
import * as types from '../constants/ActionsTypes';
import {emails} from '../mock/emails';
import isEqual from 'lodash/isEqual';

console.log('isEqual', isEqual);

export function actionsService ($q) {
    return {
        fetchEmails,
        changePage,
        changeFilter,
        addToApplied
    };

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

    function fetchEmails () {
        return dispatch => {
            dispatch(requestEmails());
            return getEmails($q).then(emails => {
                dispatch(receiveEmails(emails));
            });
        }
    }

    function changePage (page) {
        return {
            type: types.CHANGE_PAGE,
            page
        }
    }

    function filterObservable (emails, filter, applied) {
        return {
            type: types.FILTER_CHANGE,
            filter,
            applied,
            emails
        }
    }


    function applyFilter (newFilter) {
        return {
            type: types.FILTER_APPLY,
            filter: newFilter
        }
    }

    function changeFilter (newFilter, newApplied) {
        return (dispatch, getState) => {
            const {emails} = getState();
            const {filter, applied} = emails;
            if (newFilter === filter && isEqual(newApplied, applied)) {
                return;
            }
            if (newFilter.indexOf(filter) !== -1 && isEqual(newApplied, applied)) {
                dispatch(filterObservable(emails.currentObservable, newFilter, applied));
                return;
            } else {
                dispatch(filterObservable(emails.cached, newFilter, applied));
                return;
            }
        }
    }

    function addToApplied (filterForApplied, newApplied) {
        return (dispatch, getState) => {
            const {emails} = getState();
            const {filter, applied} = emails;

            if (filter === filterForApplied && isEqual(newApplied, applied)) {
                dispatch(applyFilter(filterForApplied, newApplied));
                return;
            }

            if (filterForApplied.indexOf(filter) !== -1 && isEqual(newApplied, applied)) {
                dispatch(filterObservable(emails.currentObservable, '', applied.concat(filterForApplied)));
                return;
            } else {
                dispatch(filterObservable(emails.cached, '', filterForApplied));
                return;
            }
        }
    }
}

function getEmails (Promise) {
    let promise = Promise((resolve, reject) => {
        window.setTimeout(function () {
            resolve(emails);
        }, 1500);
    });
    return promise;
}