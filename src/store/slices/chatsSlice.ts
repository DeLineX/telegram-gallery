import { Chat } from '@airgram/web';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface ChatState {
    chats: Chat[];
}

const initialState: ChatState = {
    chats: [],
};

export const chatsSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addChat: (state, action: PayloadAction<Chat>) => {
            state.chats.push(action.payload);
        },
    },
});

export const { addChat } = chatsSlice.actions;
export const selectChats = (state: RootState) => state.chats;
export const chatsReducer = chatsSlice.reducer;
