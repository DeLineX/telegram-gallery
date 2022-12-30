import { MediaMessage, addChatMediaMessage } from './../slices/chatSlice';
import { selectMedia, getFile } from './../slices/mediaSlice';
import { MediaType } from './../slices/mediaSlice';
import {
    CHAT_MAX_MEDIA,
    CHAT_FILTER,
    CHAT_SUPPORTED_MEDIA,
    BASE_PRIORITY,
} from './../../config';
import { FileId, Sender } from './../slices/chatSlice';
import {
    ApiResponse,
    Messages,
    ReadFilePartParams,
    SearchChatMessagesParams,
    FilePartUnion,
    Message,
    MessageSenderUnion,
    GetChatParams,
    Chat,
    GetChatMemberParams,
    ChatMember,
} from '@airgram/web';
import { airgramApi } from './rootSaga';
import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { loadChatPhotos } from '../slices/chatSlice';
import { addMedia, readFile, updateMedia } from '../slices/mediaSlice';
import { addSenderMediaMessage, loadSenderPhotos } from '../slices/senderSlice';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

interface BaseWorkerArgs {
    type: string;
}

interface GetFileWorkerWorkerArgs extends BaseWorkerArgs {
    payload: {
        fileId: number;
        priority?: number;
        thumbData: string;
        type: MediaType;
    };
}

function* getFileWorker({ payload }: GetFileWorkerWorkerArgs) {
    const { fileId, priority = BASE_PRIORITY, thumbData, type } = payload;
    const { mediaStore } = yield select(selectMedia);

    if (!mediaStore[fileId]) {
        airgramApi.downloadFile({
            fileId,
            priority:
                type === 'video' || type === 'videoNote'
                    ? Math.max(priority - 1, 1)
                    : priority,
            // priority,
            synchronous: false,
        });
        yield put(
            addMedia({
                type,
                fileId,
                src: thumbData,
            })
        );
    }
}

function* processMessages(
    messages: Message[],
    addMediaMessage: ActionCreatorWithPayload<MediaMessage, string>,
    priority = BASE_PRIORITY + 1
) {
    for (const message of messages) {
        if (!CHAT_SUPPORTED_MEDIA.includes(message.content._)) continue;
        const sender: Sender = {
            type: message.senderId._ === 'messageSenderChat' ? 'chat' : 'user',
            id:
                message.senderId._ === 'messageSenderChat'
                    ? message.senderId.chatId
                    : message.senderId.userId,
        };
        let fileId: FileId = {
            min: 0,
            full: 0,
        };
        let thumbData = '';
        let type: MediaType = 'unknown';
        switch (message.content._) {
            case 'messageUnsupported': {
                fileId = {
                    min: message.id,
                    full: message.id,
                };
                type = 'unsupported';
                break;
            }
            case 'messagePhoto': {
                const photo = message.content.photo;
                fileId = {
                    min: photo.sizes[0].photo.id,
                    full: photo.sizes[photo.sizes.length - 1].photo.id,
                };
                type = 'photo';
                thumbData = photo.minithumbnail?.data ?? '';
                break;
            }
            case 'messageVideo': {
                const video = message.content.video;
                fileId = {
                    min: video.thumbnail?.file.id ?? 0,
                    full: video.video.id,
                };
                type = 'video';
                thumbData = video.minithumbnail?.data ?? '';
                break;
            }
            case 'messageVideoNote': {
                const video = message.content.videoNote;
                fileId = {
                    min: video.thumbnail?.file.id ?? 0,
                    full: video.video.id,
                };
                type = 'videoNote';
                thumbData = video.minithumbnail?.data ?? '';
                break;
            }
        }
        yield put(addMediaMessage({ fileId, sender }));
        yield getFileWorker({
            payload: {
                type,
                fileId: fileId.min,
                thumbData,
                priority,
            },
            type: '',
        });
        if (['video', 'videoNote'].includes(type))
            yield getFileWorker({
                payload: {
                    type,
                    fileId: fileId.full,
                    thumbData,
                    priority: priority ? priority - 1 : undefined,
                },
                type: '',
            });
    }
}

interface LoadChatPhotosWorkerArgs extends BaseWorkerArgs {
    payload: number;
}

