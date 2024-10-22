import { Container, Typography } from '@mui/material'

/**
 * Component for mobile
 * @returns 
 */
const Mobile = () => {

    return (
        <Container sx={{ marginTop: '100px' }}>
            <Typography sx={{ mb: 3 }}>
                The current verison of NeutrinoReview does not support mobile access.
            </Typography>

            <Typography>
                Please connet using your desktop device.
            </Typography>
        </Container>
    )
}

export default Mobile