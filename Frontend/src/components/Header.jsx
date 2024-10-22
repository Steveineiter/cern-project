import { useData } from '../context/index.jsx'
import '../index.css'
import { Link, useNavigate } from "react-router-dom"

/**
 * Header which will be render only if the application is not used not used on mobile
 * @param {boolean} isMobile
 * @returns 
 */
const Header = ({ isMobile }) => {

    if (!isMobile) {
        const { updateFormData } = useData()
    }

    const cleanContext = isMobile ? () => {
        updateFormData({
            reviewName: null,
            citations: null,
            eligibilityCriteria: null,
            levelOfAutomation: ''
        });
    } : null

    return (
        <div className="top-part">
            <div>
                <h1><Link style={{ color: 'white' }} to='/' onClick={isMobile ? cleanContext : null}>NeutrinoReview</Link></h1>
            </div>
        </div>
    )
}

export default Header