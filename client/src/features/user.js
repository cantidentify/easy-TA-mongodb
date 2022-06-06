const createSlice = require('@reduxjs/toolkit').createSlice

const userSlice = createSlice({
    name : 'user',
    initialState: {
        id : "",
        name: "",
        company : "",
        position : ""
    },
    reducers: {
        setUser : (state,action) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.company = action.payload.company
            state.position = action.payload.position
        },
        logOut: (state) => {
            state.id = ""
            state.name = ""
            state.company = ""
            state.position = ""
            localStorage.clear()
        }
    }
})

export default userSlice.reducer
export const { setUser, logOut } = userSlice.actions