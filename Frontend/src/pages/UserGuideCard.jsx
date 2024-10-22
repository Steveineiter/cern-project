import { Button, Grid, Typography, Container, Box, ListItemText, ListItemButton, List, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CHAPTERS } from '../utils/constants'

/**
 * User guide page
 * @returns 
 */
const UserGuidCard = () => {
    const [expandChapter, setExpandChapter] = useState(false)

    const navigate = useNavigate()

    const goToNewPage = (path) => {
        navigate(path)
    }

    const handleClick = (id) => {
        setExpandChapter(id === expandChapter ? false : id)
    }

    const chapters = CHAPTERS

    return (
        <Container className='container-header'>

            <Button onClick={() => goToNewPage("/dashboard")} variant="contained" style={{ marginLeft: '20px', 'backgroundColor': 'rgb(59, 82, 187)', float: 'right', position: 'relative' }}>Dashboard</Button>

            <Grid container spacing={2} >
                <Grid item md={3} xs={12} sx={{ marginTop: '-25px' }}>
                    <Box sx={{ position: 'fixed', width: { xs: '100%', md: '250px' } }}>
                        <Typography sx={{ textAlign: 'left', 'fontSize': '20px' }}>
                            Chapters:
                        </Typography>
                        <Paper sx={{ textAlign: 'left' }}>
                            <List component="nav">
                                {chapters.map((chapter) => (
                                    <ListItemButton
                                        key={chapter.id}
                                        onClick={() => handleClick(chapter.id)}>
                                        <ListItemText primary={chapter.title} />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Paper >
                    </Box>
                </Grid>

                <Grid item md={9} xs={12}>
                    <Box>
                        {chapters.map((chapter) => (
                            <Accordion
                                key={chapter.id}
                                expanded={expandChapter === chapter.id}
                                onChange={() => handleClick(chapter.id)}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={chapter.id}
                                    id={`panel${chapter.id}-header`}
                                >
                                    <Typography style={{ textAlign: 'left', flexGrow: 1 }}>
                                        {chapter.title}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2" paragraph style={{ textAlign: 'justify' }}>
                                        {chapter.content}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default UserGuidCard