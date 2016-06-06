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
        addToApplied,
        removeApplied,
        chooseEmail,
        setDateFrom,
        setDateTo,
        clearDateFilter
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

    function filterObservable (filter, applied, emails, dateFrom, dateTo) {
        return {
            type: types.FILTER_CHANGE,
            filter,
            applied,
            emails,
            dateFrom,
            dateTo
        }
    }


    function applyFilter (filter, applied) {
        return {
            type: types.FILTER_APPLY,
            filter,
            applied
        }
    }

    function changeFilter (newFilter, newApplied) {
        return (dispatch, getState) => {
            const {emails} = getState();
            const {filter, applied} = emails;
            const appliedIsEqual = isEqual(newApplied, applied);
            const filterIsEqual = isEqual(newFilter, filter);
            if (appliedIsEqual && filterIsEqual) {
                return;
            }
            if (newFilter.value.indexOf(filter.value) !== -1 && newFilter.by === filter.by && isEqual(newApplied, applied)) {
                dispatch(filterObservable(newFilter, applied, emails.currentObservable));
                return;
            } else {
                dispatch(filterObservable(newFilter, applied, emails.cached));
                return;
            }
        }
    }

    function addToApplied (newFilter, newApplied) {
        return (dispatch, getState) => {
            const {emails} = getState();
            const {filter, applied} = emails;
            const appliedIsEqual = isEqual(newApplied, applied);
            const filterIsEqual = isEqual(newFilter, filter);

            if (appliedIsEqual && filterIsEqual) {
                dispatch(applyFilter(newFilter, newApplied));
                return;
            }

            if (newFilter.value.indexOf(filter.value) !== -1 && newFilter.by === filter.by || filter.by === 'EVERYWHERE' && isEqual(newApplied, applied)) {
                dispatch(filterObservable({
                    value: '',
                    by: 'EVERYWHERE'
                }, applied.concat(newFilter), emails.currentObservable));
                return;
            } else {
                dispatch(filterObservable({
                    value: '',
                    by: 'EVERYWHERE'
                }, applied.concat(newFilter), emails.cached));
                return;
            }
        }
    }

    function removeApplied (removingApplied) {
        return (dispatch, getState) => {
            const {emails} = getState();
            const {filter, applied} = emails;
            console.log('filter %s', filter)
            dispatch(filterObservable(filter, applied.filter(filter => {
                return !isEqual(filter, removingApplied);
            }), emails.cached));
        }
    }

    function setDateFrom (newDateFrom) {
        return (dispatch, getState) => {
            const {emails} = getState();
            const {filter, applied, dateFrom,cached, currentObservable} = emails;
            if (dateFrom === newDateFrom) return;

            if (newDateFrom > dateFrom) {
                dispatch(filterObservable(filter, applied, currentObservable, newDateFrom));
                return;
            }
            dispatch(filterObservable(filter, applied, cached, newDateFrom))
        }
    }

    function setDateTo (newDateTo) {
        return (dispatch, getState) => {
            const {emails} = getState();
            const {filter, applied, dateFrom, dateTo,cached, currentObservable} = emails;
            if (dateTo === newDateTo) return;

            if (newDateTo < dateTo) {
                dispatch(filterObservable(filter, applied, currentObservable, dateFrom, newDateTo));
                return;
            }
            dispatch(filterObservable(filter, applied, cached, dateFrom, newDateTo))
        }
    }

    function clearDateFilter () {
        return (dispatch, getState) => {
            const {emails} = getState();
            const {filter, applied, dateMax, dateMin, cached, currentObservable} = emails;
            dispatch(filterObservable(filter, applied, cached, dateMin, dateMax))
        }
    }

    function chooseEmail (chosenEmail) {
        return {
            type: types.CHOOSE_EMAIL,
            chosenEmail
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