import { senderReducer } from './slices/senderSlice';
import { mediaReducer } from './slices/mediaSlice';
import { chatsReducer } from './slices/chatsSlice';
import { authReducer } from './slices/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './sagas/rootSaga';
import { chatReducer } from './slices/chatSlice';

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
    reducer: {
        auth: authReducer,
        media: mediaReducer,
        chats: chatsReducer,
        chat: chatReducer,
        sender: senderReducer,
    },
    middleware: [sagaMiddleware],
});
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const storeDispatch = store.dispatch;
