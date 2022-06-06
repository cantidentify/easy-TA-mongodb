import api from '../utils/api';

const createSlice = require('@reduxjs/toolkit').createSlice

const signUpSlice = createSlice({
    name : 'signUp',
    initialState : {
        id:"",
        fullName:"",
        password:"",
        password2:"",
        errorHelper : {
            idInput : false,
            fullNameInput : false,
            passwordInput: false,
            passwordInput2: false,
            passwordInputText: "Please enter your password."
        },
        registerErrorAlert : {
            show : false,
            message: ''
        }

    },
    reducers: {
        signUpIdChange : (state, action) => {
            state.id = action.payload.id
            state.errorHelper.idInput = false
        },
        signUpFullName : (state, action) => {
            state.fullName = action.payload.name
            state.errorHelper.fullNameInput = false
        },
        signUpPasswordChange : (state, action) => {
            state.password = action.payload.password
            if(state.password == state.password2){
                state.errorHelper.passwordInput = false
                state.errorHelper.passwordInput2 = false
                state.errorHelper.passwordInputText = "Please enter your password."
            }
            else{
                state.errorHelper.passwordInput = true
                state.errorHelper.passwordInput2 = true
                state.errorHelper.passwordInputText = "Password must be the same."
            }
        },
        signUpConfirmPasswordChange : (state, action) => {
            state.password2 = action.payload.password
            if(state.password == state.password2){
                state.errorHelper.passwordInput = false
                state.errorHelper.passwordInput2 = false
                state.errorHelper.passwordInputText = "Please enter your password."
            }
            else{
                state.errorHelper.passwordInput = true
                state.errorHelper.passwordInput2 = true
                state.errorHelper.passwordInputText = "Password must be the same."
            }
        },
        registerNewUserReduce : (state, action) => {
            if(action.payload.status == "OK"){
                const loginUser = {
                    id : action.payload.data.id,
                    name: action.payload.data.name,
                    company : action.payload.data.company,
                    position : action.payload.data.position
                }
                localStorage.setItem('userData',JSON.stringify(loginUser))
            }
            else{
                state.registerErrorAlert.show = true
                state.registerErrorAlert.message = action.payload.errorMessage[0].msg
            }

        },
        signUpCheckTextInput : (state, action) =>{
            var check = true
            if(!state.id){
                state.errorHelper.idInput = true
                check = false
            }
            if(!state.fullName){
                state.errorHelper.fullNameInput = true
                check = false
            }
            if(!state.password){
                state.errorHelper.passwordInput = true
                check = false
            }
            if(!state.password2){
                state.errorHelper.passwordInput2 = true
                check = false
            }
            action.success = check
        }
    }
})

export default signUpSlice.reducer
export const { signUpIdChange, signUpFullName, signUpPasswordChange, signUpConfirmPasswordChange, signUpCheckTextInput, registerNewUserReduce } = signUpSlice.actions
export const registerNewUserAsync = (data) => async dispatch => {
    const body = JSON.stringify(data)
    try{
        const res = await api.post('/users/signUp', body)
        return dispatch(registerNewUserReduce({data : res.data, status : res.request.statusText}))
    } catch (err){
        return dispatch(registerNewUserReduce({status : "Error", errorMessage : err.response.data.errors}))
    }
}