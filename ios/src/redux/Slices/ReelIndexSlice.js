import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: 0,
};

export const ReelIndexSlice = createSlice({
  name: 'ReelIndex',
  initialState,
  reducers: {
    ReelIndexAction: (state, action) => {
      state.data = action?.payload;
    },
  },
});

export const {ReelIndexAction} = ReelIndexSlice.actions;

export default ReelIndexSlice.reducer;
