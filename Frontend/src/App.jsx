import './App.css'
import { useState, useEffect } from 'react'
import HomePage from "./pages/HomePage"
import UserGuideCard from "./pages/UserGuideCard"
import Dashboard from "./pages/Dashboard"
import HorizontalNonLinearStepper from './pages/HorizontalGuid'
import { DataProvider } from './context/index'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Footer from './components/Footer'
import Header from './components/Header'
import Mobile from './pages/Mobile'
import Callback from './components/Callback';
import { AuthProvider } from './context/AuthContext';
import AutomationLevelSelector from './pages/AutomationLevelSelection'


const App = () => {
  const [width, setWidth] = useState(window.innerWidth)

  function handleWindowSizeChange() {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  const isMobile = width <= 768

  return (
    <BrowserRouter>
      {isMobile ? (
        <>
          <Header isMobile={isMobile} />
          <Mobile />
        </>
      ) : (
        <>
          <AuthProvider>
            <DataProvider>
              <Header isMobile={isMobile} />
              <ToastContainer />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/userguide" element={<UserGuideCard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/new-review" element={<HorizontalNonLinearStepper />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/test" element={<AutomationLevelSelector />} />
              </Routes>
              <Footer />
            </DataProvider>
          </AuthProvider>
        </>
      )}
    </BrowserRouter>
  )
}

export default App
