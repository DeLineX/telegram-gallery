import { Box, Button, ButtonGroup, Grid, Typography } from '@mui/material';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_PRIORITY } from '../../config';
import { MediaMessage, Sender } from '../../store/slices/chatSlice';
import { getFile, Media, selectMedia } from '../../store/slices/mediaSlice';
import { FileId } from '../../store/slices/senderSlice';
import { Loader } from '../Loader';
import { DetailMedia } from './DetailMedia';
import { MediaGalleryItemTiny } from './MediaGalleryItemTiny';

export interface MediaArrayItem extends Media {
    fileId: FileId;
    sender: Sender;
}

interface MediaGalleryProps {
    mediaMessages: MediaMessage[];
    navigateToSender?: boolean;
}

export const MediaGallery = ({
    mediaMessages,
    ...props
}: MediaGalleryProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { mediaStore } = useSelector(selectMedia);

    const [columnsCountIdx, setColumnCountIdx] = useState(2);
    const columnsCountAvailableState = [1, 2, 3, 4, 6, 12];
    const columnsCount = columnsCountAvailableState[columnsCountIdx];
    const [detailMediaIndex, setDetailMediaIndex] = useState<number>();

    const media: MediaArrayItem[] = mediaMessages.map(({ fileId, sender }) => {
        const item: Media = mediaStore[fileId.min];
        return {
            ...item,
            fileId,
            sender,
        };
    });
    const totalMediaCount = media.length;
    const loadedMedia = media.reduce(
        (accumulator, item) => accumulator + +!item.isLoading,
        0
    );

    const handleColumnsCountChange = (action: 'inc' | 'dec') => {
        const newIdx =
            action === 'inc'
                ? Math.min(
                      columnsCountIdx + 1,
                      columnsCountAvailableState.length - 1
                  )
                : Math.max(columnsCountIdx - 1, 0);
        setColumnCountIdx(newIdx);
    };

    return (
        <>
            {media.length === 0 && <Loader />}
            {totalMediaCount !== 0 && (
                <>
                    <Box
                        sx={{
                            position: 'sticky',
                            top: '0px',
                            zIndex: 1,
                            backgroundColor: '#fff',
                            py: 2,
                        }}
                    >
                        <Typography variant="h3" mb={2} textAlign="center">
                            Telegram Gallery
                        </Typography>
                        <Typography variant="h4" mb={2}>
                            Fully loaded {loadedMedia} of {totalMediaCount}{' '}
                            media
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </Button>
                            <ButtonGroup>
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        handleColumnsCountChange('dec')
                                    }
                                    disabled={columnsCountIdx === 0}
                                >
                                    -
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        handleColumnsCountChange('inc')
                                    }
                                    disabled={
                                        columnsCountIdx ===
                                        columnsCountAvailableState.length - 1
                                    }
                                >
                                    +
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </Box>
                </>
            )}
            <Grid container spacing={2} sx={{ my: 2 }}>
                {media.map((media, idx) => (
                    <Grid item key={idx} xs={columnsCount}>
                        <MediaGalleryItemTiny
                            media={media}
                            onClick={fileId => {
                                setDetailMediaIndex(idx);
                                dispatch(
                                    getFile({
                                        ...media,
                                        thumbData: media.src,
                                        fileId: fileId.full,
                                        priority: BASE_PRIORITY + 3,
                                    })
                                );
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
            <DetailMedia
                mediaMessages={mediaMessages}
                onClose={() => setDetailMediaIndex(undefined)}
                activeIndex={detailMediaIndex}
                setActiveIndex={idx => setDetailMediaIndex(idx)}
                {...props}
            />
        </>
    );
};
