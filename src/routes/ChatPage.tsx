import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MediaGallery } from '../components/MediaGallery/MediaGallery';
import { loadChatPhotos, selectChat } from '../store/slices/chatSlice';
import { selectChats } from '../store/slices/chatsSlice';

export const ChatPage = () => {
    const params = useParams();
    const chatId = +(params.chatId ?? '');
    const dispatch = useDispatch();
    const { chats } = useSelector(selectChats);
    const { mediaMessages } = useSelector(selectChat);

    useEffect(() => {
        if (!chats.length || chats[chats.length - 1].id !== chatId) return;

        dispatch(loadChatPhotos(chatId));
    }, [dispatch, chats]);

    return <MediaGallery mediaMessages={mediaMessages} navigateToSender />;
};
