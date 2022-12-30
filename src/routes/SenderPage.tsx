import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MediaGallery } from '../components/MediaGallery/MediaGallery';
import { loadChatPhotos, selectChat } from '../store/slices/chatSlice';
import { selectChats } from '../store/slices/chatsSlice';
import { loadSenderPhotos, selectSender } from '../store/slices/senderSlice';

export const SenderPage = () => {
    const params = useParams();
    const chatId = +(params.chatId ?? '');
    const senderType = (params.senderType ?? '') as 'chat' | 'user';
    const senderId = +(params.senderId ?? '');
    const dispatch = useDispatch();
    const { chats } = useSelector(selectChats);
    const { mediaMessages } = useSelector(selectSender);
    const { mediaMessages: chatMediaMessages } = useSelector(selectChat);

    useEffect(() => {
        if (!chats.length || chats[chats.length - 1].id !== chatId) return;

        dispatch(
            loadSenderPhotos({
                chatId,
                sender: {
                    type: senderType,
                    id: senderId,
                },
            })
        );
    }, [dispatch, chats]);

    useEffect(() => {
        return () => {
            if (!chatMediaMessages.length) dispatch(loadChatPhotos(chatId));
        };
    }, [dispatch]);

    return <MediaGallery mediaMessages={mediaMessages} />;
};
