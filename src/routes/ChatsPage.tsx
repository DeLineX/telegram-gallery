import {
    Avatar,
    Box,
    Divider,
    Grid,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { loadChatPhotos } from '../store/slices/chatSlice';
import { selectChats } from '../store/slices/chatsSlice';

export const ChatsPage = () => {
    const dispatch = useDispatch();
    const { chats } = useSelector(selectChats);
    const navigate = useNavigate();

    return (
        <>
            <Box
                sx={{
                    backgroundColor: '#fff',
                    position: 'sticky',
                    zIndex: 1,
                    top: 0,
                    py: 2,
                }}
            >
                <Typography variant="h3" mb={2} textAlign="center">
                    Telegram Gallery
                </Typography>
                <Typography variant="h4" textAlign={'center'}>
                    Select chat
                </Typography>
            </Box>
            {chats.length !== 0 && (
                <Grid container spacing={2}>
                    {chats.map(chat => (
                        <Grid item xs={12} sm={6} key={chat.id}>
                            <ListItem
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover + hr': {
                                        borderColor: '#000',
                                        ml: 10,
                                    },
                                }}
                                onClick={() => {
                                    navigate('' + chat.id);
                                    dispatch(loadChatPhotos(chat.id));
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        src={
                                            chat.photo?.minithumbnail
                                                ? 'data:image/jpeg;base64, ' +
                                                  chat.photo?.minithumbnail.data
                                                : ''
                                        }
                                        sx={{
                                            bgcolor: (
                                                '#' + Math.abs(chat.id)
                                            ).slice(0, 4),
                                        }}
                                    >
                                        {chat.title[0]}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={chat.title} />
                            </ListItem>
                            <Divider
                                variant="inset"
                                sx={{ transition: 'ease-in-out .2s' }}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
            {chats.length == 0 && <Loader />}
        </>
    );
};
