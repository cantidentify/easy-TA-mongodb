import api from '../utils/api';

const createSlice = require('@reduxjs/toolkit').createSlice

const signInSlice = createSlice({
    name : 'signIn',
    initialState : {
        id:"",
        password:"",
        errorHelper : {
            idInput : false,
            passwordInput: false
        },
        loginUser: {
            id : "",
            name: "",
            company : "",
            position : ""
        },
        loginErrorAlert: {
            show : false,
            message: 'Invalid credentials'
        }
    },
    reducers: {
        signInIdChange : (state, action) => {
            state.id = action.payload.id
            state.errorHelper.idInput = false
        },
        signInPasswordChange : (state, action) => {
            state.password = action.payload.password
            state.errorHelper.passwordInput = false
        },
        signInCheckTextInput : (state, payload) => {
            var check = true
            if(!state.id){
                state.errorHelper.idInput = true
                check = false
            }
            if(!state.password){
                state.errorHelper.passwordInput = true
                check = false
            }
            payload.success = check
        },
        signInReduce : (state, action) => {
            if(action.payload.status == "OK"){
                state.loginUser = {
                    id : action.payload.data.id,
                    name: action.payload.data.name,
                    company : action.payload.data.company,
                    position : action.payload.data.position
                }
                localStorage.setItem('userData',JSON.stringify(state.loginUser))
            }
            else{
                state.loginErrorAlert.show = true
            }
        }
    }
})

export default signInSlice.reducer
export const { signInIdChange, signInPasswordChange, signInCheckTextInput, signInReduce } = signInSlice.actions

export const signInAsync = (data) => async (dispatch) => {
    const body = JSON.stringify(data)
    try{
        const res = await api.post('/users', body)
        return dispatch(signInReduce({data : res.data, status : res.request.statusText}))
    } catch(err){
        return dispatch(signInReduce({ status : "Error"}))
    }
}