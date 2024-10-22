import { Container, Typography, Button } from "@mui/material"
import { Link } from "react-router-dom"
import { getCSV } from '../actions/index.js'
import { useData } from '../context/index.jsx'

/**
 * Component to download the CSV file with all classified papers in result setp
 * @returns 
 */
const Download = () => {
  const { reviewID, userId } = useData()

  const downloadCSV = () => {
    getCSV(reviewID)
  }
  return (
    <Container sx={{ marginTop: '40px', paddingBottom: '50px' }}>
      <Typography variant='h5' gutterBottom sx={{ fontWeight: 500, textAlign: 'justify' }}>Download CSV:</Typography>
      <Typography style={{ textAlign: 'justify' }}>Download a list of all citations with comprehensive annotations regarding the screening results. For a thorough explanation on how to interpret these results, please refer to <Link to='/user-guide'>the User Guide</Link>.</Typography>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
        <Button onClick={() => downloadCSV()} variant="contained" style={{ 'backgroundColor': 'rgb(59, 82, 187)' }}>Download as .csv</Button>
      </div>
    </Container>
  )
}


export default Download