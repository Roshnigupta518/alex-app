import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const OnlineUserSlice = createSlice({
  name: 'OnlineUser',
  initialState,
  reducers: {
    OnlineUserAction: (state, action) => {
      state.data = action?.payload;
    },
  },
});

export const {OnlineUserAction} = OnlineUserSlice.actions;

export default OnlineUserSlice.reducer;
