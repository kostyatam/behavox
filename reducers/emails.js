import * as types from '../constants/ActionsTypes.js';
import union from 'lodash/union';

export default function emails (state = {
    isFetching: false,
    cached: [],
    currentObservable: [],
    filter: '',
    matches: {
        byPerson: []
    },
    applied: []
}, action = {}) {
    let {emails, filter, applied} = action;

    switch (action.type) {
        case types.REQUEST_EMAILS:
            return Object.assign({}, state, {
                isFetching: true
            });
        case types.RECEIVE_EMAILS:
            return Object.assign({}, state, {
                cached: emails,
                currentObservable: emails
            });
        case types.FILTER_APPLY:
            return Object.assign({}, state, {
                applied: applied.concat(filter),
                filter: ''
            });
        case types.FILTER_CHANGE:
            let filtered = filterByAll(emails, filter, applied);
            return Object.assign({}, state, {
                filter,
                currentObservable: filtered.filtered,
                matches: filtered.matches
            });
        default:
            return state;
    }
}

function filterByAll (emails, filter, applied) {
    let matches = {
        byPerson: []
    };
    let filters = applied.concat(filter || []);
    let filtered = emails.filter(email => {
        let foundPersons = [];
        let contain = filters.every((filter) => {
            let found = isContain(email, filter);
            if (!found) {
                return false;
            }
            foundPersons = union(foundPersons, found.persons);
            return true;
        });
        if (!contain) return false;

        matches.byPerson = union(matches.byPerson, foundPersons);
        return true;
    });

    matches.byPerson = matches.byPerson.slice(0, 10);

    return {
        filtered,
        matches
    }
}

function isContain (email, filter) {
    let {from, to, subject, cc, bcc, body} = email;
    let found = false;
    let persons = [];

    to = to.filter(person => {
        return person.indexOf(filter) !== -1;
    });
    if (to.length) {
        persons = union(persons, to);
        found = true;
    }

    cc = cc.filter(person => {
        return person.indexOf(filter) !== -1;
    });
    if (cc.length) {
        persons = union(persons, cc);
        found = true;
    }

    bcc = bcc.filter(person => {
        return person.indexOf(filter) !== -1;
    });
    if (bcc.length) {
        persons = union(persons, bcc);
        found = true;
    }

    if (from.indexOf(filter) !== -1) {
        persons = union(persons, [from]);
        found = true;
    }
    if (body.indexOf(filter) !== -1) {
        found = true;
    }
    if (subject.indexOf(filter) !== -1) {
        found = true;
    }

    if (!found) return;

    return {persons}
}