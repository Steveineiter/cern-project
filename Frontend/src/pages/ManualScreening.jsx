import { Typography, Container, Box } from '@mui/material'
import SetReview from '../components/SetReview'
import { useState, useEffect } from 'react'
import ResultsGraph from '../components/ResultsGraph'
import { getResultsManual } from '../actions/index.js'
import { useData } from '../context/index.jsx'

/**
 * Manual screening page
 * @returns 
 */
const ManualScreening = () => {

    const [finishStatus, setFinishStatus] = useState(false)
    const [resultsByCategoryManual, setResultsByCategoryManual] = useState([])
    const { reviewID, userId } = useData()

    const changeStatus = (newStatus) => {
        setFinishStatus(newStatus)
    }

    useEffect(() => {
        const fetchdata = async () => {
            if (finishStatus) {
                const res = await getResultsManual(reviewID)
                setResultsByCategoryManual(res.results)
            }
        }
        fetchdata()

    }, [finishStatus])


    return (
        <Container sx={{ marginTop: '40px' }}>
            <Typography sx={{ mb: 1 }}>Manual screening for the review:</Typography>
            <Typography variant='h5' sx={{ mb: 5 }} style={{ fontSize: 30 }}>Sensitivity evaluation of GPT based screening solutions</Typography>

            {!finishStatus ? <SetReview onStatusChange={changeStatus} reviewID={reviewID} userId={userId} /> : <ResultsGraph resultsByCategory={resultsByCategoryManual} step={3} />}
        </Container>
    )
}

export default ManualScreening