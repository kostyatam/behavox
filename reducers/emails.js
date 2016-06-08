import * as types from '../constants/ActionsTypes.js';
import union from 'lodash/union';

export default function emails (state = {
    isFetching: false,
    cached: [],
    currentObservable: [],
    dateFrom: null,
    dateTo: null,
    dateMax: null,
    dateMin: null,
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
    let {emails, filter, applied, dateFrom, dateTo} = action;

    switch (action.type) {
        case types.REQUEST_EMAILS:
            return Object.assign({}, state, {
                isFetching: true
            });
        case types.RECEIVE_EMAILS:
            let dateMax;
            let dateMin;
            emails = emails.map((email) => {
                let date = new Date(email.date);
                dateFrom = dateFrom || new Date(date);
                dateTo = dateTo || new Date(date);
                dateFrom = (dateFrom > date) ? new Date(date.getTime()) : dateFrom;
                dateTo = (dateTo < date) ? new Date(date.getTime()) : dateTo;
                email.humanDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
                return email;
            }).sort(function(a,b){
                return new Date(a.date) - new Date(b.date);
            });
            dateMin = dateFrom = dateFrom.getTime();
            dateMax = dateTo = dateTo.getTime();
            return Object.assign({}, state, {
                cached: emails,
                currentObservable: emails,
                dateFrom,
                dateTo,
                dateMax,
                dateMin
            });
        case types.FILTER_APPLY:
            return Object.assign({}, state, {
                applied: applied.concat(filter),
                filter: {
                    value: '',
                    by: 'EVERYWHERE'
                },
                matches: {
                    byPerson: []
                }
            });
        case types.FILTER_CHANGE:
            dateFrom = dateFrom || state.dateFrom;
            dateTo = dateTo || state.dateTo;
            emails = filterByDate(emails, dateFrom, dateTo);
            let filtered = filterByAll(emails, filter, applied);
            return Object.assign({}, state, {
                filter,
                applied,
                currentObservable: filtered.filtered,
                matches: filtered.matches,
                dateFrom,
                dateTo
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
function filterByDate (emails, dateFrom, dateTo) {
    dateFrom = new Date(dateFrom);
    dateTo = new Date(dateTo);
    return emails.filter(email => {
        let date = new Date(email.date);
        return  date >= dateFrom && date <= dateTo;
    })
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

    filter = filter.toLowerCase();

    let {subject, body} = email;
    let found = false;
    let persons = [];

    let foundInPersons = containsPerson(email, filter);

    if (foundInPersons) {
        found = true;
        persons = union(persons, foundInPersons);
    }

    if (body.toLowerCase().indexOf(filter) !== -1) {
        found = true;
    }
    if (subject.toLowerCase().indexOf(filter) !== -1) {
        found = true;
    }

    if (!found) return;

    return persons
}

function containsPerson (email, filter) {
    if (!filter) return false;
    filter = filter.toLowerCase();
    let {from, to, subject, cc, bcc, body} = email;
    let found = false;
    let persons = [];

    to = to.filter(person => {
        return person.toLowerCase().indexOf(filter) !== -1;
    });

    if (to.length) {
        persons = union(persons, to);
        found = true;
    }

    cc = cc.filter(person => {
        return person.toLowerCase().indexOf(filter) !== -1;
    });
    if (cc.length) {
        persons = union(persons, cc);
        found = true;
    }

    bcc = bcc.filter(person => {
        return person.toLowerCase().indexOf(filter) !== -1;
    });
    if (bcc.length) {
        persons = union(persons, bcc);
        found = true;
    }

    if (from.toLowerCase().indexOf(filter) !== -1) {
        persons = union(persons, [from]);
        found = true;
    }

    if (!found) return;

    return persons
}