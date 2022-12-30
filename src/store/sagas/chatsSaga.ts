import { airgramApi } from './rootSaga';
import { takeEvery, call } from 'redux-saga/effects';
import { login } from '../slices/authSlice';

function* loadChatsWorker() {
    yield call(airgramApi.loadChats, { limit: 100 });
}

export function* chatSaga() {
    yield takeEvery(login.type, loadChatsWorker);
}
