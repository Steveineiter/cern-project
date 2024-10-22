import axios from 'axios'
import { API_URL } from '../utils/constants'
import axiosAuthorization from '../api/axiosAuthorization';

const url = API_URL

export const getSpecificReview = (reviewID) => axiosAuthorization.get(`/reviews/${reviewID}`)

export const getReviews = () => axiosAuthorization.get(`/reviews/`)

export const createReview = (data) => axiosAuthorization.post('/reviews/', data)

export const deleteReview = (reviewID) => axiosAuthorization.delete(`/reviews/${reviewID}/delete`)

export const setLLMAutomationLevel = (reviewID, llm_level_of_automation) => axiosAuthorization.patch(`/reviews/${reviewID}/automated-screening/llm-automation-level`, { llm_level_of_automation: llm_level_of_automation })

export const stopResumeLLM = (reviewID, typeAction) => axiosAuthorization.patch(`/reviews/${reviewID}/automated-screening/progress/action?action=${typeAction}`)

export const getResultsLLM = (reviewID) => axiosAuthorization.get(`/reviews/${reviewID}/automated-screening/progress`)

export const getEligibilityCriteria = (reviewID) => axiosAuthorization.get(`/reviews/${reviewID}/eligibility-criteria`)

export const getNextPaper = (reviewID) => axiosAuthorization.get(`/reviews/${reviewID}/manual-screening/next-paper`)

export const setDecision = (reviewID, paperID, data) => axiosAuthorization.patch(`/reviews/${reviewID}/manual-screening/${paperID}/decision`, data)

export const getResultsManual = (reviewID) => axiosAuthorization.get(`/reviews/${reviewID}/results-manual`)

export const getResultReview = (reviewID) => axiosAuthorization.get(`/reviews/${reviewID}/results`)

export const getCSV = (reviewID) => axiosAuthorization.get(`/reviews/${reviewID}/results/csv`, { headers: { 'Content-Type': 'application/json' } })

export const editTitleReview = (reviewID, title) => axiosAuthorization.patch(`/reviews/${reviewID}/edit-title`, { title: title }, { headers: { 'Content-Type': 'application/json' } })

export const getPreviousArticle = (reviewID, currentPaperID) => axiosAuthorization.get(`/reviews/${reviewID}/manual-screening/previous-article?current_paper_id=${currentPaperID}`)

export const getNextArticle = (reviewID, currentPaperID) => axiosAuthorization.get(`/reviews/${reviewID}/manual-screening/next-article?current_paper_id=${currentPaperID}`)
