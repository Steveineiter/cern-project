import Progressbar from '../components/Progressbar/Progressbar'
import { useState, useEffect } from 'react'
import { Container, Button, Typography, Box } from '@mui/material'
import ResultsGraph from '../components/ResultsGraph'
import { getResultsLLM, stopResumeLLM } from '../actions/index.js'
import { useData } from '../context/index.jsx'
import { page_states } from '../utils/constants'

/**
 * LLM screening page 
 * @returns 
 */
const LLMScreening = () => {
    const { reviewID, userId } = useData()

    const [progress, setProgress] = useState(0)
    const [reminingTime, setReminingTime] = useState('00:00:00')
    const [isStopped, setIsStopped] = useState(false)
    const [screenedDocuments, setScreenedDocuments] = useState()
    const [showgraph, setShowgraph] = useState(false)
    const [resultsByCategory, setResultsByCategory] = useState()

    const handleStopClick = async () => {
        setIsStopped(!isStopped)
        let typeAction = ''

        if (isStopped) {
            typeAction = page_states.LLM_SCREENING_AUTOMATION_CONTINUED
        } else {
            typeAction = page_states.LLM_SCREENING_AUTOMATION_PAUSED
        }

        try {
            await stopResumeLLM(reviewID, typeAction)

        } catch (error) {
            console.error("error in sending, ", error)
        }
    }

    useEffect(() => {
        if (!isStopped) {
            const interval = setInterval(async () => {
                const res = await getResultsLLM(reviewID)
                console.log(res)
                const { progress, reminingTime, screenedDocuments, results, state } = res

                setProgress(progress)
                setReminingTime(reminingTime)
                setScreenedDocuments(screenedDocuments)

                if (state == 'stopped') {
                    setIsStopped(!isStopped)
                    await stopResumeLLM(userId, reviewID, 'stopped')
                }

                if (progress === 100) {
                    clearInterval(interval)
                    setShowgraph(true)
                    setResultsByCategory(results)
                }

            }, 3000)
            return () => clearInterval(interval)
        }
    }, [isStopped])


    return (
        <Container sx={{ marginTop: '40px' }}>
            <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                <Typography sx={{ mb: 2 }} > NeutrinoReview is screening publications of your review: </Typography>
                <Typography variant='h5' sx={{ mb: 2 }}> Sensitivity evaluation of GPT based screening solutions</Typography>

                <Progressbar progress={progress} reminingTime={reminingTime} screenedDocuments={screenedDocuments} manualvsLLM={'llm'} />
            </Box>

            {!showgraph && (<Button type='submit' variant="contained" style={{ width: '450px' }} color={isStopped ? 'primary' : 'secondary'} onClick={handleStopClick}> {isStopped ? 'Resume' : 'Stop'}</Button>)}

            <Box>
                {showgraph && (
                    <ResultsGraph resultsByCategory={resultsByCategory} step={2} />
                )}
            </Box>
        </Container>
    )
}

export default LLMScreening