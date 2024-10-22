import CircularProgress from '@mui/material/CircularProgress'
import { Typography, Box } from '@mui/material'

/**
 * Progress bar in circle shape on dashboard page
 * @param props
 * @returns 
 */
const CustomCircleProgress = (props) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box sx={{ top: 5, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" component="div" color="blue">
          {`${props.value}`}
        </Typography>
      </Box>
    </Box>
  )
}


export default CustomCircleProgress