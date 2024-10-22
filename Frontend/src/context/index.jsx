import { createContext, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext';

const DataContext = createContext()

export const useData = () => useContext(DataContext)

/**
 * Data which is shared between components
 * @param {object} children
 * @returns 
 */
export const DataProvider = ({ children }) => {
    // Access the user object from AuthContext
    const { user } = useContext(AuthContext);

    // Extract userId from the user object
    const userId = user ? user.profile.sub : null

    // Stepper
    // Always start from first step
    const [activateStep, setActivateStep] = useState(0)

    // Data from form in  first step
    const [formData, setFormData] = useState({
        reviewName: null,
        eligibilityCriteria: null,
    })

    // review ID from backend after submit the form
    const [reviewID, setReviewID] = useState(null)


    const updateFormData = (data) => {

        setFormData(prevData => ({
            ...prevData,
            ...data
        }))
    }

    return (
        <DataContext.Provider value={{ activateStep, formData, reviewID, userId, setActivateStep, updateFormData, setReviewID }}>
            {children}
        </DataContext.Provider>
    )
}
