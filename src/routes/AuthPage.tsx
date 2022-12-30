import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { QRCodeSVG } from 'qrcode.react';
import { selectAuth } from '../store/slices/authSlice';
import { useSelector } from 'react-redux';
import { Loader } from '../components/Loader';

export const AuthPage = () => {
    const { qrLoginLink } = useSelector(selectAuth);
    return (
        <Box textAlign="center">
            {qrLoginLink && (
                <>
                    <Typography variant="h4" mb={2}>
                        Please sign in
                    </Typography>
                    <QRCodeSVG
                        value={qrLoginLink}
                        fgColor="#0088cc"
                        size={300}
                        imageSettings={{
                            src: 'https://dema-sport.ru/uploadedFiles/images/telega.png',
                            height: 50,
                            width: 50,
                            excavate: true,
                        }}
                    />
                </>
            )}
            {!qrLoginLink && <Loader />}
        </Box>
    );
};
