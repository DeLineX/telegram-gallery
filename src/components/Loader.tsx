import { Box, CircularProgress } from '@mui/material';

export const Loader = () => (
    <Box textAlign="center">
        <CircularProgress size={100} sx={{ mt: 3 }} />
    </Box>
);
