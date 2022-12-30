import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import { MESSAGE_UNKNOWN_URL, MESSAGE_UNSUPPORTED_URL } from '../../config';
import { Sender } from '../../store/slices/chatSlice';
import { MediaArrayItem } from './MediaGallery';
import { PlayArrowOutlined as PlayArrowOutlinedIcon } from '@mui/icons-material';
import { FileId } from '../../store/slices/senderSlice';

interface MediaGalleryItemTinyProps {
    media: MediaArrayItem;
    onClick?: (fileId: FileId, sender: Sender) => void;
}

export const MediaGalleryItemTiny = ({
    media,
    onClick,
}: MediaGalleryItemTinyProps) => {
    let newSrc = media.isLoading
            ? 'data:image/jpeg;base64,' + media.src
            : media.src,
        isVideo = false,
        isVideoNote = false;
    switch (media.type) {
        case 'unknown':
            newSrc = MESSAGE_UNKNOWN_URL;
            break;
        case 'unsupported':
            newSrc = MESSAGE_UNSUPPORTED_URL;
            break;
        case 'video':
            isVideo = true;
            break;
        case 'videoNote':
            isVideoNote = true;
            break;
    }
    const style: React.CSSProperties = {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
        position: 'absolute',
        left: 0,
        top: 0,
        transition: '.3s',
    };
    const styleCentered: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#fff',
    };
    return (
        <Box
            sx={{
                pb: '100%',
                height: 0,
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: isVideoNote ? '50%' : undefined,
                '&:hover > img': {
                    transform: 'scale(1.2)',
                },
            }}
            onClick={
                onClick
                    ? () => {
                          onClick(media.fileId, media.sender);
                      }
                    : undefined
            }
        >
            <img
                loading="lazy"
                src={newSrc}
                style={style}
                className={isVideoNote ? undefined : 'image'}
            />
            {media.isLoading && (
                <Box sx={styleCentered}>
                    <CircularProgress sx={{ color: '#fff' }} />
                </Box>
            )}
            {!media.isLoading && (isVideo || isVideoNote) && (
                <PlayArrowOutlinedIcon fontSize="large" sx={styleCentered} />
            )}
        </Box>
    );
};
