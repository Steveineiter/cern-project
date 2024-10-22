import { Button, Typography } from '@mui/material'
import { useState } from 'react'
import FooterDialog from './FooterDialog';

/**
 * Footer
 * @returns 
 */
const Footer = ({ }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <footer style={{ width: '100%', position: 'fixed', bottom: '0', left: '0', background: 'white' }}>
            <Typography align="center">
                Do you have a feedback? Send an email to elias.sandner@cern.ch
            </Typography>

            <Button variant="text" onClick={handleOpen}>
                Open Source Acknowledgements
            </Button>
            <FooterDialog open={open} handleClose={handleClose} />
        </footer>
    )
}

export default Footer