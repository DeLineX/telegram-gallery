import { Container, CssBaseline } from '@mui/material';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { AuthPage } from './routes/AuthPage';
import { ErrorPage } from './routes/ErrorPage';
import { selectAuth } from './store';
import { useSelector } from 'react-redux';
import { ChatsPage } from './routes/ChatsPage';
import { ChatPage } from './routes/ChatPage';
import { SenderPage } from './routes/SenderPage';

const unauthorizedRouter = createHashRouter([
    {
        path: '/',
        element: <AuthPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/:chatId',
        element: <AuthPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/:chatId/:senderType/:senderId',
        element: <AuthPage />,
        errorElement: <ErrorPage />,
    },
]);

const authorizedRouter = createHashRouter([
    {
        path: '/',
        element: <ChatsPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/:chatId',
        element: <ChatPage />,
        errorElement: <ErrorPage />,
        loader: ({ params }) => {
            if (isNaN(+(params.chatId ?? '')))
                throw new Response('Not Found', { status: 404 });
            return null;
        },
    },
    {
        path: '/:chatId/:senderType/:senderId',
        element: <SenderPage />,
        errorElement: <ErrorPage />,
        loader: ({ params }) => {
            if (
                isNaN(+(params.chatId ?? '')) ||
                isNaN(+(params.senderId ?? '')) ||
                !['chat', 'user'].includes(params.senderType ?? '')
            )
                throw new Response('Not Found', { status: 404 });
            return null;
        },
    },
]);

export const App = () => {
    const { isAuthorized } = useSelector(selectAuth);
    return (
        <>
            <CssBaseline />
            <Container>
                <RouterProvider
                    router={
                        isAuthorized ? authorizedRouter : unauthorizedRouter
                    }
                />
            </Container>
        </>
    );
};
