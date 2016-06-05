import * as types from '../constants/ActionsTypes.js';
import union from 'lodash/union';

export default function emails (state = {
    isFetching: false,
    cached: [],
    currentObservable: [],
    filter: {
        value: '',
        by: 'EVERYWHERE'
    },
    matches: {
        byPerson: []
    },
    applied: [],
    chosenEmail: null
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
                filter: '',
                matches: {
                    byPerson: []
                }
            });
        case types.FILTER_CHANGE:
            let filtered = filterByAll(emails, filter, applied);
            return Object.assign({}, state, {
                filter,
                applied,
                currentObservable: filtered.filtered,
                matches: filtered.matches
            });
        case types.CHOOSE_EMAIL:
            let {chosenEmail} = action;
            return Object.assign({}, state, {
                chosenEmail
            });
        default:
            return state;
    }
}

function filterByAll (emails, filter, applied) {

    let matches = {
        byPerson: []
    };


    if (!filter.value.length && !applied.length) {
        return {
            filtered: emails,
            matches
        };
    };

    let filtered = emails.filter(email => {
        let containsApplied = applied.every((filter) => {
            if (filter.by === 'EVERYWHERE') {
                return isContain(email, filter.value);
            }
            if (filter.by === 'PERSON') {
                return containsPerson(email, filter.value);
            }
        });

        if (!filter.value) {
            return containsApplied;
        }

        let found;

        if (filter.by === 'EVERYWHERE') {
            found = isContain(email, filter.value);
        }
        if (filter.by === 'PERSON') {
            found = containsPerson(email, filter.value);
        }

        if (found && containsApplied) {
            matches.byPerson = union(matches.byPerson, found);
            return true;
        }
    });

    matches.byPerson = matches.byPerson.filter(match => !applied.some(filter => filter.value === match)).slice(0, 10);

    return {
        filtered,
        matches
    }
}

function isContain (email, filter) {
    if (!filter) return false;

    let {subject, body} = email;
    let found = false;
    let persons = [];

    let foundInPersons = containsPerson(email, filter);

    if (foundInPersons) {
        found = true;
        persons = union(persons, foundInPersons);
    }

    if (body.indexOf(filter) !== -1) {
        found = true;
    }
    if (subject.indexOf(filter) !== -1) {
        found = true;
    }

    if (!found) return;

    return persons
}

function containsPerson (email, filter) {
    if (!filter) return false;

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

    if (!found) return;

    return persons
}