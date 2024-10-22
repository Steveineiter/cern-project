import { Button, Grid, Typography, Container, Box } from '@mui/material'
import { getEligibilityCriteria, getNextPaper, setDecision, getNextArticle, getPreviousArticle } from '../actions/index.js'
import { useState, useEffect } from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CustomDialog from '../components/CustomDialog'
import Progressbar from '../components/Progressbar/Progressbar'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'

/**
 * Component in which the paper is classified whether it is included or excluded
 * @param {function} onStatusChange
 * @param {number} reviewID
 * @param {number} userId
 * @returns 
 */
const SetReview = ({ onStatusChange, reviewID, userId }) => {
    const [inclusionCriteria, setInclusionCriteria] = useState([])
    const [exclusionCriteria, setExclusionCriteria] = useState([])
    const [exclusionLabels, setExclusionLabels] = useState([])

    const [article, setArticle] = useState([])
    const [modelOpen, setModelOpen] = useState(false)

    const [buttonTypeInclude, setButtonTypeInclude] = useState(true)
    const [buttonTypeExclude, setButtonTypeExclude] = useState(true)

    const [totalPapers, setTotalPapers] = useState(0)

    const [doneArticles, setDoneArticles] = useState(1)

    const [paperID, setPaperID] = useState(null)

    const [reason, setReason] = useState(null)

    let progressString = `${doneArticles}/${totalPapers}`

    useEffect(() => {
        const fetchdata = async () => {

            const res = await getEligibilityCriteria(reviewID)

            setInclusionCriteria(
                res.inclusionCriteria.map((criterion, index) => ({
                    id: index,
                    criteria: criterion,
                }))
            );
            setExclusionCriteria(
                res.exclusionCriteria.map((criterion, index) => ({
                    id: index + res.inclusionCriteria.length,
                    criteria: criterion,
                }))
            );
            console.log("Labels in setReview:", res.labels)
            setExclusionLabels(
                res.labels.map((labels, index) => ({
                    id: index + res.inclusionCriteria.length + res.exclusionCriteria.length, 
                    labels: labels,
                }))
            );
          
            setTotalPapers(res.screenedDocuments)

            const resArticle = await getNextPaper(reviewID)
            if (resArticle.switch_to_results) {
                onStatusChange(true)
            } else {
                setArticle(resArticle.paper)
                setPaperID(resArticle.paper.paper_id)
            }
        }
        fetchdata()
        console.log("TODO after fetching:  ", exclusionLabels)

    }, [exclusionLabels])

    const handleClickOpen = () => {
        setModelOpen(true)
    }

    const handleClose = async () => {
        setModelOpen(false)
    }

    const nextPaper = async () => {
        setButtonTypeInclude(true)
        setButtonTypeExclude(true)

        setReason(null)

        try {
            let resArticle = await getNextArticle(reviewID, paperID)

            if (resArticle.code === 204) {
                toast.success(resArticle.message, {
                    autoClose: 2000,
                    onClose: async () => {
                        if (resArticle.code === 204) {
                            onStatusChange(true)
                        }
                    }
                })
            } else {
                setArticle(resArticle)
                setPaperID(resArticle.paper.paper_id)

                if (resArticle.manual_tag === 1) {
                    setButtonTypeInclude(false)
                } else if(resArticle.manual_tag === 0) {
                    setButtonTypeExclude(false)
                    setReason(resArticle.exclusion_reason)
                }
            }
        } catch (error) {
            console.error("error in sending, ", error)
        }
    }

    const previousPaper = async () => {
        setButtonTypeInclude(true)
        setButtonTypeExclude(true)

        setReason(null)

        try {
            let resArticle = await getPreviousArticle(reviewID, paperID)

            if (resArticle.code === 204) {
                toast.success(resArticle.message)
            } else {
                setArticle(resArticle)
                setPaperID(resArticle.paper.paper_id)

                if (resArticle.manual_tag === 1) {
                    setButtonTypeInclude(false)
                } else if(resArticle.manual_tag === 0) {
                    setButtonTypeExclude(false)
                    setReason(resArticle.exclusion_reason)
                }
            }
        } catch (error) {
            console.error("error in sending, ", error)
        }
    }

    const handleOptionSubmit = async (data) => {
        if (!buttonTypeInclude) {
            setButtonTypeInclude(true)
        }
        setButtonTypeExclude(false)
        setReason(null)

        try {
            console.log(data)
            if (data.reason === "") {
                data.reason = null
            }

            const res = await setDecision(reviewID, paperID, data)
            if (res.status === 204) {
              
                toast.success(res.statusText, {
                    autoClose: 2000,
                    onClose: async () => {
                        const resArticle = await getNextPaper(reviewID)
                        if (resArticle.switch_to_results) {
                            onStatusChange(true)
                        } else {
                            setArticle(resArticle.paper)
                            setPaperID(resArticle.paper.paper_id)
                            setDoneArticles(prevCount => prevCount + 1)

                            setButtonTypeInclude(true)
                            setButtonTypeExclude(true)
                        }
                    }
                })
            } else {
                toast.error(res.statusText)
            }

        } catch (error) {
            console.error("error in sending, ", error)
        }
    }

    const includeConfirm = async () => {
        if (!buttonTypeExclude) {
            setButtonTypeExclude(true)
        }
        setButtonTypeInclude(false)

        const data = {
            exclusion_reason: '',
            manual_tag: 1
        }

        try {
            console.log(data)
            if (data.exclusion_reason === '') {
                data.exclusion_reason = null
            }
            const res = await setDecision(reviewID, paperID, data)

            if (res.status === 204) {
                toast.success(res.statusText, {
                    autoClose: 3000,
                    onClose: async () => {
                        const resArticle = await getNextPaper(reviewID)
                        if (resArticle.switch_to_results) {
                            onStatusChange(true)
                        } else {
                            setArticle(resArticle.paper)
                            setPaperID(resArticle.paper.paper_id)
                            setDoneArticles(prevCount => prevCount + 1)

                            setButtonTypeInclude(true)
                            setButtonTypeExclude(true)
                        }
                    }
                })
            } else {
                toast.error(res.statusText)
            }

        } catch (error) {
            console.error("error in sending, ", error)
        }
    }

    return (
        <Container sx={{ marginTop: '40px' }}>

            <Grid container spacing={2}>
                <Grid item xs={3}>

                    <Button variant="text" style={{ textAlign: 'left', 'fontSize': '18px', float: 'left' }} startIcon={<ArrowBackIosIcon />} onClick={previousPaper}>
                        Back
                    </Button>
                    <Button variant="text" style={{ textAlign: 'left', 'fontSize': '18px', float: 'right' }} endIcon={<ArrowForwardIosIcon />} onClick={nextPaper}>
                        Next
                    </Button>

                    <Progressbar progress={progressString} reminingTime={null} setScreenedDocuments={null} manualvsLLM={'manual'} />

                    <Box style={{ textAlign: 'left', 'fontSize': '20px', marginTop: '20px' }}>
                        <Typography color="GrayText" fontSize={13}>INCLUSION CRITERIA:</Typography>
                        {inclusionCriteria.map((item, index) => (
                            <Typography variant='body2' paragraph key={item.id}>{item.criteria}</Typography>
                        ))}
                    </Box>

                    <Box style={{ textAlign: 'left', 'fontSize': '20px', marginTop: '25px' }}>
                        <Typography color="GrayText" fontSize={13}>EXCLUSTION CRITERIA:</Typography>
                        {exclusionCriteria.map((item, index) => (
                            <Typography variant='body2' paragraph key={item.id}>{item.criteria}</Typography>
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={9} style={{ textAlign: 'left' }}>
                    <Typography variant='body2' sx={{ mb: 2 }} style={{ fontWeight: 'bold', fontSize: 18 }}>
                        {article.title}
                    </Typography>

                    <Typography variant='body2'>
                        {article.authors}
                    </Typography>

                    <Typography variant='body2'>
                        {article.publication}
                    </Typography>

                    <Typography variant='body2' sx={{ mb: 2 }}>
                        DOI: <a href={article.doi} target="_blank">{article.doi}</a>
                    </Typography>

                    <Typography variant='body2' sx={{ mb: 2 }} style={{ textAlign: 'justify' }}>
                        {article.abstract}
                    </Typography>

                    <Typography variant='body2' sx={{ mb: 2 }}>
                        NeutrinoReviews suggestion: <span style={{ color: 'red' }}>{article.suggestion}</span>
                    </Typography>

                    {reason && reason.length > 0 && (
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            User decision: <span style={{ color: 'blue' }}>{reason.join(', ')}</span>
                        </Typography>
                    )}

                    <Button variant={buttonTypeInclude ? 'text' : 'contained'} onClick={includeConfirm}>Include</Button>
                    <Button variant={buttonTypeExclude ? 'text' : 'contained'} onClick={handleClickOpen}>Exclude</Button>
                    <CustomDialog open={modelOpen} handleClose={handleClose} exclusion_labels={exclusionLabels} reason={reason} onSubmit={handleOptionSubmit} />
                </Grid>
            </Grid>
        </Container>
    )
}

export default SetReview