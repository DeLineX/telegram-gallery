import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface FileId {
    min: number;
    full: number;
}

export interface Sender {
    type: 'user' | 'chat';
    id: number;
}

export interface MediaMessage {
    fileId: FileId;
    sender: Sender;
}

interface ChatState {
    mediaMessages: MediaMessage[];
}

const initialState: ChatState = {
    mediaMessages: [],
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addChatMediaMessage: (state, action: PayloadAction<MediaMessage>) => {
            state.mediaMessages.push(action.payload);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        loadChatPhotos: (state, _action: PayloadAction<number>) => {
            state.mediaMessages = [];
        },
    },
});

export const { addChatMediaMessage, loadChatPhotos } = chatSlice.actions;
export const selectChat = (state: RootState) => state.chat;
export const chatReducer = chatSlice.reducer;
