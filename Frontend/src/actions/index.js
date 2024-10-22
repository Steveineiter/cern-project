import * as api from '../api/index.js'


export const getSpecificReview = async (reviewID) => {
    try {
        const reponse = await api.getSpecificReview(reviewID)
        return reponse.data
    } catch (err) {
        throw err
    }
}

export const getReviews = async () => {
    try {
        const reponse = await api.getReviews()
        return reponse.data
    } catch (err) {
        throw err
    }
}

export const createReview = async (data) => {
    try {
        const reponse = await api.createReview(data)

        return reponse
    } catch (err) {
        throw err
    }
}

export const deleteReview = async (reviewID) => {
    try {
        const reponse = await api.deleteReview(reviewID)

        return reponse.data
    } catch (err) {
        throw err
    }
}

export const getResultsLLM = async (reviewID) => {
    try {
        const reponse = await api.getResultsLLM(reviewID)

        return reponse.data
    } catch (err) {
        throw err
    }
}


export const getEligibilityCriteria = async (reviewId) => {
    try {
        const reponse = await api.getEligibilityCriteria(reviewId)

        return reponse.data
    } catch (err) {
        throw err
    }
}

export const getNextPaper = async (reviewID) => {
    try {
        const reponse = await api.getNextPaper(reviewID)

        return reponse.data
    } catch (err) {
        throw err
    }
}

export const setDecision = async (reviewID, paperID, data) => {
    try {
        const reponse = await api.setDecision(reviewID, paperID, data)

        return reponse
    } catch (err) {
        throw err
    }
}

export const getResultsManual = async (reviewID,) => {
    try {
        const reponse = await api.getResultsManual(reviewID,)

        return reponse.data
    } catch (err) {
        throw err
    }
}

export const getResultReview = async (reviewID) => {
    try {
        const reponse = await api.getResultReview(reviewID)

        return reponse.data
    } catch (err) {
        throw err
    }
}

export const setLLMAutomationLevel = async (reviewID, levelOfAutomation) => {
    try {
        const reponse = await api.setLLMAutomationLevel(reviewID, levelOfAutomation)

        return reponse.data
    } catch (err) {
        throw err
    }
}

export const stopResumeLLM = async (reviewID, typeAction) => {
    try {
        const reponse = await api.stopResumeLLM(reviewID, typeAction)

        return reponse
    } catch (err) {
        throw err
    }
}

export const getCSV = async (reviewID) => {
    try {
        const reponse = await api.getCSV(reviewID)

        const blob = reponse.data
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')

        link.href = url
        link.setAttribute('download', 'review_data.csv')

        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)

        return
    } catch (err) {
        throw err
    }
}

export const editTitleReview = async (reviewID, title) => {
    try {
        const reponse = await api.editTitleReview(reviewID, title)

        return reponse.data
    } catch (err) {
        throw err
    }
}

export const getPreviousArticle = async (reviewID, currentPaperID) => {
    try {
        const reponse = await api.getPreviousArticle(reviewID, currentPaperID)

        return reponse.data
    } catch (err) {
        throw err
    }
}

export const getNextArticle = async (reviewID, currentPaperID) => {
    try {
        const reponse = await api.getNextArticle(reviewID, currentPaperID)

        return reponse.data
    } catch (err) {
        throw err
    }
}