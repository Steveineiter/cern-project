import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import NewReviewCard from './NewReviewCard'
import LLMscreening from './LLMScreening'
import ManualScreening from './ManualScreening'
import { useData } from '../context/index.jsx'
import Results from './Results'
import { useState } from 'react'
import { STEPS, page_states } from '../utils/constants'
import AutomationLevelSelector from './AutomationLevelSelection.jsx'

const steps = STEPS

/**
 * Stepepr component which is shared between 4 pages
 * @returns 
 */
export default function HorizontalNonLinearStepper() {
  const { activateStep, setActivateStep } = useData()
  const [completed, setCompleted] = useState({})
  const [visitedSteps, setVisitedSteps] = useState([])

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const handleNext = (additionalStep=1) => {
    setActivateStep(activateStep + additionalStep)
  }

  const handleStep = (step) => () => { 
    setActivateStep(step)
    setVisitedSteps((prev) => [...new Set([...prev, step, activateStep])])
  }

  const isStepDisabled = (stepIndex) => {
    return stepIndex > activateStep && !visitedSteps.includes(stepIndex);
  }

  const getStepContetn = (index) => {
    console.log("Horizontal Guid state: ", index)
    switch (index) {
      case page_states.STOPPED:
        return <NewReviewCard handleNext={handleNext} /> // TODO go to search as soon as created
      case page_states.SEARCH:
        return <AutomationLevelSelector handleNext={handleNext} />  // TODO change to search page as soon as created
      case page_states.LLM_SCREENING_AUTOMATION_SELECTION:
        return <AutomationLevelSelector handleNext={handleNext} />
      case page_states.LLM_SCREENING:
      case page_states.LLM_SCREENING_AUTOMATION_PAUSED:
      case page_states.LLM_SCREENING_AUTOMATION_CONTINUED:
        return <LLMscreening />
      case page_states.MANUAL_SCREENING:
        return <ManualScreening />
      case page_states.DONE:
        return <Results />
    }
  }

  return (
    <Box sx={{ width: '100%', marginTop: '10%', height: '20%' }}>
      <Stepper nonLinear activeStep={activateStep} >
        {steps.map((label, index) => (
          <Step key={label} completed={index < activateStep}>
            <StepButton color="inherit" onClick={handleStep(index)} disabled={isStepDisabled(index)} >
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <>
        {getStepContetn(activateStep)}
      </>
    </Box>
  )
}