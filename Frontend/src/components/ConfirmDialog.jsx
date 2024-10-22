import { Button, DialogTitle, DialogContentText, DialogContent, DialogActions, Dialog } from '@mui/material'

/**
 * Confirmation Dialog in dashboard page
 * @param {boolean} open
 * @param {function} handleClose
 * @param {function} deleteAction
 * @returns 
 */
const ConfirmationDialog = ({ open, handleClose, deleteAction }) => {

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this review?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={deleteAction} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog