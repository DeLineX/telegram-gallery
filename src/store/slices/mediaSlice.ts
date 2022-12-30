import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type MediaType =
    | 'photo'
    | 'video'
    | 'videoNote'
    | 'unknown'
    | 'unsupported';

export interface Media {
    type: MediaType;
    src: string;
    isLoading: boolean;
}

export interface MediaStore {
    [key: number]: Media;
}

interface MediaState {
    mediaStore: MediaStore;
}

const initialState: MediaState = {
    mediaStore: {},
};

export const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        addMedia: (
            state,
            action: PayloadAction<{ fileId: number } & Omit<Media, 'isLoading'>>
        ) => {
            const { fileId, type } = action.payload;
            if (!state.mediaStore[fileId])
                state.mediaStore[fileId] = {
                    ...action.payload,
                    isLoading: ['unsupported', 'unknown'].includes(type)
                        ? false
                        : true,
                };
        },
        updateMedia: (
            state,
            action: PayloadAction<
                { fileId: number } & Omit<Media, 'type' | 'isLoading'>
            >
        ) => {
            const { fileId } = action.payload;
            const media = state.mediaStore[fileId] ?? {};
            state.mediaStore[fileId] = {
                ...media,
                ...action.payload,
                isLoading: false,
            };
        },
        getFile: (
            state,
            action: PayloadAction<{
                fileId: number;
                priority?: number;
                thumbData: string;
                type: MediaType;
            }>
        ) => {
            state;
            action;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        readFile: (
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _action: PayloadAction<{
                fileId: number;
            }>
        ) => {},
    },
});

export const { addMedia, updateMedia, getFile, readFile } = mediaSlice.actions;
export const selectMedia = (state: RootState) => state.media;
export const mediaReducer = mediaSlice.reducer;
