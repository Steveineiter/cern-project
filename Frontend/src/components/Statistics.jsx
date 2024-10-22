import { Grid, Typography, Container, ListItem, List, Paper } from '@mui/material'
import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart'
import { KEYWORDS } from '../utils/constants'

/**
 * Pie chart graph and list with all result numbers per category
 * @param {array} statistics
 * @returns 
 */
const Statistics = ({ statistics }) => {
    const data = statistics.slice(0, 9)

    const containsKeywordsExcludedIncluded = (label) => {
        const keywords = KEYWORDS
        return keywords.some(keyword => label.toLowerCase().includes(keyword.toLowerCase()))
    }

    const containsKeywordScreened = (label) => {
        const keywords = ['screened']
        return keywords.some(keyword => label.toLowerCase().includes(keyword.toLowerCase()))
    }

    const includedExcludedItems = data.filter(item => containsKeywordsExcludedIncluded(item.label))
    const screenedItems = data.filter(item => containsKeywordScreened(item.label))

    const calculateWorkload = () => {
        return Math.floor((data[1].value / data[0].value) * 100) + '%'
    }

    return (
        <Container>
            <Grid container style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                <Grid item xs={4}>
                    <Paper style={{ textAlign: 'left', width: '250px' }}>
                        <List component="nav">
                            {data.map((item) => (
                                <ListItem
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '10px 18px'
                                    }} >
                                    <Typography variant="body1" style={{ flex: 1, textAlign: 'left' }}> {item.label} </Typography>
                                    <Typography variant="body1" style={{ textAlign: 'right' }}> {item.value} </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </Paper >
                </Grid>
                <Grid item xs={4}>
                    <PieChart
                        series={[{
                            data: screenedItems,
                            cx: 100,
                            cy: 150,
                            innerRadius: 50,
                            outerRadius: 90,
                        }]}
                        height={450}
                        slotProps={{
                            legend: {
                                hidden: false,
                                position: { vertical: 'bottom', horizontal: 'middle' },
                                direction: 'column',
                                padding: 120
                            },
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <PieChart
                        series={[{
                            data: includedExcludedItems,
                            cx: 100,
                            cy: 150,
                            innerRadius: 50,
                            outerRadius: 90,
                        }]}
                        height={450}
                        slotProps={{
                            legend: {
                                hidden: false,
                                position: { vertical: 'bottom', horizontal: 'middle' },
                                direction: 'column',
                                padding: 80
                            },
                        }}
                    />
                </Grid>
                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Workload reduction through automation: {calculateWorkload()}</Typography>
            </Grid>
        </Container>
    )
}


export default Statistics