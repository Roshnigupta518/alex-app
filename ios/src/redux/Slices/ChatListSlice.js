import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const ChatListSlice = createSlice({
  name: 'ChatList',
  initialState,
  reducers: {
    ChatListAction: (state, action) => {
      state.data = action?.payload;
    },
  },
});

export const {ChatListAction} = ChatListSlice.actions;

export default ChatListSlice.reducer;
