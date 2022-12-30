import { Container, CssBaseline } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link, useRouteError } from 'react-router-dom';

interface RouteError {
    data: string;
    status: number;
    statusText: string;
}

export const ErrorPage = () => {
    const error = useRouteError() as RouteError;
    return (
        <>
            <CssBaseline />
            <Container sx={{ textAlign: 'center', pt: 2 }}>
                <Typography mb={2} variant="h3">
                    Error {error.status}
                </Typography>
                <Typography variant="h4" mb={2}>
                    {error.statusText || error.data}
                </Typography>
                <Typography variant="h5" component={Link} to="/">
                    Return to main page
                </Typography>
            </Container>
        </>
    );
};
