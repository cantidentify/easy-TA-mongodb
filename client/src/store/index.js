import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import clocking from '../features/clocking'
import signIn from "../features/signIn";
import signUp from "../features/signUp";
import user from "../features/user";

const reducer = combineReducers({
    // adding reducer
    clocking,
    signIn,
    signUp,
    user
})

const store = configureStore({
    reducer
})

export default store