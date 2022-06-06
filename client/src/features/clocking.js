const createSlice = require('@reduxjs/toolkit').createSlice

const clockingSlice = createSlice({
    name:'clocking',
    initialState: {
        user: {
            id: ""
        },
        errorAlert: {
            show : false,msg : "", class:"alert alert-danger"
        },
        disableBtn: false,
        clockStatus : {
            type : "Check-in",
            status : "Normal",
            show : false
        },
        disableIdInput : false
    },
    reducers: {
        clockingSuccess: (state,action) => {
            state.errorAlert = {show : true, msg:action.payload.successMsg, class:"alert alert-success"};
            state.disableBtn = true;
            state.clockStatus = action.payload.clockingData
        },
        clockingFail: (state,action) => {
            state.errorAlert = {show : true, msg:action.payload.msg, class:action.payload.class};
            state.disableBtn = true;
        },
        setErrorAlert: (state,action) => {
            state.errorAlert = {show : action.payload.show, msg:action.payload.msg, class:action.payload.class}

        },
        onChangeInput: (state, action) => {
            state.user.id = action.payload.id;
            state.errorAlert = {show : false, msg: ""}
            state.disableBtn = false;
            state.clockStatus.show = false;
        },
        logedIn: (state,action) => {
            state.user.id = action.payload
            state.disableIdInput = true
        },
        initialPage: (state,action) => {
            state.clockStatus.show = false;
            state.disableBtn = false
            state.errorAlert.show = false
        }
    }
})

export default clockingSlice.reducer
export const { clockingSuccess, clockingFail, setErrorAlert, onChangeInput, logedIn, initialPage } = clockingSlice.actions

