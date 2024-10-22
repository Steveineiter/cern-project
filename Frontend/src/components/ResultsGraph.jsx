import { PieChart } from '@mui/x-charts/PieChart'
import { Button, Grid, Paper, TableRow, TableHead, TableContainer, TableCell, Table, TableBody } from '@mui/material'
import { useData } from '../context/index.jsx'
import { page_states } from '../utils/constants'

/**
 * Pie chart graph on manual and llm screening page
 * @param {array} resultsByCategory
 * @param {number} setp
 * @returns 
 */
const ResultsGraph = ({ resultsByCategory, step }) => {
    const { activateStep, setActivateStep } = useData()

    const nextStep = (step) => {
        setActivateStep(step)
    }

    let colors = null
    if (step === 2) {
        colors = ['#02b2af', '#2e96ff', '#60009b']
    } else {
        colors = ['#02b2af', '#2e96ff']
    }

    const categoryColors = resultsByCategory.reduce((acc, item, index) => {
        acc[item.label] = colors[index % colors.length]
        return acc
    }, {})

    return (
        <Grid container spacing={3} style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
            <Grid item xs={7}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Category</TableCell>
                                <TableCell align="right">Number of papers</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resultsByCategory.map((row) => (
                                <TableRow
                                    key={row.label}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" style={{ color: categoryColors[row.label] }}>
                                        {row.label}
                                    </TableCell>
                                    <TableCell align="right">{row.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={5}>
                <PieChart
                    colors={colors}
                    series={[{
                        data: resultsByCategory,
                        cx: 100,
                        cy: 150,
                        innerRadius: 50,
                        outerRadius: 90,
                    }]}
                    height={300}
                    slotProps={{
                        legend: { hidden: true },
                    }}
                />
            </Grid>
            {/* TODO Remove -1 of step === page_states.LLM_SCREENING - 1 as soon as Ivans part is merged. And step +1 the +1*/}
            <Button type='submit' variant="contained" style={{ width: '450px' }} color={'primary'} onClick={() => nextStep(step + 2)}> {step === page_states.LLM_SCREENING - 1 ? 'CONTINUE TO MANUAL SCREENING' : 'Continue to detailed results'}</Button>
        </Grid>

    )
}

export default ResultsGraph