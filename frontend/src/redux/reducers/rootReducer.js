import { combineReducers } from 'redux';
import userListReducer from './userListReducer';
import userCreatorReducer from './userCreatorReducer';
import userDetailsReducer from './userDetailsReducer';

const reducers = combineReducers({
    userListReducer,
    userCreatorReducer,
    userDetailsReducer
})

export default reducers;