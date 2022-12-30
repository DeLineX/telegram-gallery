import { MediaMessage, Sender } from './chatSlice';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface FileId {
    min: number;
    full: number;
}

interface SenderState {
    mediaMessages: MediaMessage[];
}

const initialState: SenderState = {
    mediaMessages: [],
};

export const senderSlice = createSlice({
    name: 'sender',
    initialState,
    reducers: {
        addSenderMediaMessage: (state, action: PayloadAction<MediaMessage>) => {
            state.mediaMessages.push(action.payload);
        },
        loadSenderPhotos: (
            state,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _action: PayloadAction<{
                chatId: number;
                sender: Sender;
            }>
        ) => {
            state.mediaMessages = [];
        },
    },
});

export const { addSenderMediaMessage, loadSenderPhotos } = senderSlice.actions;
export const selectSender = (state: RootState) => state.sender;
export const senderReducer = senderSlice.reducer;