function* loadChatPhotosWorker({ payload }: LoadChatPhotosWorkerArgs) {
    const limit = CHAT_MAX_MEDIA;
    const requestLimit = Math.max(Math.floor(limit / 5), 1);
    let fromMessageId = 0;

    for (let i = 0; i < limit; i += requestLimit) {
        const { response }: ApiResponse<SearchChatMessagesParams, Messages> =
            yield call(airgramApi.searchChatMessages, {
                chatId: payload,
                limit: i + requestLimit > limit ? limit - i : requestLimit,
                filter: { _: CHAT_FILTER },
                fromMessageId,
            });

        if (response._ === 'error') {
            alert('something went wrong..');
            // eslint-disable-next-line no-console
            return console.log(response.message);
        }

        const messages = response.messages;
        if (!messages?.length) return;

        yield processMessages(messages, addChatMediaMessage);

        fromMessageId = messages[messages.length - 1].id;
    }
}

interface LoadSenderPhotosWorkerArgs extends BaseWorkerArgs {
    payload: {
        chatId: number;
        sender: Sender;
    };
}

function* loadChatMembers(chatId: number, senderId?: MessageSenderUnion) {
    const { response }: ApiResponse<GetChatParams, Chat> =
        yield airgramApi.getChat({
            chatId,
        });

    if (response._ === 'error') throw new Error(response.message);

    switch (response.type._) {
        case 'chatTypeBasicGroup':
            yield airgramApi.getBasicGroupFullInfo({
                basicGroupId: response.type.basicGroupId,
            });
            break;
        case 'chatTypeSupergroup': {
            const limit = 200;
            for (let offset = 0; ; offset += limit) {
                const {
                    response: chatMember,
                }: ApiResponse<GetChatMemberParams, ChatMember> =
                    yield airgramApi.getChatMember({
                        chatId,
                        memberId: senderId,
                    });
                if (chatMember._ !== 'error') return;
                yield airgramApi.getSupergroupMembers({
                    supergroupId: response.type.supergroupId,
                    limit,
                    filter: {
                        _: 'supergroupMembersFilterRecent',
                    },
                    offset,
                });
            }
        }
    }
}

function* loadSenderPhotosWorker({ payload }: LoadSenderPhotosWorkerArgs) {
    const { chatId, sender } = payload;
    try {
        const senderId: MessageSenderUnion =
            sender.type === 'chat'
                ? {
                      _: 'messageSenderChat',
                      chatId: sender.id,
                  }
                : {
                      _: 'messageSenderUser',
                      userId: sender.id,
                  };
        yield loadChatMembers(chatId, senderId);
        let fromMessageId = 0;
        while (true) {
            const {
                response,
            }: ApiResponse<SearchChatMessagesParams, Messages> =
                yield airgramApi.searchChatMessages({
                    chatId,
                    senderId,
                    limit: 100,
                    fromMessageId,
                });

            if (response._ === 'error') {
                throw new Error(response.message);
            }

            const messages = response.messages;
            if (!messages?.length) return;

            yield processMessages(
                messages,
                addSenderMediaMessage,
                BASE_PRIORITY + 2
            );

            fromMessageId = messages[messages.length - 1].id;
        }
    } catch (e) {
        alert('something went wrong..');
        // eslint-disable-next-line no-console
        console.log((e as Error).message);
    }
}

interface ReadFileWorkerArgs extends BaseWorkerArgs {
    payload: {
        fileId: number;
    };
}

function* readFileWorker({
    payload,
}: ReadFileWorkerArgs): Generator<
    unknown,
    void,
    ApiResponse<ReadFilePartParams, FilePartUnion>
> {
    const { response } = yield airgramApi.readFilePart(payload);

    if (response._ === 'error') {
        alert('something went wrong..');
        throw new Error(response.message);
    }

    const src = URL.createObjectURL(
        new Blob([response.data], {
            type: 'image/jpeg',
        })
    );
    const { fileId } = payload;
    yield put(
        updateMedia({
            fileId,
            src,
        })
    );
}

export function* chatsSaga() {
    yield takeLatest(loadChatPhotos.type, loadChatPhotosWorker);
    yield takeLatest(loadSenderPhotos.type, loadSenderPhotosWorker);
    yield takeEvery(getFile.type, getFileWorker);
    yield takeEvery(readFile.type, readFileWorker);
}
