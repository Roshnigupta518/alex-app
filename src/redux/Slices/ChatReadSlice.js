import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: false,
};

export const ChatReadSlice = createSlice({
  name: 'ChatRead',
  initialState,
  reducers: {
    ChatReadAction: (state, action) => {
      state.data = action?.payload;
    },
  },
});

export const {ChatReadAction} = ChatReadSlice.actions;

export default ChatReadSlice.reducer;
