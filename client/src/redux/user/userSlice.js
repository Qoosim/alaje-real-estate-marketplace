import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    error: null,
    isLoading: false
  },
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload,
      state.error = null
      state.isLoading = false
    },
    loginFailure: (state, action) => {
      state.error = action.payload,
      state.isLoading = false
    },
    updateUserStart: (state) => {
      state.isLoading = true
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload,
      state.isLoading = false,
      state.error = null
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload,
      state.isLoading = false
    },
    deleteUserStart: (state) => {
      state.isLoading = true
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null,
      state.isLoading = false,
      state.error = null
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload,
      state.isLoading = false
    },
    logoutUserStart: (state) => {
      state.isLoading = true
    },
    logoutUserSuccess: (state) => {
      state.currentUser = null,
      state.isLoading = false,
      state.error = null
    },
    logoutUserFailure: (state, action) => {
      state.error = action.payload,
      state.isLoading = false
    }
  }
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logoutUserStart,
  logoutUserSuccess,
  logoutUserFailure
} = userSlice.actions

export default userSlice.reducer
