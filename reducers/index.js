import {combineReducers} from 'redux';

import emails from './emails';
import filter from './filter';
import pagination from './pagination';

export default combineReducers({
    emails,
    filter,
    pagination
})

