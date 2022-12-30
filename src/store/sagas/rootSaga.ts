import { storeDispatch } from './../store';
import { AuthorizationState } from './../../config';
import { all } from 'redux-saga/effects';
import { chatSaga } from './chatsSaga';
import { Airgram, TdObject } from '@airgram/web';
import { TdLibParams } from '../../config';
import { login, setQrLink } from '../slices/authSlice';
import { addChat } from '../slices/chatsSlice';
import { chatsSaga } from './chatSaga';
import { readFile } from '../slices/mediaSlice';

export const airgram = new Airgram(TdLibParams);
export const airgramApi = airgram.api;

export function* rootSaga() {
    yield airgram.on('updateAuthorizationState', (ctx, next) => {
        const authorizationState = ctx.update.authorizationState as TdObject;
        switch (authorizationState._) {
            case AuthorizationState.WaitPhoneNumber:
            case AuthorizationState.WaitEmailAddress:
            case AuthorizationState.WaitEmailCode:
            case AuthorizationState.WaitCode:
            case AuthorizationState.WaitRegistration:
            case AuthorizationState.WaitPassword:
                airgram.api.requestQrCodeAuthentication();
                break;
            case AuthorizationState.WaitOtherDeviceConfirmation:
                storeDispatch(setQrLink(authorizationState.link as string));
                break;
            case AuthorizationState.Ready:
                storeDispatch(login());
                break;
        }
        return next();
    });

    yield airgram.on('updateNewChat', (ctx, next) => {
        const chat = ctx.update.chat;
        storeDispatch(addChat(chat));
        return next();
    });

    yield airgram.on('updateFile', (ctx, next) => {
        const file = ctx.update.file;

        const { isDownloadingCompleted } = file.local;
        if (isDownloadingCompleted) {
            storeDispatch(
                readFile({
                    fileId: file.id,
                })
            );
        }
        return next();
    });

    yield all([chatSaga(), chatsSaga()]);
}
