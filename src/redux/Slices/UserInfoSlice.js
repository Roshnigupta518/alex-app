import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const UserInfoSlice = createSlice({
  name: 'UserInfo',
  initialState,
  reducers: {
    userDataAction: (state, action) => {
      state.data = action?.payload;
    },
  },
});

export const {userDataAction} = UserInfoSlice.actions;

export default UserInfoSlice.reducer;
