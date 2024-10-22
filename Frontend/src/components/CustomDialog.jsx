import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Box, Typography, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'

function CustomDialog({ open, handleClose, exclusion_labels, onSubmit, reason }) {

    const [selectedCriteria, setSelectedCriteria] = useState([])
    const [otherReason, setOtherReason] = useState('')

    useEffect(() => {
        if (reason && reason.length > 0) {
            const matchedCriteria = []
            const unmatchedReasons = []
            reason.forEach(r => {
                if (isReasonInCriteria(r, exclusion_labels)) {
                    matchedCriteria.push(r)
                } else {
                    unmatchedReasons.push(r)
                }
            })

            setSelectedCriteria(matchedCriteria)
            setOtherReason(unmatchedReasons.join(', '))
        }
    }, [reason, exclusion_labels])

    const isReasonInCriteria = (reason, exclusion_labels) => {
        return exclusion_labels.some(item => item.labels === reason)
    }

    const handleOtherReasonChange = (event) => {
        setOtherReason(event.target.value)
    }

    const handleOptionClick = (option) => {
        if (selectedCriteria.includes(option.labels)) {
            setSelectedCriteria(prev => prev.filter(item => item !== option.labels))
        } else {
            setSelectedCriteria(prev => [...prev, option.labels])
        }
    }

    const handleSubmit = () => {
        if (selectedCriteria.length === 0 && otherReason === '') {
            toast.error("You must select a criteria or provide another reason!")
            return
        }
        let finalCriteria = [...selectedCriteria]
        if (otherReason !== '') {
            finalCriteria.push(otherReason)
        }
        const selected = {
            exclusion_reason: finalCriteria,
            manual_tag: 0
        }
        onSubmit(selected)
        handleCloseClear()
    }

    const handleCloseClear = () => {
        setSelectedCriteria([])
        setOtherReason('')
        handleClose()
    }

    return (
        <Dialog open={open} onClose={handleCloseClear} sx={{ '& .MuiDialog-paper': { width: '350px' } }}>
            <DialogTitle>
                Which criteria was not met?
                <IconButton
                    aria-label="close"
                    onClick={handleCloseClear}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {exclusion_labels.map(option => (
                    <Box
                        key={option.id}
                        gap={5}
                        sx={{
                            p: 2,
                            m: 1,
                            border: '1px solid',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            backgroundColor: selectedCriteria.includes(option.labels) ? 'rgb(59, 82, 187)' : 'white',
                            color: selectedCriteria.includes(option.labels) ? 'white' : 'black',
                            textAlign: 'center'
                        }}
                        onClick={() => handleOptionClick(option)}
                    >
                        <Typography>{option.labels}</Typography>
                    </Box>
                ))}
                <TextField
                    id='other'
                    name="other"
                    label="Type other reason"
                    variant='outlined'
                    maxRows={Infinity}
                    multiline
                    fullWidth
                    sx={{ marginTop: '10px' }}
                    value={otherReason}
                    onChange={handleOtherReasonChange}
                />
            </DialogContent>
            <DialogActions style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" onClick={handleSubmit} style={{ borderRadius: '15px' }} >Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CustomDialog