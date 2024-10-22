import { useEffect, useState, useRef } from 'react'
import { Box, Button, Card, CardContent, TextField, Typography, IconButton } from '@mui/material'
import AddIcon from "@mui/icons-material/Add"
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'

/**
 * Dialog to edit the title of review
 * @param {object} control
 * @param {function} onChange
 * @param {string} error
 * @param {string} helperText
 * @param {number} reviewID
 * @returns 
 */
const EligibilityCriteriaTable = ({ control, onChange, error, helperText, data, reviewID }) => {
  const [fields, setFields] = useState(data || [{ label: '', included: '', excluded: '' }])
  const [disabledRows, setDisabledRows] = useState([false])
  const [editRow, setEditRow] = useState(null)
  const tableRef = useRef(null)

  const reviewIdExists = reviewID !== undefined && reviewID !== null
  const isFieldDisabled = (index) => !!(reviewIdExists || disabledRows[index])

  const handleChange = (index, field, value) => {
    const newFields = [...fields]
    newFields[index][field] = value
    setFields(newFields)
  }

  const handleAddFields = () => {
    const hasEmptyFields = fields.some(field =>
      field.label === '' ||
      (field.included === '' && field.excluded === '')
    )

    if (hasEmptyFields) {
      toast.error('Please fill in fields before adding a new one!')
    } else {
      setFields([...fields, { label: '', included: '', excluded: '' }])
      setDisabledRows(disabledRows.map(() => true).concat(false))

      toast.success('Successfully saved eligibility criteria!', {autoClose: 2000})
    }
  }

  useEffect(() => {

    const handleFocusChange = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        const disabledFields = fields.filter((_, index) => disabledRows[index])
        onChange(disabledFields)
      }
    }
    document.addEventListener('focusin', handleFocusChange)

    return () => {
      document.removeEventListener('focusin', handleFocusChange)
    }
  }, [fields, disabledRows, onChange])

  const handleDelete = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index)
    setFields(updatedFields)
    const updatedDisabledRows = disabledRows.filter((_, i) => i !== index)
    setDisabledRows(updatedDisabledRows)

    toast.success('Successfully deleted eligibility criteria!', {autoClose: 2000})
  }

  const handleEdit = (index) => {
    const newDisabledRows = [...disabledRows]
    newDisabledRows[index] = !newDisabledRows[index]
    setDisabledRows(newDisabledRows)

    setEditRow(newDisabledRows[index] ? null : index)

    if (editRow !== null) {
      toast.success('Successfully updated eligibility criteria!', {autoClose: 2000})
    }
  }

  return (
    <>
      <Box sx={{ padding: 2 }} ref={tableRef}>
        {fields.map((field, index) => (
          <Box key={index} sx={{ display: 'flex', mb: 2 }}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography sx={{ color: 'black', textAlign: 'left', marginBottom: 1 }}></Typography>
                <TextField
                  label="Label"
                  value={field.label}
                  onChange={(e) => handleChange(index, 'label', e.target.value)}
                  fullWidth
                  maxRows={Infinity}
                  multiline
                  style={{ marginTop: '25px' }}
                  disabled={isFieldDisabled(index)}
                />
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography sx={{ color: 'green', textAlign: 'left', marginBottom: 1 }}>Included papers that...</Typography>
                <TextField
                  value={field.included}
                  onChange={(e) => handleChange(index, 'included', e.target.value)}
                  label="Specify inclusion criteria..."
                  maxRows={Infinity}
                  multiline
                  fullWidth
                  disabled={isFieldDisabled(index)}
                />
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography sx={{ color: 'red', textAlign: 'left', marginBottom: 1 }}>Excluded papers that...</Typography>
                <TextField
                  value={field.excluded}
                  onChange={(e) => handleChange(index, 'excluded', e.target.value)}
                  label="Specify exclusion criteria..."
                  fullWidth
                  maxRows={Infinity}
                  multiline
                  disabled={isFieldDisabled(index)}
                />
              </CardContent>
            </Card>
            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                <IconButton color='error' onClick={() => handleDelete(index)} sx={{ marginTop: '20px' }}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>

            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                <IconButton color='primary' onClick={() => handleEdit(index)} sx={{ marginTop: '20px' }}>
                  {editRow === index ? <CheckIcon /> : <EditIcon />}
                </IconButton>
              </CardContent>
            </Card>
          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button variant="contained" color="primary" onClick={handleAddFields} style={{ borderRadius: '15px' }} startIcon={<AddIcon />} size='small' disabled={reviewIdExists}>
            Add
          </Button>
        </Box>
      </Box>
      {error && <Typography color="error" >{helperText}</Typography>}
    </>
  )
}

export default EligibilityCriteriaTable