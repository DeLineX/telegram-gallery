import { CircularProgress } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { MESSAGE_UNKNOWN_URL, MESSAGE_UNSUPPORTED_URL } from '../../config';
import { FileId } from '../../store/slices/chatSlice';
import { selectMedia } from '../../store/slices/mediaSlice';

interface MediaGalleryItemProps {
    fileId: FileId;
}

export const MediaGalleryItem = ({ fileId }: MediaGalleryItemProps) => {
    const { mediaStore } = useSelector(selectMedia);
    const media = mediaStore[fileId.full]
        ? mediaStore[fileId.full]
        : { src: '', type: '', isLoading: true };
    let newSrc = media.src,
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
        maxHeight: '100%',
        maxWidth: '100%',
    };
    if (isVideo || isVideoNote) {
        const poster = mediaStore[fileId.min].src;
        return <video style={style} controls poster={poster} src={newSrc} />;
    }
    if (media.isLoading) return <CircularProgress sx={{ color: '#fff' }} />;
    else return <img loading="lazy" src={newSrc} style={style} />;
};
