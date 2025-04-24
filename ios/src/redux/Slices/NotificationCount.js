import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: 0,
};

export const NotificationCountSlice = createSlice({
  name: 'NotificationCount',
  initialState,
  reducers: {
    NotificationCountAction: (state, action) => {
      state.data = action?.payload;
    },
  },
});

export const {NotificationCountAction} = NotificationCountSlice.actions;

export default NotificationCountSlice.reducer;
