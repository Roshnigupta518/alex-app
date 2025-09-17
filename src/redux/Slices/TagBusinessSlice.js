import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const TagBusinessSlice = createSlice({
  name: 'TagBusiness',
  initialState,
  reducers: {
    tagBusinessAction: (state, action) => {
      state.data = action?.payload;
    },
    clearBusinessAction:(state, action) => {
      state.data = null
    },
  },
});

export const {tagBusinessAction, clearBusinessAction} = TagBusinessSlice.actions;

export default TagBusinessSlice.reducer;
