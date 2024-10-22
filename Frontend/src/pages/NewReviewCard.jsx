import { Container, TextField, FormControl, Button, Box, FormHelperText } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import Typography from '@mui/material/Typography';
import EligibilityCriteriaTable from '../components/EligibilityCard';
import { yupResolver } from '@hookform/resolvers/yup';
import { createReview, getSpecificReview } from '../actions/index.js';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useData } from '../context/index.jsx';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Page to create new review
 * @param {function} handleNext - Function to proceed to the next step
 * @returns JSX Element
 */
const NewReviewCard = ({ handleNext }) => {
  const { formData, updateFormData, reviewID, setReviewID } = useData();
  const { user } = useContext(AuthContext);
  const accessToken = user?.access_token;


    const validationSchema = Yup.object({
        reviewName: Yup.string().required('Tile is required'),
        reviewResearchQuestion: Yup.string().optional(),
        eligibilityCriteria: Yup.array()
            .of(
                Yup.object().shape({
                    label: Yup.string().required('Label is required'),
                    included: Yup.string().optional(),
                    excluded: Yup.string().optional(),
                })
            )
            .test('has-label', 'At least one item is required', (value) => {
                return value && value.some(item => item.label.trim() !== '');
            }),
    })

    const { control, handleSubmit, register, setValue, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            reviewName: '',
            reviewResearchQuestion: '',
            eligibilityCriteria: [],
        },
        resolver: yupResolver(validationSchema)
    })
    
  useEffect(() => {
    if (reviewID && accessToken) {
      const fetchReviewData = async () => {
        try {
          const response = await getSpecificReview(reviewID);

          // Map the response data to your formData structure
          const newFormData = {
            reviewName: response.review_model.review_title,
            reviewResearchQuestion: response.review_model.review_research_question,
            eligibilityCriteria: response.eligibility_model.map((criteria) => ({
              label: criteria.pico_tag,
              included: criteria.inclusion_criteria,
              excluded: criteria.exclusion_criteria,
            })),
          };

          // Update the context
          updateFormData(newFormData);

          // Reset the form with new data
          reset(newFormData);
        } catch (error) {
          console.error('Error fetching review data:', error);
          toast.error('Error fetching review data');
        }
      };

      fetchReviewData();
    }
  }, [reviewID, reset]);

    const handletableChange = (data) => {
        setValue('eligibilityCriteria', data)
    }

    const onSubmit = async (data) => {
        console.log("Call with:", data)
        updateFormData(data)
        try {
            const mappedData = {
                "review_request": { 
                  "review_title": data.reviewName,
                  "review_research_question": data.reviewResearchQuestion,
                },
                "criteria_requests": data.eligibilityCriteria.map((criteria) => ({
                    pico_tag: criteria.label,
                    inclusion_criteria: criteria.included,
                    exclusion_criteria: criteria.excluded,
                })),
              }
            const response = await createReview(mappedData)          
            
            if (response.status == 201) {

                setReviewID(response.data.review_id)

                toast.success(response.request.statusText, {
                    autoClose: 2000,
                    onClose: () => {
                        // startLLM(userId, res.reviewID)
                        handleNext()
                    }
                })
                
            } else {
                toast.error(response.request.statusText)
            }
        } catch (error) {
            toast.error("Error")
        }
    }

    return (
        <Container sx={{ paddingBottom: '50px' }}>
            <Box>
                <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '20px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <FormControl>
                        <FormHelperText sx={{
                            fontWeight: 500, margin: '10px 0', fontSize: 20, color: '#11142d'
                        }}>Title of your Review:</FormHelperText>
                        <TextField
                            {...register('reviewName')}
                            id='reviewName'
                            name="reviewName"
                            variant='outlined'
                            maxRows={Infinity}
                            multiline
                            fullWidth
                            error={!!errors.reviewName}
                            helperText={errors.reviewName?.message}
                            defaultValue={formData.reviewName}
                            disabled={reviewID !== undefined && reviewID !== null}
                        />
                    </FormControl>


                    <FormControl>
                        <FormHelperText sx={{
                            fontWeight: 500, margin: '10px 0', fontSize: 20, color: '#11142d'
                        }}>Reserach Question:</FormHelperText>
                        <TextField
                            {...register('reviewResearchQuestion')}
                            id='reviewResearchQuestion'
                            name="reviewResearchQuestion"
                            variant='outlined'
                            maxRows={Infinity}
                            multiline
                            fullWidth
                            error={!!errors.reviewResearchQuestion}
                            helperText={errors.reviewResearchQuestion?.message}
                            defaultValue={formData.reviewResearchQuestion}
                            disabled={reviewID !== undefined && reviewID !== null}
                        />
                    </FormControl>


                    <FormControl>
                        <FormHelperText sx={{
                            fontWeight: 500, margin: '10px 0', fontSize: 20, color: '#11142d'
                        }}>Eligibility Criteria:</FormHelperText>

                        <Typography style={{ textAlign: 'justify' }}>To ensure that NeutrinoReview performs optimally, please provide clear, specific, and straightforward inclusion and exclusion criteria. Avoid
                            combining several criteria into one. Also, consider that many specifications that are obvious to you as a human expert might not be for our AI
                            system. This will help the model accurately understand and apply your criteria during the automated screening process. You can find detailed
                            instructions and examples in <Link to='/user-guide'>the User Guide</Link>.</Typography>


                        <EligibilityCriteriaTable
                            control={control}
                            onChange={handletableChange}
                            error={errors.eligibilityCriteria} helperText={errors.eligibilityCriteria?.message}
                            data={formData.eligibilityCriteria}
                            reviewID={reviewID}
                        />

                    </FormControl>

                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                        <Button type="submit" variant="contained" style={{ backgroundColor: 'rgb(59, 82, 187)', width: '450px' }} disabled={reviewID !== undefined && reviewID !== null}>Create Review</Button>
                    </div>
                </form>
            </Box>
        </Container>
    )
}

export default NewReviewCard