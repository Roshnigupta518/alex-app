import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: [],
};

export const TagPeopleSlice = createSlice({
  name: 'TagPeople',
  initialState,
  reducers: {
    tagPeopleAction: (state, action) => {
      state.data = action?.payload;
    },
  },
});

export const {tagPeopleAction} = TagPeopleSlice.actions;

export default TagPeopleSlice.reducer;
