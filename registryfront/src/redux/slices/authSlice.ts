import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from "../store";

interface AuthState {
    email: string | null
    groups: string[] | null;
}

const initialState: AuthState = {
    email: null,
    groups: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<string>) => {
            state.email = action.payload
        },
           updateUserGroups: (state, action: PayloadAction<{groups: string []}>) => {
        state.groups = action.payload.groups;
        },
        logoutUser: state => {
            state.email = null
        }
    }
})

export const { loginUser, updateUserGroups, logoutUser } = authSlice.actions

export const selectUserGroups = (state: RootState) => state.auth.groups;

export default authSlice.reducer