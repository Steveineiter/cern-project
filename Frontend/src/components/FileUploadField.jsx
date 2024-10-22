import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Container, Typography } from '@mui/material'
import Papa from 'papaparse'

/**
 * Field to submit the CSV file in first step
 * @param {function} onFileUpload
 * @param {object} citations
 * @param {object} error
 * @param {string} helperText
 * @param {object} storedCitation
 * @returns 
 */
const FileUploadField = ({ onFileUpload, citations, error, helperText, storedCitation }) => {
  const [bgColor, setBgColor] = useState('#fff')
  const [dataCSV, setDataCSV] = useState()
  const [csvError, setCsvError] = useState('')
  const [errorFrame, setErrorFrame] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    setCsvError('')
    setErrorFrame(false)

    onFileUpload(acceptedFiles[0])
    Papa.parse(acceptedFiles[0], {
      header: true,
      complete: (results) => {
        setDataCSV(results.meta.fields)
      }
    })

  }, [onFileUpload])

  useEffect(() => {
    if(error){
      setErrorFrame(true)
    }

    if (dataCSV) {
      if (!dataCSV.includes('Title') || !dataCSV.includes('Abstract')) {
        setDataCSV(null)
        onFileUpload(null)
        setBgColor('white')
        setErrorFrame(true)
        setCsvError('The uploaded file must contain both "Title" and "Abstract".')
      } else {
        setBgColor('#D8D8D8')
        setErrorFrame(false)
      }
    }
  }, [dataCSV, onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 })

  return (
    <div>
      <Container {...getRootProps({ className: 'dropzone' })}
        style={{
          border: `2px dashed ${errorFrame ? '#ff0000' : '#007bff'}`,
          padding: '50px',
          marginTop: '15px',
          textAlign: 'center',
          borderRadius: '50px',
          cursor: 'pointer',
          color: isDragActive ? '#3399ff' : '#000',
          backgroundColor: storedCitation ? '#D8D8D8' : isDragActive ? '#e6f7ff' : bgColor,
          height: '150px',
          transition: 'border .24s ease-in-out',
          alignItem: 'center',
          flex: '1',
          displax: 'flex',
        }} >
        <input {...getInputProps()} />

        <Typography variant='body'> {storedCitation ? `Submitted citation: ${storedCitation.name}` : citations ? `Uploaded file: ${citations.name}` : 'Click to browse or drag and drop your files'} </Typography>
      </Container>
      {error && errorFrame && <Typography color="error">{helperText}</Typography>}
      {csvError && <Typography color="error">{csvError}</Typography>}
    </div>
  )
}

export default FileUploadField