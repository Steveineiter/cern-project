import { Button, DialogTitle, DialogContentText, DialogContent, DialogActions, Dialog, TextField } from '@mui/material'
import { useState, useEffect } from 'react'

/**
 * Dialog to edit the title of review
 * @param {boolean} open
 * @param {function} handleClose
 * @param {function} onSubmit
 * @param {string} title
 * @returns 
 */
const EditDialog = ({ open, handleClose, onSubmit, title }) => {

  const [titleEdit, setTitleEdit] = useState('')

  useEffect(() => {
    setTitleEdit(title || '')
  }, [title])

  const handleSubmit = () => {
    onSubmit(titleEdit)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { width: '500px' } }}>
      <DialogTitle>Title</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Edit the title below.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="titleEdit"
          type="text"
          fullWidth
          maxRows={Infinity}
          multiline
          variant="standard"
          value={titleEdit}
          onChange={(e) => setTitleEdit(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditDialog
