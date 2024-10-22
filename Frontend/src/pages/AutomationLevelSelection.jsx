import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  FormControl,
  FormHelperText,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Container,
  Box,
  Button
} from '@mui/material';
import { useData } from '../context/index.jsx'
import { setLLMAutomationLevel, stopResumeLLM } from '../actions/index.js'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import { page_states, levelOfAutomationThreshold } from '../utils/constants'

/**
 * Page to create new review
 * @param {function} handleNext - Function to proceed to the next step
 */
const AutomationLevelSelector = ({ handleNext }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { reviewID } = useData();

  const onSubmit = async (data) => {
    // Handle form submission
    // Call API which sets the automation_level feature in DB
    try {
      await setLLMAutomationLevel(reviewID, data.levelOfAutomation);
    } catch (error) {
      console.error('Error setting automation level:', error);
      return;
    }

    // Call API which starts the LLM process (maybe combine this with the star/stop api call)
    console.log("Line 38: ", reviewID, page_states.LLM_SCREENING_AUTOMATION_CONTINUED)
    try {
      const response = await stopResumeLLM(reviewID, page_states.LLM_SCREENING_AUTOMATION_CONTINUED);
      console.log(response)
      console.log(response.status)

      // Redirect to LLM process page.
      if (response.status == 204) {
        toast.success("Screening started sucessfully", {
            autoClose: 2000,
            onClose: () => {
                handleNext()
            }
        })
      } else {
        toast.error(response.statusText)
      }

  } catch (error) {
    console.error("Error starting the automated screening. ", error)
    return;
}

  }

  return (
    <Container sx={{ paddingBottom: '50px', marginTop: '150px' }}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <FormControl>
            <FormHelperText sx={{ fontWeight: 500, margin: '10px 0', fontSize: 20, color: '#11142d' }}>
              Level of Automation:
            </FormHelperText>

            <Typography sx={{ mb: 2 }} style={{ textAlign: 'justify' }}>Please select one of the following options:</Typography>
            <Typography sx={{ mb: 2 }} style={{ textAlign: 'justify' }}><span style={{ fontWeight: 'bold' }}>Automation Level 1 (Max. Sensitivity): </span>The algorithm is designed to only automatically include and exclude those citations where it is able to make
              a very clear decision. This results in a higher number of papers to be screened by you as the human expert.</Typography>
            <Typography sx={{ mb: 2 }} style={{ textAlign: 'justify' }}><span style={{ fontWeight: 'bold' }}>Automation Level 2 (Balanced): </span> The model automatically includes and excludes most papers and only leaves a small number for human screening.</Typography>
            <Typography sx={{ mb: 2 }} style={{ textAlign: 'justify' }}><span style={{ fontWeight: 'bold' }}>Automation Level 3 (Full-Automation):</span>No manual labelling is necessary. The model classifies the whole dataset into include and exclude
              according to the highest probability. This option should only be chosen when time is critical and missing few relevant papers can be accepted. </Typography>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <FormControl component="fieldset">
                <FormHelperText sx={{ fontWeight: 500, margin: '10px 0', fontSize: 20, color: '#11142d' }}>
                  Select Automation Level:
                </FormHelperText>
                <Controller
                  name="levelOfAutomation"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Please select an automation level' }}
                  render={({ field }) => (
                    // TODO Ponder: Disable selection if LLM is working?
                    <RadioGroup {...field}>
                      {/* <FormControlLabel value='1' control={<Radio />} label="Automation Level 1 (Max. Sensitivity)" disabled={Boolean(reviewID)} /> */}
                      <FormControlLabel value={levelOfAutomationThreshold.MAX_SENSITIVTY} control={<Radio />} label="Automation Level 1 (Max. Sensitivity)" />
                      <FormControlLabel value={levelOfAutomationThreshold.BALANCED}  control={<Radio />} label="Automation Level 2 (Balanced)"  />
                      <FormControlLabel value={levelOfAutomationThreshold.FULL_AUTOMATED_SCREENING}  control={<Radio />} label="Automation Level 3 (Full-automated screening)" />
                    </RadioGroup>
                  )}
                />
                {errors.levelOfAutomation && (
                  <Typography color="error" variant='body2'>
                    {errors.levelOfAutomation.message}
                  </Typography>
                )}
              </FormControl>
            </div>
          </FormControl>

          <div style={{ justifyContent: 'center', display: 'flex' }}>
            <Button type="submit" variant="contained" style={{ backgroundColor: 'rgb(59, 82, 187)', width: '450px' }}>
              Start automated screening
            </Button>
          </div>
        </form>
      </Box>
    </Container>
  );
};

export default AutomationLevelSelector;
