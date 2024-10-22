import { Box, Button, DialogTitle, DialogContent, DialogActions, Dialog, Typography } from '@mui/material'
import { Link } from "react-router-dom"
import { PACKASGESCONTENT } from '../utils/constants'

/**
 * Dialog with all open source packages in footer component
 * @param {boolean} open
 * @param {function} handleClose
 * @returns 
 */
const FooterDialog = ({ open, handleClose }) => {
  const packagesContent = PACKASGESCONTENT

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle variant='h4'>Open Source Acknowledgements</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontWeight: 'bold', mb: 2 }}>
          NeutrinoReview is using Open Source code
        </Typography>

        {packagesContent.map((packageContent) => (
          <Box key={packageContent.id} sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 'bold' }} >{packageContent.title}</Typography>
            <Typography>{packageContent.content}</Typography>
            <Typography>Released under the <Link to={packageContent.license}>MIT License</Link></Typography>
          </Box>
        ))}

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FooterDialog