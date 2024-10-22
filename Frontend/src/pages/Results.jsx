import Statistics from "../components/Statistics"
import { getResultReview } from '../actions/index.js'
import { useState, useEffect } from 'react'
import Download from "../components/Download"
import ListCitations from "../components/ListCitations"
import PrismaDiagram from "../components/PrismaDiagram"
import { CircularProgress } from "@mui/material"
import { useData } from '../context/index.jsx'

/**
 * Result page
 * @returns 
 */
const Results = () => {
  const { reviewID, userId } = useData()

  const [statistics, setStatictics] = useState([])
  const [citations, setCitations] = useState([])
  const [prismaData, setPrismaData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchdata = async () => {
      const res = await getResultReview(reviewID)
      console.log(res)

      setPrismaData(res.prismaData)
      setStatictics(res.statistics)
      setCitations(res.papers)

      setLoading(false)
    }
    fetchdata()
  }, [reviewID])

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <PrismaDiagram prismaData={prismaData} />
          <Statistics statistics={statistics} />
          <ListCitations citations={citations} />
          <Download />
        </>
      )}
    </>
  )
}


export default Results