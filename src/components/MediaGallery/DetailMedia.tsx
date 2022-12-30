import { Backdrop, Container } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { MediaMessage, Sender } from '../../store/slices/chatSlice';
import { getFile, selectMedia } from '../../store/slices/mediaSlice';
import { loadSenderPhotos } from '../../store/slices/senderSlice';
import { MediaGalleryItem } from './MediaGalleryItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { BASE_PRIORITY } from '../../config';
import { Swiper as TSwiper } from 'swiper/types';
import {
    Close as CloseIcon,
    Person as PersonIcon,
    FileDownload as FileDownloadIcon,
} from '@mui/icons-material';

interface DetailMediaProps {
    activeIndex?: number;
    navigateToSender?: boolean;
    mediaMessages: MediaMessage[];
    onClose: () => void;
    setActiveIndex: (idx: number) => void;
}

export const DetailMedia = ({
    activeIndex,
    navigateToSender = false,
    mediaMessages,
    onClose,
    setActiveIndex,
}: DetailMediaProps) => {
    const params = useParams();
    const chatId = +(params.chatId ?? '');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { mediaStore } = useSelector(selectMedia);
    const swiperRef = useRef(null);

    let activeSender: Sender | undefined = undefined;
    let downloadLink: string | undefined = undefined;
    if (activeIndex !== undefined) {
        activeSender = mediaMessages[activeIndex].sender;
        const activeMediaId = mediaMessages[activeIndex].fileId.full;
        if (mediaStore[activeMediaId] && !mediaStore[activeMediaId].isLoading)
            downloadLink = mediaStore[activeMediaId].src;
    }

    useEffect(() => {
        if (activeIndex === undefined || !swiperRef.current) return;
        interface SwiperApi {
            swiper: TSwiper;
        }
        const swiperApi = (swiperRef.current as SwiperApi).swiper;
        swiperApi.slideTo(activeIndex, 0);
    }, [activeIndex]);

    const handleCurrentTargetClose = (
        e: React.MouseEvent<HTMLElement, MouseEvent>
    ) => {
        if (e.target === e.currentTarget) onClose();
    };

    const iconStyles: React.CSSProperties = {
        color: '#fff',
        cursor: 'pointer',
        fontSize: '2rem',
        position: 'relative',
        zIndex: 1,
        marginLeft: '10px',
    };

    return (
        <Backdrop
            open={activeIndex !== undefined}
            onClick={handleCurrentTargetClose}
            sx={{ zIndex: 1 }}
        >
            <Container onClick={handleCurrentTargetClose}>
                <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    onSlideChange={swiper => {
                        const activeMedia = mediaMessages[swiper.activeIndex];
                        setActiveIndex(swiper.activeIndex);
                        const media = mediaStore[activeMedia.fileId.min];
                        dispatch(
                            getFile({
                                ...media,
                                thumbData: media.src,
                                fileId: activeMedia.fileId.full,
                                priority: BASE_PRIORITY + 3,
                            })
                        );
                    }}
                    ref={swiperRef}
                >
                    {mediaMessages.map(({ fileId }, idx) => (
                        <SwiperSlide key={idx}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100vh',
                                    paddingTop: 'calc(40px + 1rem)',
                                    paddingBottom: '20px',
                                    boxSizing: 'border-box',
                                }}
                                onClick={handleCurrentTargetClose}
                            >
                                <MediaGalleryItem fileId={fileId} />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Container>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                }}
                onClick={handleCurrentTargetClose}
            >
                <Container
                    sx={{
                        textAlign: 'right',
                        mt: 1,
                    }}
                    onClick={handleCurrentTargetClose}
                >
                    <a href={downloadLink} download>
                        <FileDownloadIcon
                            sx={
                                downloadLink
                                    ? iconStyles
                                    : {
                                          ...iconStyles,

                                          color: '#666',
                                          opacity: '.6',
                                          pointerEvents: 'none',
                                      }
                            }
                        />
                    </a>
                    {navigateToSender && (
                        <Box
                            component={PersonIcon}
                            sx={iconStyles}
                            onClick={() => {
                                if (!activeSender) return;
                                dispatch(
                                    loadSenderPhotos({
                                        chatId,
                                        sender: activeSender,
                                    })
                                );
                                navigate(
                                    `./${activeSender.type}/${activeSender.id}`
                                );
                            }}
                        />
                    )}
                    <Box
                        component={CloseIcon}
                        sx={iconStyles}
                        onClick={onClose}
                    />
                </Container>
            </Box>
        </Backdrop>
    );
};
