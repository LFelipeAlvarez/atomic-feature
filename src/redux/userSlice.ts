import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User, UserState } from "../types";

const initialState: UserState = {
    user: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        logOut: (state) => {
            if (state.user) {
                state.user.name = '';
                state.user.picture = '';
            }
        }
    }
});


export const { setUser, logOut } = userSlice.actions;
export default userSlice.reducer;